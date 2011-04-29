class MainController < ApplicationController
  layout 'main'

  def index
    if logged_in?
      @user = User.find(session[:user])
    else
      @user = User.new
    end
  end

  def post
    unless logged_in?
      session[:post] = params[:post]
      return redirect_to :controller => 'users', :action => 'register'
    end
    @user = User.find(session[:user])

      resource = Resource.new(session[:post]? session[:post] : params[:post])
      session[:post] = nil
      resource.user_id = @user.id
      new_resource = Resource.create_resource(resource)
      return redirect_to :action => 'index'
  end

  def send_message
    message = Message.new
    message.subject = params["subject"]
    message.body = params[:message]
    message.sender = User.find session[:user]
    message.recipient = User.find params[:user_id]
    if message.save
      return redirect_to :controller => 'users', :action => 'profile', :id => current_user.id if params[:referer]
      return render :nothing => true
    else
      render :text => "Hmm. Something seems to be wrong...let me look into it"
    end
  end
=begin
  def send_feedback
    message = params[:feedback]
    flash[:success] = "Thank you for your submission" if ContactMailer.deliver_feedback_email message
    return redirect_to :controller => 'main', :action => 'about'
  end
=end
  def contact_us
    flash[:notice] = "Thank you for your submission" if ContactMailer.deliver_contact_us_email params[:name], params[:email], params[:subject], params[:message]
    return redirect_to :controller => 'main', :action => 'contact'
  end

end
