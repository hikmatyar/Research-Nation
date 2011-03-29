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

  def create
    @user = User.find( session[:user] )
    resource = Resource.new params[:post]
    resource.user_id = @user.id
    if resource.save
      documents = params[:document]
      unless documents.blank?
        documents.each do |key, doc|
          if upload_to_s3(doc)
            attachment = Attachment.new
            attachment.file_name = File.basename(doc.original_filename) + "_#{@user.id.to_s}"
            attachment.resource_id = resource.id
            attachment.save
          else
            resource.destroy
            flash[:error] = "Error While Uploading Files."
            return redirect_to :action => 'post'
          end
        end
      flash[:error] = ""
      flash[:success] = "Your Research Has been Uploaded Successfully"
      return redirect_to :controller => 'main', :action => 'index'
      else
        resource.destroy
        flash[:success] = ""
        flash[:error]= "Please attach one or more files"
        return redirect_to :action => 'post'
      end
    else
      flash[:success] = ""
      flash[:error] = "Error while saving your Research. Please review your form."
      return redirect_to :action => 'post'
    end
  end

  def what_others_are_selling
    @user = User.find(session[:user]) if logged_in?
    @resource = Resource.find(params[:id])
  end

  private

  def upload_to_s3(doc)
    s3_settings = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
    bucket = s3_settings[RAILS_ENV]['bucket']
    mime_type = doc.content_type || "application/octet-stream"

    AWS::S3::Base.establish_connection!(
      :access_key_id     => s3_settings[RAILS_ENV]['access_key'],
      :secret_access_key => s3_settings[RAILS_ENV]['secret_key']
    )

    base_name =  "_#{@user.id.to_s}" + File.basename(doc.original_filename)

    obj = AWS::S3::S3Object.store(
      base_name,
      doc,
      bucket,
      :content_type => mime_type
    )
    return true if obj
  end
end
