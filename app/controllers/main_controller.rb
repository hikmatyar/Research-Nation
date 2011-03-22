class MainController < ApplicationController
  layout 'main'

  def resources

  end

  def index
    @requests = Request.find :all, :limit => 5
  end

end
