class ResourcesController < ApplicationController

  require 'aws/s3'
  #before_filter :redirect_to_login, :only => [:delete, edit]

  def new
    @user = User.find(session[:user]) if logged_in?
    return redirect_to :action => 'upload_docs' if logged_in?
    session[:post] = true
    flash[:notice] = "Please take a minute to sign in before you create a post. Thanks!"
    return redirect_to :controller => 'users', :action => 'register' unless logged_in?
  end

  def post
      user = User.new params[:user]
      ( session[:user_details] = params[:user] and session[:post] = true ) unless logged_in?
      return redirect_to (:controller => 'users', :action => 'register' ) unless logged_in?
      return redirect_to :action => 'upload_docs'
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
      user.update_attributes(:is_expert => (params[:checkbox]=="true"? true : false ))
      user.update_attributes(session[:user_details])
      resource.user_id = session[:user]
      if resource.save
        Attachment.add_file(params[:sample], resource.id, "sample") unless params[:sample].blank?
        Attachment.add_file(params[:original], resource.id, "original")  unless params[:original].blank?
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
