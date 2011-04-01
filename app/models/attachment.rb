class Attachment < ActiveRecord::Base
  belongs_to :resource

  def self.add_file(file, resource_id, attachment_type)

    if self.upload_to_s3(file, resource_id)
      attachment = Attachment.new
      attachment.file_name = "File#{resource_id.to_s}_" + File.basename(file.original_filename)
      attachment.attachment_type = attachment_type
      attachment.resource_id = resource_id
      attachment.save
    end

  end

  def self.upload_to_s3(doc, resource_id)
    s3_settings = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
    bucket = s3_settings[RAILS_ENV]['bucket']
    mime_type = doc.content_type || "application/octet-stream"

    AWS::S3::Base.establish_connection!(
      :access_key_id     => s3_settings[RAILS_ENV]['access_key'],
      :secret_access_key => s3_settings[RAILS_ENV]['secret_key']
    )

    base_name =  "File#{resource_id.to_s}_" + File.basename(doc.original_filename) 

    obj = AWS::S3::S3Object.store(
      base_name,
      doc,
      bucket,
      :content_type => mime_type
    )
  end

  def self.check_file_limits_for? file_path
    valid_formats = Regexp.new /^.*\.(doc|DOC|ppt|PPT|xls|xls|pdf|PDF|docx|DOCX|pptx|PPTX|xlsx|XLSX)/

    size = File.size file_path
    file_type = File.extname file_path
    return false if size > 5242880
    return false unless valid_formats.match file_path
  end
end
