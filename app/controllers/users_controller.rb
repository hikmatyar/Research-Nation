class UsersController < ApplicationController

  before_filter :check_session, :except => [:register, :login, :create, :authenticate]

  def register

  end

  def login

  end

  def create
    user = User.new(params[:user])
    if user.save
      flash[:success] = "User has been created Successfully"
      redirect_to :controller => 'main', :action => 'index'
    else
      flash[:error] = "Could not Create User. Please Review your form"
      render :action => 'register'
    end
  end

  def edit
    @user = User.find_by_id(params[:id])
  end

  def update

    @user = User.find_by_id(params[:id])
    if @user.update_attributes params[:user]
      flash[:success] = "User details Updated"
      redirect_to :controller => 'main', :action => 'index'
    else
      flash[:error] = "Unable to update User Details"
      render :action => 'edit', :id => params[:id]
    end
  end

  def authenticate
    @user = User.new(params[:login])
    valid_user = User.find(:first,:conditions => ["email = ? and password = ?", @user.email, @user.password])
    if valid_user
      session[:user] = valid_user.id
      redirect_to :controller => 'main', :action => 'index'
    else
      flash[:error] = "Invalid username/password"
      render :action => 'login'
    end
  end

  def check_session
    return redirect_to :action => 'login' unless session[:user]
  end

  def logout
    if logged_in?
      reset_session
      redirect_to :action=> 'login'
    end
  end
end
