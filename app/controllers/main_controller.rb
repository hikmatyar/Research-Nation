class MainController < ApplicationController
  layout 'main'

  def resources

  end

  def index
    @user = User.find(session[:user]) if logged_in?
    @requests = Request.find :all, :limit => 5, :order => 'id DESC'
    @resources = Resource.find :all, :limit => 5, :order => 'id DESC'
  end

end
