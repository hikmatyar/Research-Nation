class MainController < ApplicationController
  layout 'main'

  def resources

  end

  def index
    @user = User.find(session[:user]) if logged_in?
  end

  def post
    unless logged_in?
      session[:title] = params[:post][:title]
      session[:description] = params[:post][:description]
      session[:selling_price] = params[:post][:selling_price]
      unless params[:attachments].blank?
        session[:actual] = params[:attachments]
      end
      session[:post] = params[:post]
      return redirect_to :controller => 'users', :action => 'register'
    end
    user = User.find(session[:user])
    #user_request  = params['do']
    @actual_attachment_limits = true
    @sample_attachment_limits = true
    check_attachments
    if @sample_attachment_limits && @actual_attachment_limits
      resource = Resource.new(params[:post_data]? session[:post] : params[:post])
      resource.user_id = user.id
      new_resource = Resource.create_resource(resource)
      unless new_resource.blank?
        unless params[:attachments].blank?
          Attachment.add_file(actual_file, new_resource.id, "actual" ) if params[:attachments][:actual]
          Attachment.add_file(sample_file, new_resource.id, "sample" ) if params[:attachments][:sample]
        end
      end
      type = "selling_list"
=begin    elsif user_request == "Buy"
      request = Request.new(params[:post])
      request.user_id = user.id
      Request.create_request(request)
      type = "buying_list"
=end
    end
    flash[:success] = "You Post was uploaded Successfully"
    return redirect_to :action => 'index', :type=> type
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

  private

  def check_attachments
    unless params[:attachments].blank?
      @actual_file = params[:attachments][:actual] if params[:attachments][:actual]
      @sample_file = params[:attachments][:sample] if params[:attachments][:sample]
      @actual_file = session[:attachment][:actual] if params[:post_data]
      @sample_file = session[:attachment][:sample] if params[:post_data]
      @actual_attachment_limits = Attachment.check_file_limits_for? actual_file if @actual_file
      @sample_attachment_limits = Attachment.check_file_limits_for? sample_file if @sample_file
    end
  end

end
