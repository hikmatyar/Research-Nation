class ResourcesController < ApplicationController

  require 'aws/s3'
  #before_filter :redirect_to_login, :only => [:delete, edit]

  def new
    @user = User.find(session[:user]) if logged_in?
  end

  def post
      user = logged_in? ? (User.find(session[:user])) : (User.new(params[:user]))
      user.update_attributes(params[:user]) if logged_in?
      ( session[:user_details] = params[:user] and session[:post] = true ) unless logged_in?
      return redirect_to (:controller => 'users', :action => 'register' ) unless logged_in?
      return redirect_to :action => 'upload_docs'
  end

  def seller_page
    @user = User.find(session[:user]) if logged_in?
    @resource = Resource.find(params[:id])
    @sample = @resource.attachments.sample.first
  end

  def delete
    resource = Resource.find(params[:id])
    resource.destroy
    @resources = Resource.paginate :page => params[:page], :order => 'created_at DESC'
    render :layout => false
  end

  def edit
    @resource = Resource.find(params[:id])
  end

  def view_posts
    @user = User.find(session[:user]) if logged_in?
    @resources = Resource.paginate :page => params[:page], :order => 'created_at DESC'
  end

  def create_post

    if logged_in?
      resource = Resource.new(params[:resource])
      user = User.find session[:user]
      user.update_attributes(session[:user_details])
      resource.user_id = session[:user]
      if resource.save
        Attachment.add_file( params[:sample], resource.id, "sample" ) unless params[:sample].blank?
        Attachment.add_file( params[:original], resource.id, "original" )
        session[:user_details] = nil
        session[:post] = nil
        return redirect_to :action => 'seller_page', :id => resource.id
      end
    else
      return redirect_to :controller => 'users', :action => 'register'
    end
  end

  def update
    resource = Resource.find(params[:id])
    if resource.update_attributes(params[:resource])
      flash[:success] = "The Post was updated successfully."
    else
      flash[:error] = "Unable to update post."
    end
    return redirect_to :controller => 'main', :action => 'index'

  end

  def payment
    @resource = Resource.find params[:id]
  end

end
