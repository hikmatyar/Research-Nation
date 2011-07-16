class ResourcesController < ApplicationController

  require 'aws/s3'

  before_filter :redirect_to_login, :except => ["new", "upload_docs", "seller_page", "view_posts", "filter_results", "get_industries", "get_geography_list", "industries_count", "geography_count"]

  def new
    if logged_in?
      @user = User.find(session[:user])
      if session[:admin]
        user_id = params[:user_id].blank? ? session[:user] : params[:user_id]
        return redirect_to :action => 'upload_docs', :user_id => user_id
      end
      return redirect_to :action => 'upload_docs'
    end
    session[:post] = true
    return redirect_to :controller => 'resources', :action => 'upload_docs', :opt => 'login'
  end

  def upload_docs
    @resource = Resource.new
    if (params[:opt] != "login")
      @user =  User.find(session[:user])
    else
      @user = User.new
    end
  end

  def seller_page
    if logged_in?
      @user = User.find(session[:user])
    else
      @user = User.new
    end
    @resource = session[:admin].blank? ? (Resource.find_by_url_slug params[:url_slug], :conditions => {:is_deleted => false}) : (Resource.find_by_url_slug params[:url_slug])
    return render_404  if @resource.blank?
    @sample = @resource.attachments.sample.first unless @resource.attachments.sample.blank?
    @related_posts = Resource.find :all, :conditions => ['(industry =? or geography = ?) and (id != ?) AND is_deleted =?', @resource.industry, @resource.geography, @resource.id, false ], :limit => 10, :order => "industry, geography and created_at"
  end

  def request_resource
    @resource = Resource.find_by_url_slug params[:url_slug], :conditions => {:is_deleted => false}
    unless @resource.blank?
      UserMailer.deliver_request_resource(@resource, current_user)
      flash[:notice] = "Thank you, your request has been submitted to the author, and he will notify you directly as and when his publication is ready to be downloaded."
    else
      flash[:notice] = "Post not found."
    end
    return redirect_to :controller => "resources", :action => "seller_page", :url_slug => params[:url_slug]
  end

  def fill_your_profile
    flash[:notice] = "You need to create a profile before you can request for a resource. Please fill your profile below."
    redirect_to :controller => "profiles", :action => "edit_#{current_user.user_type}_profile"
  end

  def view_posts
    @user = User.find(session[:user]) if logged_in?
    if params[:filter].blank?
      @resources = Resource.find :all, :order => 'created_at DESC', :conditions => {:is_deleted => false}
    else
      @resources = Resource.find :all, :conditions => ['(industry = ? OR geography = ?) AND is_deleted = ?', params[:filter], params[:filter],false]
    end
  end

  def create_post
    resource = Resource.new(params[:resource])
    user_id = params[:user_id].blank? ? session[:user] : params[:user_id]
    user = User.find user_id
    unless user.blank?
      user.update_attributes(:about_me => params[:user][:about_me]) if params[:user]
      user.update_attributes(session[:user_details])
      resource.user_id = user.id
    end
    original_file_attachments = params[:attachment][:original] unless params[:attachment].blank?

    if resource.save
      resource.update_url_slug
      profile = resource.user.profile
      profile.update_profile_information(params[:profile], params[:key_individual]) unless params[:profile].blank?
      Attachment.add_file(params[:attachment][:sample], resource.id, "sample") unless params[:attachment].blank? || params[:attachment][:sample].blank?
      original_file_attachments && original_file_attachments.each do |key, file|
        Attachment.add_file(file, resource.id, "original")
      end
      session[:user_details] = nil
      session[:post] = nil
      return redirect_to :action => 'seller_page', :url_slug => resource.url_slug
    end
  end


  before_filter :edit_authorization, :only => [:remove_sample, :edit, :update, :delete]

  def remove_sample
    @resource.attachments.sample.first.remove_sample unless (@resource.attachments.blank? || @resource.attachments.sample.blank?)
    return redirect_to :controller => 'resources', :action => 'edit', :url_slug => params[:url_slug]
  end

  def add_attachment_details
    attachment = Attachment.find(params[:attachment][:id])
    attachment.update_attributes :details => params[:attachment][:details]
    return redirect_to :controller => "resources", :action => "seller_page", :url_slug => params[:url_slug]
  end

  def edit
  end

  def update
    unless params[:sample].blank?
      @resource.attachments.sample.first.destroy unless @resource.attachments.sample.blank?
      Attachment.add_file(params[:sample], @resource.id, "sample")
    end
    original_file_attachments = params[:attachment][:original] unless params[:attachment].blank?
    original_file_attachments && original_file_attachments.each do |key, file|
      Attachment.add_file(file, resource.id, "original")
    end
    if @resource.update_attributes(params[:resource])
      flash[:notice] = "Thank you! Your post has been updated"
    else
      flash[:error] = "Oops! looks like something's wrong"
    end
    return redirect_to :action => 'seller_page', :url_slug => params[:url_slug]

  end

  def delete
    sample = @resource.attachments.sample
    original_doc = @resource.attachments.original_files
    @resource.set_deleted
    #flash[:notice] = "Got it. Your post has been deleted"
    return redirect_to :controller => 'users', :action => 'profile' if session[:admin].blank?
    return redirect_to :controller => 'admin', :action => 'posts'
  end

  def filter_results
    conditions = "is_deleted = 0"
    unless params[:price].blank?
      price = params[:price].gsub("$","")
      conditions += " and selling_price <= #{price}"
    end
    unless params[:geography].blank?
      geography = convert_params_to_in_array(params[:geography])
      conditions += " and geography IN (#{geography})"
    end
    unless params[:industry].blank?
      industry = convert_params_to_in_array(params[:industry])
      conditions += " and industry IN (#{industry})"
    end
    @resources = Resource.find :all, :conditions => conditions, :order => 'selling_price ASC'
    unless params[:type].blank?
      if params[:type] == "offered"
        @resources = @resources.select{|resource| resource.attachments.blank? == true}
      elsif params[:type] == "published"
        @resources = @resources.select{|resource| resource.attachments.blank? == false}
      end
    end
    render :partial => 'posts'
  end


  def rate
    @resource = Resource.find_by_url_slug params[:id]
    @resource.rate(params[:stars], current_user, params[:dimension])
    render :update do |page|
      page.replace_html @resource.wrapper_dom_id(params), ratings_for(@resource, params.merge(:wrap => false), :remote_options => {:url => "/resources/rate/#{@resource.url_slug}"})
    end
  end

  def get_industries
    @industries = Resource.all(:select => 'distinct(industry)', :conditions => {:is_deleted => false}).collect(&:industry)
    render :text => @industries.join("\n")
  end

  def get_geography_list
    @geography = Resource.all(:select => 'distinct(geography)', :conditions => {:is_deleted => false}).collect(&:geography)
    render :text => @geography.join("\n")
  end

  def industries_count
    render :text => (Resource.all :conditions => {:industry => params[:industry], :is_deleted => false}).count
  end

  def geography_count
    render :text => (Resource.all :conditions => {:geography => params[:geography], :is_deleted => false}).count
  end


  def user_terms_and_conditions
    @resource = Resource.find_by_id params[:id]
    render :layout => false
  end

private
  def edit_authorization
    @resource = Resource.find_by_url_slug(params[:url_slug])
    if !@resource.blank? && (current_user.is_admin? || (current_user.own_resource?(@resource) && !@resource.is_deleted?))
      return true
    else
      return render_404
    end
  end

  def convert_params_to_in_array(input)
    result = ''
    input.split(",").uniq.each {|a| result += "'#{a.strip}',"}
    result = result[0..-2]
    result = result.split(",").uniq.join(",")
    result
  end
end
