class AdminController < ApplicationController

  before_filter :redirect_to_admin_login

  layout 'main'

  def dashboard
    @resources = Resource.all
  end

  def see_authentications
    @users =  User.find :all, :conditions => ['facebook_uid > ?', 0 ]
  end

end
