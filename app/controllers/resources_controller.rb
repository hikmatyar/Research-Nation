class ResourcesController < ApplicationController

  require 'aws/s3'
#  before_filter :redirect_to_login, :only => [:new]

  def new
    if logged_in?
      @user = User.find(session[:user])
      return redirect_to :action => 'upload_docs'
    end
    session[:post] = true
    return redirect_to :controller => 'resources', :action => 'upload_docs', :opt => 'login'
  end

  def upload_docs
    @resource = Resource.new
    @user =  User.find(session[:user]) if (params[:opt] != "login")
  end

  def seller_page
    @user = User.find(session[:user]) if logged_in?
    @resource = Resource.find(params[:id])
    @sample = @resource.attachments.sample.first
  end

  def create_post
    if logged_in?
      resource = Resource.new(params[:resource])
      user = User.find session[:user]
      unless user.blank?
        user.update_attributes(:about_me => params[:user][:about_me]) if params[:user]
        user.update_attributes(session[:user_details])
        resource.user_id = user.id
      end
      original_file_attachments = params[:attachment][:original]

      if resource.save
        Attachment.add_file(params[:attachment][:sample], resource.id, "sample") unless params[:attachment][:sample].blank?
        #Attachment.add_file(params[:original], resource.id, "original")  unless params[:original].blank?
        original_file_attachments.each do |key, file|
          Attachment.add_file(file, resource.id, "original")
        end
        session[:user_details] = nil
        session[:post] = nil
        flash[:notice] = "Thank you! Your post has been created"
        return redirect_to :action => 'seller_page', :id => resource.id
      end

    else
      return redirect_to :controller => 'users', :action => 'register'
    end
  end

  def edit
    @resource = Resource.find(params[:id])
    @user = User.find(params[:user])
  end

  def view_posts
    @user = User.find(session[:user]) if logged_in?
    @resources = Resource.find :all, :order => 'created_at DESC'
  end

  def update
    resource = Resource.find(params[:id])
    unless params[:sample].blank?
      resource.attachments.sample.first.destroy unless resource.attachments.sample.blank?
      Attachment.add_file(params[:sample], resource.id, "sample")
    end
    if resource.update_attributes(params[:resource])
      flash[:notice] = "Thank you! Your post has been updated"
    else
      flash[:error] = "Oops! looks like something's wrong"
    end
    return redirect_to :controller => 'users', :action => 'profile'

  end

  def delete
    resource = Resource.find(params[:id])
    sample = resource.attachments.sample
    original_doc = resource.attachments.original
    resource.destroy
    @resources = Resource.paginate :page => params[:page], :order => 'created_at DESC'
    flash[:notice] = "Got it. Your post has been deleted"
    return redirect_to :controller => 'users', :action => 'profile' if params[:request] = "user"
    return redirect_to :controller => 'admin', :action => 'dashboard' if params[:request] = "admin"
  end

  def add_vote
    vote = Vote.new
    vote.resource_id = params[:resource]
    vote.user_id = session[:user]
  end

  def payment
    redirect_to_login unless logged_in?
    @resource = Resource.find params[:id]
  end

  def filter_results
    geography = params[:geography].blank? ? Resource.all(:select => 'distinct(geography)').collect(&:geography) : params[:geography].split(",");
    industries = params[:industry].blank? ? Resource.all(:select => 'distinct(industry)').collect(&:industry) : params[:industry].split(",");
    @resources = Resource.find :all, :conditions => [ 'selling_price <= ? and geography IN(?) and industry IN(?)',  params[:price], geography , industries ], :order => 'selling_price ASC'
    render :partial => 'posts'
  end

  def reset
    @resources = Resource.find :all, :order => 'created_at DESC'
    render :partial => 'posts'
  end

  def remove_sample
    attachment = Attachment.find params[:id]
    attachment.remove_sample
  end
=begin
  def filter_by_author_name

    name = params[:name].split(" ")
    resources = Array.new
    users = User.find :all, :conditions => ['first_name = ? and last_name = ? ', name.first, name[1..name.length].join(" ") ]
    users.each do |user|
      resources.push(user.resources)
    end
    @resources = resources.flatten
    render :partial => 'posts'
  end
=end
  def get_industries
    @industries = Resource.all(:select => 'distinct(industry)').collect(&:industry)
    render :text => @industries.join("\n")
  end

  def get_geography_list
    @geography = Resource.all(:select => 'distinct(geography)').collect(&:geography)
    render :text => @geography.join("\n")
  end

  def industries_count
    render :text => (Resource.find_all_by_industry params[:industry]).count
  end

  def geography_count
    render :text => (Resource.find_all_by_geography params[:geography]).count
  end
end
