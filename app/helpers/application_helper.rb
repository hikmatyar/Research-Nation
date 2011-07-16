# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def file_type_image(attachment)
     extension = File.extname(attachment.original_file_name).downcase
     if [".doc", ".docx"].include?(extension)
       return (image_tag "Word_Doc_Icon.png")
     elsif [".pdf"].include?(extension)
       return (image_tag "pdf.png")
     elsif [".xls", ".xlsx"].include?(extension)
       return (image_tag "excel-2010-icon.1.png")
     elsif [".ppt", ".pptx"].include?(extension)
       return (image_tag "file-extension-pps-powerpoint_icon.png")
     elsif [".gif", ".jpeg", ".jpg", ".png"].include?(extension)
       return (image_tag "image_file.png")
     elsif [".csv"].include?(extension)
       return (image_tag "csv_file.png")
     end
  end
end
