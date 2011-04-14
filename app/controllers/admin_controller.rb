class AdminController < ApplicationController

  before_filter :redirect_to_admin_login

  def dashboard

    @users = User.paginate :page => params[:page]
    @resources = Resource.all

    @resources_count = Resource.count
    @users_count = User.count
    @admin_count = (User.find_all_by_is_admin true).count

  end

  def users
    @users = User.paginate :page => params[:page]
  end

  def posts
    @posts = Resource.paginate :page => params[:page]
  end

  def mail_chimp_list
    @members = get_mailchimp_list_members
  end

  def admin_rights
    @users = User.paginate :page => params[:page]
  end

  def see_authentications
    @users =  User.find :all, :conditions => ['facebook_uid > ?', 0 ]
  end

  def manage_users
    @users = User.paginate :page => params[:page]
  end

  def change_admin_status
    user = User.find(:first, :conditions => ["id = ?", params[:user_id]])
    return render :partial => "is_admin_field", :locals => {:user => user}
  end

end
