
# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
require 'monkeywrench'
class ApplicationController < ActionController::Base

  helper :all # include all helpers, all the time
  #protect_from_forgery# See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  helper_method :logged_in?, :is_admin?, :current_user

  def logged_in?
    return true unless session[:user].blank?
    false
  end

  def current_user
    return (User.find session[:user]) unless session[:user].blank?
  end
  def is_admin?
    return true unless session[:admin].blank?
    false
  end

  def redirect_to_admin_login
    return redirect_to(:controller => "users", :action =>"register", :opt => 'login') unless is_admin?
  end

  def redirect_to_home
    return redirect_to :controller => 'main'  , :action => 'index'
  end

  def redirect_to_login
    return redirect_to(:controller => "users", :action =>"register") unless logged_in?
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

  def subscribe_to_newsletter user
    settings = YAML::load(File.open("#{RAILS_ROOT}/config/monkeywrench.yml"))
    url = URI.parse "http://us2.api.mailchimp.com/1.3/?method=listSubscribe&apikey=#{settings[RAILS_ENV]['api_key']}&id=#{settings[RAILS_ENV]['list_id']}&email_address=#{user.email}&merge_vars[FNAME]=#{user.first_name}&merge_vars[LNAME]=#{user.last_name}&double_optin=false&send_welcome=true&output=json"

      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = (url.scheme == 'https')

      tmp_url = url.path+"?"+url.query
      request = Net::HTTP::Get.new(tmp_url)
      response = http.request(request)
      data = response.body
      flash.now[:notice] = "You are now subscribed to Research Nation Newsletters" if data == "true"
      flash.now[:error] = "An error occured" unless data == "true"
  end
end
