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
    message.subject = params[:subject]
    message.body = params[:message]
    message.sender = User.find session[:user]
    message.recipient = User.find params[:user_id]
    if message.save
      ContactMailer.deliver_message_email message.recipient.email, message.id, request.host
      admin = User.find :first, :conditions => ['is_admin = ?', true]
      admin_message = Message.new
      admin_message.subject = "Forwarded Message: "+ message.subject
      admin_message.body = message.body + "<p style='margin:10px 57px 10px !important;'> Recipient : #{message.recipient.profile.name}<p>"
      admin_message.sender = message.sender
      admin_message.recipient = admin
      admin_message.save
      session[:message] = nil
			session[:seller_post] = nil
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
    if ContactMailer.deliver_contact_us_email(params[:name], params[:email], params[:subject], params[:message])
      flash[:notice] = "Thank you for your submission"
    else
      flash[:notice] = "Oops! You didn't prove that you are a human!"
    end
    return redirect_to :controller => 'main', :action => 'contact'
  end

end
