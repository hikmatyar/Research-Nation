class Profile < ActiveRecord::Base

  has_one :key_individual
  belongs_to :user


  S3_SETTINGS = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
  IMAGE_BUCKET = S3_SETTINGS[RAILS_ENV]['images_bucket']

  has_attached_file :photo, :styles => { :browse => "30x30>", :main => "220x200>", :edit => "100x100>"},
                    :storage => :s3,
                    :s3_credentials => "#{RAILS_ROOT}/config/s3.yml",
                    :path => "photos/:id/:style/:basename.:extension",
                    :bucket => IMAGE_BUCKET

  validates_attachment_size :photo, :less_than => 5.megabytes
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png', 'image/gif']


  def to_params
    "#{id}-#{name.parameterize}"
  end
  
  def update_profile_information profile_details, key_individual_details
    self.update_attributes(profile_details)
    self.update_is_edited
    self.update_url_slug
    self.update_website self.website
    self.key_individual.update_key_individual key_individual_details
  end

  def update_url_slug
    self.update_attribute( :url_slug, self.to_params )
  end
  
  def update_is_edited
    self.update_attribute( :is_edited, true )
  end
  
  def update_website website_link
    website = website_link.match("http") ? website_link : "http://"+ website_link
    self.update_attribute( :website , website )  
  end

end
