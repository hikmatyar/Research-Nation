class ResourcesController < ApplicationController

  layout 'main'
  require 'aws/s3'

  before_filter :redirect_to_login

  def post
    if logged_in?
      @user = User.find(session[:user])
    else
      redirect_to :controller => 'main', :action => 'index'
    end
  end

  def what_others_are_selling
    @user = User.find(session[:user]) if logged_in?
    @resource = Resource.find(params[:id])
  end

end
