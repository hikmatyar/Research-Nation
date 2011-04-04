class AdminController < ApplicationController

  before_filter :authenticate, :only => :dashboard
  layout 'main'
  def dashboard
    @resources = Resource.all
  end

  def see_authentications
    @users =  User.find :all, :conditions => ['facebook_uid > ?', 0 ]
  end

  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == "admin" && password == "researchnation"
    end
  end

end
