class RequestsController < ApplicationController

  layout 'main'

  def what_others_are_requesting
    @request = Request.find(params[:id])
    @user = User.find(session[:user]) if logged_in?
  end

  def delete
    request = Request.find(params[:id])
    request.destroy
    return render :layout => false
    render :partial => '/layouts/buying_list'
  end
end
