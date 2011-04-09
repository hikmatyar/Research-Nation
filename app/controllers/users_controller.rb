class UsersController < ApplicationController

  before_filter :check_session, :only => [:update, :edit, :logout ] 
  #[:register, :login, :create, :authenticate, :facebook_connect, :facebook_oauth_callback, :forgot_password, :reset_password, :new_password]

  def facebook_connect
    facebook_settings = YAML::load(File.open("#{RAILS_ROOT}/config/facebooker.yml"))
    redirect_to "https://graph.facebook.com/oauth/authorize?client_id=#{facebook_settings[RAILS_ENV]['application_id']}&redirect_uri=http://localhost:3000/users/facebook_oauth_callback&scope=offline_access,publish_stream,user_birthday,user_location, user_education_history,user_location,email,user_work_history"
  end

  def facebook_oauth_callback
    unless params[:code].nil?
      facebook_settings = YAML::load(File.open("#{RAILS_ROOT}/config/facebooker.yml"))
      callback = "http://localhost:3000/users/facebook_oauth_callback"

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
        redirect_to :controller => 'resources', :action => 'view_posts'

      else
        user = {:first_name => user_data_obj["first_name"], :last_name => user_data_obj["last_name"], :email => user_data_obj["email"], :facebook_uid => user_data_obj["id"], :gender => user_data_obj["gender"], :birthday => user_data_obj["birthday"]}
        user["location"] = user_data_obj["location"]["name"] unless user_data_obj["location"].blank?
        user["work"] = user_data_obj["work"][0]["position"]["name"] unless user_data_obj["work"].blank?
        user["company"] = user_data_obj["work"][0]["employer"]["name"] unless user_data_obj["work"].blank?

        if ( new_user = User.create_facebook_user user)
          new_user.subscribe_to_newsletter
          session[:user] = new_user.id
        end
        return redirect_to :controller => 'resources', :action => 'view_posts'
      end
    end
  end

  def register
    @user = User.new(params[:user])
    @user_type = params[:user_type]? params[:user_type] : "normal"
  end

  def login
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      session[:user] = @user.id
      UserMailer.deliver_registration_email(@user.first_name, @user.last_name, @user.email)
      @user.subscribe_to_newsletter if params["get_updates"]=="yes"
      return redirect_to :controller => "resources", :action => "view_posts"
    end
    return render :action => 'register'
  end

  def edit
    @user = User.find_by_id(params[:id])
  end

  def update

    @user = User.find_by_id(params[:id])
    if @user.update_attributes params[:user]
      flash[:success] = "User details Updated"
      redirect_to :controller => 'main', :action => 'index'
    else
      flash[:error] = "Unable to update User Details"
      render :action => 'edit', :id => params[:id]
    end
  end

  def authenticate
    @user = User.new(params[:login])
    valid_user = User.find(:first,:conditions => ["email = ? and password = ?", @user.email, @user.password])
    if valid_user
      session[:user] = valid_user.id
      session[:admin]= valid_user.id if valid_user.is_admin?
      return redirect_to :controller => 'resources', :action => 'view_posts'
    else
      flash[:error] = "Invalid username/password"
      render :action => 'register', :opt => 'login'
    end
  end

    def logout
    if logged_in?
      reset_session
      redirect_to :controller => 'main', :action=> 'index'
    end
  end

  def facebook_user
    @user = User.find_by_facebook_uid params[:id]
  end

  def forgot_password

    if request.post?
      user = User.find_by_email params[:email]
      flash[:error] = "Could not find User with email #{params[:email]}" if user.blank?
      unless user.blank?
        session[:token]=user.generate_token
        UserMailer.deliver_password_reset_email(user, session[:token])
        flash[:success] = "An email has been sent to your Mail Address"
      end
    end

  end

  def reset_password
    if params[:token] == session[:token] && params[:password] == params[:confirm_password]
      session[:toekn]=nil
      user = User.find params[:id]
      user.update_attributes :password => params[:password]
      session[:user] = user.id
      flash[:success] = " Password successfullt changed "
    end
    return redirect_to :controller => 'resources' , :action => 'view_posts'
  end

  def subscribe_newsletter
    user = User.new
    user.email = params[:email]
    user.subscribe_to_newsletter
    redirect_to :controller => 'main', :action => 'index'
  end

  private

  def check_session
    return redirect_to :action => 'login' unless session[:user]
  end

end
