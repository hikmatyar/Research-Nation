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
    flash[:success] = "New resource created successfully" if new_resource
    return redirect_to :action => 'index'
  end


  def buying_list
    @requests = Request.find :all, :order => 'created_at DESC'
    render :layout => false
  end

  def selling_list
    #@resources = Resource.find :all, :order => 'created_at DESC'
    @user = User.find(session[:user]) if logged_in?
    @resources = Resource.paginate :page => params[:page], :order => 'created_at DESC'
    render :layout => false
  end

  def send_mail_to_seller
    return redirect_to :controller => 'main', :action => 'index' unless logged_in?
    recipient = params[:email]
    mail_body = params[:contact]

    if PostMailer.deliver_post_email(mail_body["name"], mail_body["email"], mail_body["subject"], mail_body["message"], recipient)
      flash[:success] = "Your mail has successfully been sent"
    else
      flash[:error] = "An error occured while sending email"
    end
    return redirect_to :controller => 'main', :action => 'index'
  end

  def mutual_friends
    return render :text => 'Login to see mutual friends' unless logged_in?
    source_user = User.find session[:user]
    target_user = User.find params[:id]
    facebook_settings = YAML::load(File.open("#{RAILS_ROOT}/config/facebooker.yml"))
    url = URI.parse "https://api.facebook.com/method/friends.getMutualFriends?target_uid=#{target_user.facebook_uid}&source_uid=#{source_user.facebook_uid}&access_token="+CGI.escape(facebook_settings[RAILS_ENV]['access_token'])+"&format=json"
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == 'https')

    tmp_url = url.path+"?"+url.query
    request = Net::HTTP::Get.new(tmp_url)
    response = http.request(request)
    data = response.body
    return render :text => data.split(",").count.to_s+" Mutual Friends"

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
