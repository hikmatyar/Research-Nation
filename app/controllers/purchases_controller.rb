class PurchasesController < ApplicationController

  include SslRequirement
  ssl_required :resource, :download, :download_file unless Rails.env.development?
  before_filter :redirect_to_login, :only => [:resource]

  before_filter :download_verify, :only => [:download, :download_file]

  def resource
    @resource = Resource.find_by_url_slug params[:url_slug], :conditions => {:is_deleted => false}
    return render_404 if @resource.blank?
    return redirect_to :controller => 'purchases', :action => "download", :url_slug => @resource.url_slug if current_user.is_admin? || @resource.selling_price == 0 || current_user.id == @resource.user_id
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
  end

 def download_file
   return render_404 if (attachment = Attachment.find_by_id(params[:attachment])).nil?
   path = attachment.original.path
   redirect_to(AWS::S3::S3Object.url_for(path, attachment.original.bucket_name, :expires_in => 10.seconds))
 end

private
  def download_verify
    @resource = Resource.find_by_url_slug params[:url_slug], :conditions => {:is_deleted => false}
    if !@resource.blank? && (@resource.free? || (current_user.is_admin? || (!@resource.is_deleted? && (current_user.own_resource?(@resource) || @resource.free? || Order.authorized_access?(current_user.id, params[:url_slug])))))
      return true
    else
      return render_404
    end
  end

end
