class Picture < ActiveRecord::Base
	belongs_to :profile

	def add_picture picture_name, file
	  self.picture_name = "#{self.profile_id.to_s}_#{picture_name}"
	  self.picture_path = "https://s3.amazonaws.com/Researchnation_images/#{self.picture_name}"
	  self.save if (self.upload_to_s3(file, picture_name) if self.validate_image_size(file))
	end
	
	def upload_to_s3(doc, name)
    s3_settings = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
    bucket = s3_settings[RAILS_ENV]['images_bucket']

    AWS::S3::Base.establish_connection!(
      :access_key_id     => s3_settings[RAILS_ENV]['access_key'],
      :secret_access_key => s3_settings[RAILS_ENV]['secret_key']
    )

    base_name =  "#{self.profile_id}_" + name

    obj = AWS::S3::S3Object.store(
      base_name,
      doc,
      bucket,
      :content_type => "application/octet-stream",
      :access => :public_read
    )
  end

  def validate_image_size( file )

    size = File.size file.path
    return false if size > 1048576
    return true
  end

end
