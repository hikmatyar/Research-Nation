class ResourcesController < ApplicationController

  layout 'main'
  require 'aws/s3'

  before_filter :redirect_to_login

  def post
    if logged_in?
      @user = User.find(session[:user])
    else
      redirect_to :controller => 'main', :action => 'index'
    end
  end

  def what_others_are_selling
    @user = User.find(session[:user]) if logged_in?
    @resource = Resource.find(params[:id])
  end

  def delete
    resource = Resource.find(params[:id])
    resource.destroy
    @resources = Resource.paginate :page => params[:page], :order => 'created_at DESC'
    render :layout => false
  end

  def download
    resource_id = params[:id]
    resource = Resource.find resource_id
    sample = resource.attachments.find_by_attachment_type("sample")
    s3_settings = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
    bucket = s3_settings[RAILS_ENV]['bucket']
    AWS::S3::Base.establish_connection!(
      :access_key_id     => s3_settings[RAILS_ENV]['access_key'],
      :secret_access_key => s3_settings[RAILS_ENV]['secret_key']
    )

    obj = AWS::S3::S3Object.find(sample.file_name, bucket)
    return redirect_to obj.url
    return redirect_to :controller => 'main', :action => 'index'
  end
end
