class MainController < ApplicationController
  layout 'main'

  def index
    @user = User.find(session[:user]) if logged_in?
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
      flash[:success] = "New resource created successfully" if new_resource
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

  def send_mail_to_seller
    recipient = User.find_by_email params[:email]
    mail_body = params[:contact]

    if PostMailer.deliver_post_email(mail_body["name"], mail_body["email"], mail_body["subject"], mail_body["message"], recipient)
      return render :text => "<p class='flash'>Thank you! Your message has been sent</p>"
    else
      render :text => "An error occured while sending your query"
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
