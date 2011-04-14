
# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
require 'monkeywrench'
class ApplicationController < ActionController::Base

  helper :all # include all helpers, all the time
  #protect_from_forgery# See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  helper_method :logged_in?, :is_admin?

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

  def production_env?
    return RAILS_ENV == "production"
  end

  def get_mailchimp_list_members
    settings = YAML::load(File.open("#{RAILS_ROOT}/config/monkeywrench.yml"))
    MonkeyWrench::Config.new(:datacenter => "us2", :apikey => settings[RAILS_ENV]['api_key'])
    list = MonkeyWrench::List.find_by_name("Research Nation")
    return list.members(:full_details => true )
  end
end
