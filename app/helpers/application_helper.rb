# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def missing_image_on_s3? path
    return (path =~ /missing/)
  end
end
