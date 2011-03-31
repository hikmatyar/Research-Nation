class MainController < ApplicationController
  layout 'main'

  def resources

  end

  def index
    @user = User.find(session[:user]) if logged_in?
  end

  def post
    return redirect_to :controller => 'users', :action => 'register' unless logged_in?
    user = User.find(session[:user])
    user_request  = params['do']
    actual_attachment_limits = true
    sample_attachment_limits = true
    unless params[:attachments].blank?
      actual_file = params[:attachments][:actual] if params[:attachments][:actual]
      sample_file = params[:attachments][:sample] if params[:attachments][:sample]
      actual_attachment_limits = Attachment.check_file_limits_for? actual_file if params[:attachments][:actual]
      sample_attachment_limits = Attachment.check_file_limits_for? sample_file if params[:attachments][:sample]
    end
    if user_request == "Sell" && sample_attachment_limits && actual_attachment_limits
      resource = Resource.new(params[:post])
      resource.selling_price = params[:price][:selling_price]
      resource.user_id = user.id
      new_resource = Resource.create_resource (resource)
      unless new_resource.blank?
        unless params[:attachments].blank?
          Attachment.add_file(actual_file, new_resource.id, "actual" ) if params[:attachments][:actual]
          Attachment.add_file(sample_file, new_resource.id, "sample" ) if params[:attachments][:sample]
        end
      end
      type = "selling_list"
    elsif user_request == "Buy"
      request = Request.new(params[:post])
      request.user_id = user.id
      Request.create_request(request)
      type = "buying_list"
    end
    return redirect_to :action => 'index', :type=> type
  end

  def buying_list
    @requests = Request.all
    render :layout => false
  end

  def selling_list
    @resources = Resource.all
    render :layout => false
  end

end
