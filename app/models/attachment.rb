class Attachment < ActiveRecord::Base
  belongs_to :resource

  def self.add_files(actual_file, sample_file, resource_id)

    if self.upload_to_s3(sample_file, resource_id)
      sample = Attachment.new
      sample.file_name = File.basename(sample_file.original_filename) + "_file#{resource_id.to_s}"
      sample.attachment_type = "Sample"
      sample.resource_id = resource_id
      sample.save
    end

    if self.upload_to_s3(actual_file, resource_id)
      actual = Attachment.new
      actual.file_name = File.basename(actual_file.original_filename) + "_file#{resource_id.to_s}"
      actual.attachment_type = "Actual"
      actual.resource_id = resource_id
      actual.save
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

    base_name =  File.basename(doc.original_filename) + "_file#{resource_id.to_s}"

    obj = AWS::S3::S3Object.store(
      base_name,
      doc,
      bucket,
      :content_type => mime_type
    )
  end
end
