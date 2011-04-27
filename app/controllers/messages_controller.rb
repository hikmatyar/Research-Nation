class MessagesController < ApplicationController

	layout 'main'

	def view
		@message = Message.find params[:id]
	end

	def delete
		message = Message.find params[:id]
		message.destroy
		return redirect_to :controller => 'users', :action => 'profile', :id => current_user.id
	end
end
