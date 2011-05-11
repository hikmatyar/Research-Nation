require 'rscribd'
class Attachment < ActiveRecord::Base

  belongs_to :resource

  named_scope :original_files , Proc.new { { :conditions => {:attachment_type => "original" }}}
  named_scope :sample , Proc.new { {:conditions => {:attachment_type => "sample" }}}

  S3_SETTINGS = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
  DATA_BUCKET = S3_SETTINGS[RAILS_ENV]['bucket']

  has_attached_file :original,
                    :storage => :s3,
                    :s3_credentials => "#{RAILS_ROOT}/config/s3.yml",
                    :s3_permissions => :private,
                    :path => "originals/:id/:basename.:extension",
                    :bucket => DATA_BUCKET

  validates_attachment_size :original, :less_than => 5.megabytes
#  validates_attachment_content_type :original, :content_type => ['image/jpeg', 'image/png', 'image/gif']


  def self.add_file(file, resource_id, attachment_type)

      attachment = Attachment.new
      attachment.attachment_type = attachment_type
      attachment.resource_id = resource_id

      attachment.original = file if attachment_type == "original"
      attachment.upload_sample( file.path) if attachment_type == "sample"

      attachment.save

      return attachment.id
  end

  def upload_sample (file_path)
    Scribd::API.instance.key = '1giabk0f2hynsdgi6xhkf'
    Scribd::API.instance.secret = 'sec-aaaywibb8rd32862k7aylqtfhw'
    Scribd::User.login 'usmanalikr', '@scribd.com'
    doc = Scribd::Document.upload(:file => file_path, :access => "private")
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

end
