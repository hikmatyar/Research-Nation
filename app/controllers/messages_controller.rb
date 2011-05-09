class MessagesController < ApplicationController

	layout 'main'

  before_filter :redirect_to_login

	def view
		@message = Message.find params[:id]
		return redirect_to :controller => 'users', :action => 'profile' unless ( logged_in? || @message.recipient_id == current_user.id )
	end

	def delete
		message = Message.find params[:id]
		message.destroy
		return redirect_to :controller => 'users', :action => 'profile', :id => current_user.id
	end
end
