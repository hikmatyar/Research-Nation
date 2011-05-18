class MessagesController < ApplicationController

	layout 'main'

  before_filter :redirect_to_login

	def view
		begin
		  @message = Message.read(params[:id], current_user)
    rescue
      return render_404
	  end
	end

	def delete
		message = Message.find params[:id]
		message.destroy
		return redirect_to :controller => 'users', :action => 'profile', :id => current_user.id
	end
end
