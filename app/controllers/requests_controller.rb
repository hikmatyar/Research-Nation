class RequestsController < ApplicationController

  layout 'main'

  def create
    request = Request.new(params[:request])
    request.user_id = session[:user]
    if request.save
      flash[:success] = "Your Request has been submitted"
      redirect_to :controller => 'main' , :action => 'index'
    else
      flash[:error] = "Request Could not be processed. Please try again."
      render :action => 'new'
    end

  end
end
