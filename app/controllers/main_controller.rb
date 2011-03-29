class MainController < ApplicationController
  layout 'main'

  def resources

  end

  def index
    @user = User.find(session[:user]) if logged_in?
    @requests = Request.find :all, :limit => 5, :order => 'id DESC'
    @resources = Resource.find :all, :limit => 5, :order => 'id DESC'
  end

  def post
    return redirect_to :controller => 'users', :action => 'facebook_connect' unless logged_in?
    user = User.find(session[:user])
    user_request  = params['do']
    if user_request == "Sell"
      resource = Resource.new(params[:post])
      resource.selling_price = params[:price][:selling_price]
      resource.user_id = user.id
      new_resource = Resource.create_resource (resource)
      unless new_resource.blank?
        actual_file = params[:attachments][:actual]
        sample_file = params[:attachments][:sample]
        Attachment.add_files(actual_file, sample_file, new_resource.id)
      end
    else
      request = Request.new(params[:post])
      request.user_id = user.id
      Request.create_request(request)
    end
    return render :action => 'index'
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
