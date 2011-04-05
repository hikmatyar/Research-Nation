# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base

  helper :all # include all helpers, all the time
  #protect_from_forgery# See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  helper_method :logged_in?

  def logged_in?
    return true unless session[:user].blank?
    false
  end

  def is_admin?
    return true unless session[:admin].blank?
    false
  end

  def redirect_to_admin_login
    return redirect_to(:controller => "users", :action =>"login") unless is_admin?
  end

  def redirect_to_login
    return redirect_to(:controller => "users", :action =>"facebook_connect") unless logged_in?
  end

end
