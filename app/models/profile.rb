class Profile < ActiveRecord::Base

  has_one :key_individual
  belongs_to :user

  S3_SETTINGS = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
  IMAGE_BUCKET = S3_SETTINGS[RAILS_ENV]['images_bucket']

  has_attached_file :photo, :styles => { :browse => "30x30>", :main => "220x200>", :edit => "100x100>"  },
                    :storage => :s3,
                    :s3_credentials => "#{RAILS_ROOT}/config/s3.yml",
                    :path => "photos/:id/:style/:basename.:extension",
                    :bucket => IMAGE_BUCKET

  validates_attachment_size :photo, :less_than => 5.megabytes
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png', 'image/gif']

end
