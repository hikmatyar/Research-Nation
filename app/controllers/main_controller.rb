class MainController < ApplicationController
  layout 'main'

  def index
    @user = User.find(session[:user]) if logged_in?
    @user = User.new unless logged_in?
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


  def buying_list
    @requests = Request.find :all, :order => 'created_at DESC'
    render :layout => false
  end

  def selling_list
    @user = User.find(session[:user]) if logged_in?
    @resources = Resource.paginate :page => params[:page], :order => 'created_at DESC'
    render :layout => false
  end

  def send_message
    message = Message.new
    message.subject = params["subject"]
    message.body = params[:message]
    message.sender = User.find session[:user]
    message.recipient = User.find params[:user_id]
    if message.save

    #if PostMailer.deliver_post_email(mail_body["name"], mail_body["email"], mail_body["subject"], mail_body["message"], recipient)
      return render :text => "<p class='flash'>Thank you! Your message has been sent</p>"
    else
      render :text => "Hmm. Something seems to be wrong...let me look into it"
    end
  end

  def send_feedback
    message = params[:feedback]
    flash[:success] = "Thank you for your submission" if ContactMailer.deliver_feedback_email message
    return redirect_to :controller => 'main', :action => 'about'
  end

  def contact_us
    flash[:notice] = "Thank you for your submission" if ContactMailer.deliver_contact_us_email params[:name], params[:email], params[:subject], params[:message]
    return redirect_to :controller => 'main', :action => 'contact'
  end

end
