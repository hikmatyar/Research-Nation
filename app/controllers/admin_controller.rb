class AdminController < ApplicationController

  before_filter :redirect_to_admin_login, :get_counts

  def dashboard
    @users = User.paginate :page => params[:page]
    @resources = Resource.all
  end

  def users
    @users = User.paginate :page => params[:page], :order => 'created_at DESC'
  end

  def experts
    @users= User.paginate :page => params[:page], :order => 'created_at DESC', :conditions => ['is_expert = ?', true]
  end
  def posts
    @posts = Resource.paginate :page => params[:page], :order => 'created_at DESC'
  end

  def mail_chimp_list
    @members = get_mailchimp_list_members
  end

  def admin_rights
    @users = User.paginate :page => params[:page], :order => 'created_at DESC'
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

  def company_profiles
    @profiles = Profile.find_all_by_profile_type "company", :order => 'created_at DESC'
  end

  def individual_profiles
    @profiles = Profile.find_all_by_profile_type "individual", :order => 'created_at DESC'
  end

  def get_counts
    session[:members_count] = get_mailchimp_list_members.count if session[:members_count].blank?
    @resources_count = Resource.count
    @users_count = User.count
    @admin_count = (User.find_all_by_is_admin true).count
    @memebers_count = session[:members_count]
    @experts_count = (User.find_all_by_is_expert(true)).count
    @company_profiles_count = (Profile.find_all_by_profile_type "company").count
    @individual_profiles_count = (Profile.find_all_by_profile_type "individual").count
  end

end
