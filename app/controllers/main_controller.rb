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
=begin
    check_attachments

    if @sample_attachment_limits && @actual_attachment_limits
=end
      resource = Resource.new(session[:post]? session[:post] : params[:post])
      session[:post] = nil
      resource.user_id = @user.id
      new_resource = Resource.create_resource(resource)
=begin
      unless new_resource.blank?
        unless params[:attachments].blank?
          new_resource.attachments << Attachment.add_file (@actual_file, new_resource.id, "actual") if params[:attachments][:actual]
          new_resource.attachments << Attachment.add_file(@sample_file, new_resource.id, "sample") if params[:attachments][:sample]
        end
      end
=end
=begin
    elsif user_request == "Buy"
      request = Request.new(params[:post])
      request.user_id = user.id
      Request.create_request(request)
      type = "buying_list"
=end
=begin
    end
=end
    flash[:success] = "New resource created successfully"
    return redirect_to :action => 'index'
  end


  def buying_list
    @requests = Request.find :all, :order => 'created_at DESC'
    render :layout => false
  end

  def selling_list
    #@resources = Resource.find :all, :order => 'created_at DESC'
    @resources = Resource.paginate :page => params[:page], :order => 'created_at DESC'
    render :layout => false
  end

  def send_mail_to_seller
    recipient = params[:email]
    mail_body = params[:contact]

    if PostMailer.deliver_post_email(mail_body["name"], mail_body["email"], mail_body["subject"], mail_body["message"], recipient)
      flash[:success] = "Your mail has successfully been sent"
    else
      flash[:error] = "An error occured while sending email"
    end
    return redirect_to :controller => 'main', :action => 'index'
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
