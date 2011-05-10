class PurchasesController < ApplicationController

  include SslRequirement
  ssl_required :resource, :download, :download_file unless Rails.env.development?
  before_filter :redirect_to_login

  def resource
    @resource = Resource.find_by_url_slug params[:url_slug]
    return redirect_to :action => "download", :id => @resource.url_slug if current_user.is_admin?
    @order = Order.new(params[:order])
    if request.post?
      @order.ip_address = request.remote_ip
      @order.buyer_id = current_user.id
      @order.resource_id = @resource.id
      if @order.save
        if @order.purchase
          UserMailer.deliver_successful_purchase_email(current_user, @resource)
          return redirect_to :action => "download", :url_slug => @resource.url_slug
        end
      end
    end
  end

  def download
    return head(:not_found) unless Order.authorized_access?(current_user.id, params[:id]) unless current_user.is_admin?
    @resource = Resource.find_by_url_slug params[:url_slug]
  end

 def download_file
   return head(:not_found) if ((attachment = Attachment.find_by_id(params[:attachment])).nil? || !Order.authorized_access?(current_user.id, params[:id]))
   path = attachment.original.path
   redirect_to(AWS::S3::S3Object.url_for(path, attachment.original.bucket_name, :expires_in => 10.seconds))
 end
end
