require 'time_diff'
class UsersController < ApplicationController

  before_filter :check_session, :only => [:update, :edit, :logout ] 
  before_filter :redirect_to_login, :only => [:purchases]

=begin
  def facebook_connect
    facebook_settings = YAML::load(File.open("#{RAILS_ROOT}/config/facebooker.yml"))
    return redirect_to "https://graph.facebook.com/oauth/authorize?client_id=#{facebook_settings[RAILS_ENV]['application_id']}&redirect_uri=http://#{request.host}/users/facebook_oauth_callback&scope=offline_access,publish_stream,user_birthday,user_location, user_education_history,user_location,email,user_work_history" if production_env?
    return redirect_to "https://graph.facebook.com/oauth/authorize?client_id=#{facebook_settings[RAILS_ENV]['application_id']}&redirect_uri=http://#{request.host}:#{request.port}/users/facebook_oauth_callback&scope=offline_access,publish_stream,user_birthday,user_location, user_education_history,user_location,email,user_work_history"
  end

  def facebook_oauth_callback
    unless params[:code].nil?
      facebook_settings = YAML::load(File.open("#{RAILS_ROOT}/config/facebooker.yml"))
      callback = ""
      if production_env?
        callback = "http://#{request.host}/users/facebook_oauth_callback"
      else
        callback = "http://#{request.host}:#{request.port}/users/facebook_oauth_callback"
      end
      url = URI.parse("https://graph.facebook.com/oauth/access_token?client_id=#{facebook_settings[RAILS_ENV]['application_id']}&redirect_uri=#{callback}&client_secret=#{facebook_settings[RAILS_ENV]['secret_key']}&code=#{CGI::escape(params[:code])}")
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = (url.scheme == 'https')

      tmp_url = url.path+"?"+url.query
      request = Net::HTTP::Get.new(tmp_url)
      response = http.request(request)
      data = response.body
      access_token = data.split("=")[1]

      url = URI.parse("https://graph.facebook.com/me?access_token=#{CGI::escape(access_token)}")
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = (url.scheme == 'https')
      tmp_url = url.path+"?"+url.query
      request = Net::HTTP::Get.new(tmp_url)
      response = http.request(request)
      user_data = response.body
      user_data_obj = JSON.parse(user_data)
      flash[:notice] = 'Facebook successfully connected.'

      valid_user = User.find_by_email(user_data_obj["email"])
      unless valid_user.blank?
        session[:user] = valid_user.id
        return redirect_to :controller => 'resources', :action => 'upload_docs' if session[:post]
        return redirect_to :controller => 'profiles', :action => 'create' if session[:profile]
        redirect_to :controller => 'resources', :action => 'view_posts'

      else
        user = {:first_name => user_data_obj["first_name"], :last_name => user_data_obj["last_name"], :email => user_data_obj["email"], :facebook_uid => user_data_obj["id"], :gender => user_data_obj["gender"], :birthday => user_data_obj["birthday"]}
        user["location"] = user_data_obj["location"]["name"] unless user_data_obj["location"].blank?
        user["work"] = user_data_obj["work"][0]["position"]["name"] unless user_data_obj["work"].blank?
        user["company"] = user_data_obj["work"][0]["employer"]["name"] unless user_data_obj["work"].blank?

        if ( new_user = User.create_facebook_user user)
          return redirect_to :action => "subscribe_newsletter", :user =>  params[:user] if params["get_updates"]=="yes"
          session[:user] = new_user.id
        end
        return redirect_to :controller => 'resources', :action => 'upload_docs' if session[:post]
        return redirect_to :controller => 'profiles', :action => 'create' if session[:profile]
        return redirect_to :controller => 'resources', :action => 'view_posts'
      end
    end
  end
=end
  def register
    @user = User.new(params[:user])
    @user_type = params[:user_type]? params[:user_type] : "normal"
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      session[:user] = @user.id
      UserMailer.deliver_registration_email(@user.first_name, @user.last_name, @user.email)
      subscribe_to_newsletter @user if params["get_updates"]=="yes"

      profile = Profile.new
      profile.user_id = @user.id
      (@user.user_type == "Seller (Company)")? profile.profile_type = "company" : profile.profile_type = "individual"
      profile.save

      key_individual = KeyIndividual.new
      key_individual.profile_id = profile.id
      key_individual.save

      if @user.user_type == "Seller (Company)"
        link = "<u><a href='/profiles/edit_company_profile/#{profile.id}'>here</a></u>"
      else
        link = "<u><a href='/profiles/edit_individual_profile/#{profile.id}'>here</a></u>"
      end

      flash[:notice] = "Please complete your profile by clicking #{link}"
      return redirect_to :controller => 'users', :action => 'profile'

      return redirect_to :controller => "resources", :action => "view_posts"
    end
    @user[:password] = ""
    return render :action => 'register'
  end

  def authenticate
    flash[:error] = ""
    @user = User.new(params[:login])
    valid_user = User.find(:first,:conditions => ["email = ? and password = ?", @user.email, @user.password])
    if valid_user
      session[:user] = valid_user.id
      session[:admin]= valid_user.id if valid_user.is_admin?
      return redirect_to :controller => 'resources', :action => 'upload_docs' if session[:post]
      return redirect_to :controller => 'profiles', :action => 'create' if session[:profile]
      if session[:message]
        #return redirect_to :controller => 'profiles', :action => 'profile_page', :url_slug => session[:profile_id], :reveal_message => true unless session[:profile_id].blank?
        return redirect_to :controller => 'resources', :action => 'seller_page', :id => session[:seller_post], :reveal_message => true unless session[:seller_post].blank?
      end
      return redirect_to :controller => 'users', :action => 'profile'
    else
      flash[:error] = "Oops! Something wrong with your username/password"
      render :action => 'register', :opt => 'login'
    end
  end

  def profile
    @user = User.find session[:user] if logged_in?
  end

  def logout
    reset_session
    redirect_to :controller => 'main', :action=> 'index'
  end

  def resources_list
    user = User.find params[:id]
    @resources = user.resources
  end

  def facebook_user
    @user = User.find_by_facebook_uid params[:id]
  end

  def forgot_password
    if request.post?
      flash[:error] = ""
      user = User.find_by_email params[:email_address]
      flash[:error] = "Oops! Please try again" if user.blank?
      unless user.blank?
        session[:token]=user.generate_token
        UserMailer.deliver_password_reset_email(user, session[:token])
        flash[:notice] = "An email has been sent to your Mail Address"
      end
    end

  end

  def reset_password
    if params[:token] == session[:token] && params[:password] == params[:confirm_password]
      session[:token]=nil
      user = User.find params[:id]
      user.update_attributes :password => params[:password]
      session[:user] = user.id
      flash[:notice] = " Password successfully changed "
    end
    return redirect_to :controller => 'resources' , :action => 'view_posts'
  end

  def subscribe_newsletter
    user = User.new params[:user]
    subscribe_to_newsletter user
    return redirect_to :controller => 'main', :action => 'index'
  end

  def unique_users
    @users = User.all.collect(&:name).uniq
    render :text => @users.join("\n")
  end

  def purchases
    purchases = Order.user_purchases(current_user.id)
    render :partial => "/users/purchases", :locals => {:purchases => purchases }, :layout => false
  end

  def listings
    user = User.find session[:user]
    render :partial => "/users/listings", :locals => {:resources => user.resources}, :layout => false
  end

  def pending_earnings
    @user = User.find session[:user]
    render :partial => "/users/pending_earnings", :layout => false
  end

  def monthly_earnings
    user = User.find session[:user]
    render :partial => "/users/monthly_earnings", :locals => {:earnings => user.monthly_earnings}, :layout => false
  end

  private

  def check_session
    return redirect_to :action => 'register', :opt => 'login' unless session[:user]
  end

end

