class RequestsController < ApplicationController

  layout 'main'

  def create
    if logged_in?
      request = Request.new(params[:request])
      request.user_id = session[:user]
      if request.save
        flash[:success] = "Your Request has been submitted"
        return redirect_to :controller => 'main' , :action => 'index'
      else
        flash[:error] = "Request Could not be processed. Please try again."
        return redirect_to :controller => 'main', :action => 'index'
      end
    else
      return redirect_to :controller => 'users', :action => 'register'
    end
  end

  def what_others_are_requesting
    @request = Request.find(params[:id])
    @user = User.find(session[:user]) if logged_in?
  end
end
