class RequestsController < ApplicationController

  layout 'main'

  def what_others_are_requesting
    @request = Request.find(params[:id])
    @user = User.find(session[:user]) if logged_in?
  end
end
