require 'rscribd'
class Attachment < ActiveRecord::Base
  belongs_to :resource
  named_scope :sample , Proc.new { {:conditions => {:attachment_type => "sample" }}}
  def self.add_file(file, resource_id, attachment_type)

      attachment = Attachment.new
      attachment.file_name = "File#{resource_id.to_s}_" + File.basename(file.path)
      attachment.attachment_type = attachment_type
      attachment.resource_id = resource_id
      attachment.upload_to_s3(file) if attachment_type == "original"
      attachment.upload_sample( file.path ) if attachment_type == "sample"
      attachment.save

  end

  def upload_to_s3(doc)
    s3_settings = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
    bucket = s3_settings[RAILS_ENV]['bucket']

    AWS::S3::Base.establish_connection!(
      :access_key_id     => s3_settings[RAILS_ENV]['access_key'],
      :secret_access_key => s3_settings[RAILS_ENV]['secret_key']
    )

    base_name =  "File#{resource_id.to_s}_" + File.basename(doc.path) 

    obj = AWS::S3::S3Object.store(
      base_name,
      doc,
      bucket,
      :content_type => "application/octet-stream"
    )
  end

  def upload_sample file_path
    Scribd::API.instance.key = '1giabk0f2hynsdgi6xhkf'
    Scribd::API.instance.secret = 'sec-aaaywibb8rd32862k7aylqtfhw'
    Scribd::User.login 'usmanalikr', '@scribd.com'
    doc = Scribd::Document.upload(:file => file_path, :access => "private")
    self.access_key = doc.access_key
    self.document_id = doc.id
  end

  def self.check_file_limits_for? file_path
    valid_formats = Regexp.new /^.*\.(doc|DOC|ppt|PPT|xls|xls|pdf|PDF|docx|DOCX|pptx|PPTX|xlsx|XLSX)/

    size = File.size file_path
    file_type = File.extname file_path
    return false if size > 5242880
    return false unless valid_formats.match file_path
  end

end
