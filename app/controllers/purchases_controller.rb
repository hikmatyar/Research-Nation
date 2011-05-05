class PurchasesController < ApplicationController

  before_filter :redirect_to_login

  def resource
    @resource = Resource.find params[:id]
    @order = Order.new(params[:order])
    if request.post?
      @order.ip_address = request.remote_ip
      @order.buyer_id = current_user.id
      @order.resource_id = @resource.user_id
      if @order.save
        if @order.purchase
          return redirect_to :action => "payment", :id => @resource.id
        else
          render :text => "failure :("
        end
      end
    end
  end

  def download
    return head(:not_found) unless Order.authorized_access?(current_user.id, params[:id])
    @resource = Resource.find params[:id]
  end


 def download_file
   return head(:not_found) if ((attachment = Attachment.find_by_id(params[:id])).nil? || !Order.authorized_access?(current_user.id, params[:order_id]))
   path = attachment.original.path
   redirect_to(AWS::S3::S3Object.url_for(path, attachment.original.bucket_name, :expires_in => 10.seconds))
 end
end
