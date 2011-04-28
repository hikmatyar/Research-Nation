require 'rscribd'
class Attachment < ActiveRecord::Base

  belongs_to :resource

  named_scope :sample , Proc.new { {:conditions => {:attachment_type => "sample" }}}
  named_scope :original , Proc.new { {:conditions => {:attachment_type => "original" }}}
  def self.add_file(file, resource_id, attachment_type, file_name )

      attachment = Attachment.new
      attachment.file_name = "#{resource_id.to_s}_" + file_name
      attachment.attachment_type = attachment_type
      attachment.resource_id = resource_id
      if attachment.validate_file_size( file)
        attachment.upload_to_s3(file, file_name) if attachment_type == "original"
        attachment.upload_sample( file.path, file_name ) if attachment_type == "sample"
        attachment.save
      else
        error = "Hey, file size should be less than 5MB"
      end
      return attachment.id
  end

  def upload_to_s3(doc, file_name)
    s3_settings = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
    bucket = s3_settings[RAILS_ENV]['bucket'] if self.attachment_type == "original"

    AWS::S3::Base.establish_connection!(
      :access_key_id     => s3_settings[RAILS_ENV]['access_key'],
      :secret_access_key => s3_settings[RAILS_ENV]['secret_key']
    )

    base_name =  "#{resource_id}_" + file_name

    obj = AWS::S3::S3Object.store(
      base_name,
      doc,
      bucket,
      :content_type => "application/octet-stream"
    )
  end

  def upload_sample (file_path, file_name)
    Scribd::API.instance.key = '1giabk0f2hynsdgi6xhkf'
    Scribd::API.instance.secret = 'sec-aaaywibb8rd32862k7aylqtfhw'
    Scribd::User.login 'usmanalikr', '@scribd.com'
    doc = Scribd::Document.upload(:file => file_path, :access => "private", :name => file_name)
    self.access_key = doc.access_key
    self.document_id = doc.id
  end

  def remove_sample
    Scribd::API.instance.key = '1giabk0f2hynsdgi6xhkf'
    Scribd::API.instance.secret = 'sec-aaaywibb8rd32862k7aylqtfhw'
    Scribd::User.login 'usmanalikr', '@scribd.com'
    doc = Scribd::Document.find self.document_id
    if doc.destroy
      self.destroy
    end
  end

  def validate_file_size( file )

    size = File.size file.path
    return false if size > 5242880
    return true
  end

end
