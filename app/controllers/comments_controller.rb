class CommentsController < ApplicationController
  layout "admin", :except => [:create]

  def create
    if params[:type_class] == "reviews"
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
    else
      @resource = Profile.find_by_url_slug params[:url_slug]
      @comment = @resource.comments.build(params[:comment])
      @success = @comment.save
      if request.xhr? && @success
        render :show, :layout => false
      elsif @success
        redirect_to :controller => "profiles", :action => "profile_page", :url_slug => params[:url_slug]
      elsif !request.xhr && !@success
        flash[:notice] = @comment.errors.full_messages.to_s
        redirect_to :controller => "profiles", :action => "profile_page", :url_slug => params[:url_slug]
      end
    end
  end

  def edit
    @comment = Comment.find(params[:id])
  end

  def update
    @comment = Comment.find(params[:id])
    if @comment.update_attributes(params[:comment])
      redirect_to :controller => "admin", :action => "comments"
    else
      render "edit"
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    @comment.delete
    redirect_to :controller => "admin", :action => "comments"
  end
end