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
    recipient = params[:email]
    mail_body = params[:contact]

    if PostMailer.deliver_post_email(mail_body["name"], mail_body["email"], mail_body["subject"], mail_body["message"], recipient)
      return render :text => "Thank you for your submission. Please close this box to proceed."
    else
      render :text => "An error occured while sending your query"
    end
  end

  private

  def check_attachments
    @actual_attachment_limits = true
    @sample_attachment_limits = true

    unless params[:attachments].blank?
      @actual_file = params[:attachments][:actual] if params[:attachments][:actual]
      @sample_file = params[:attachments][:sample] if params[:attachments][:sample]
    end
    @actual_attachment_limits = Attachment.check_file_limits_for? @actual_file if @actual_file
    @sample_attachment_limits = Attachment.check_file_limits_for? @sample_file if @sample_file
  end

end
