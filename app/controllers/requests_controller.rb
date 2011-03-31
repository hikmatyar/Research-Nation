class RequestsController < ApplicationController

  layout 'main'

  def what_others_are_requesting
    @request = Request.find(params[:id])
    @user = User.find(session[:user]) if logged_in?
  end

  def delete
    resource = Resource.find(params[:id])
    resource.destroy
    return redirect_to :controller => 'main', :action => 'index', :type => "selling_list"
  end
end
