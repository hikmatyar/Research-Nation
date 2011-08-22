class CommentsController < ApplicationController
  def create
    @resource = Resource.find_by_url_slug params[:url_slug], :conditions => {:is_deleted => false}
    @comment = @resource.comments.build(params[:comment])
    @success = @comment.save
    if request.xhr? && @success
      render :show, :layout => false
    elsif @success
      redirect_to :controller => "resources", :action => "seller_page", :url_slug => params[:url_slug]
    elsif !request.xhr && !@success
      flash[:notice] = @comment.errors.full_messages.to_s
      redirect_to :controller => "resources", :action => "seller_page", :url_slug => params[:url_slug]
    end
  end
end