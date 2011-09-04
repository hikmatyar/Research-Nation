class Profile < ActiveRecord::Base

  has_one :key_individual
  belongs_to :user
  has_many :comments

  cattr_reader :per_page
  @@per_page = 25

  ajaxful_rateable :stars => 5

  S3_SETTINGS = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
  IMAGE_BUCKET = S3_SETTINGS[RAILS_ENV]['images_bucket']

  has_attached_file :photo, :styles => { :dashboard => "200x200>", :small => "30x30>", :seller => "70x70>"},
                    :storage => :s3,
                    :s3_credentials => "#{RAILS_ROOT}/config/s3.yml",
                    :path => "photos/:id/:style/:basename.:extension",
                    :bucket => IMAGE_BUCKET

#  validates_attachment_size :photo, :less_than => 1.megabytes, :message => "Picture size should be less than 5 MB", :allow_nil => true

  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png', 'image/gif'], :message => "Please attach a picture which is of a valid file format, that is either JPG, PNG or GIF."

  named_scope :edited, :conditions => {:is_edited => true}, :order => "created_at DESC"

  named_scope :interested, :conditions => ["interested_in IS NOT NULL"], :order => "created_at DESC"

  named_scope :through_company_type, (lambda do |company_type| {:conditions => {:is_edited => true, :company_type => company_type}, :order => "created_at DESC"} end)
  named_scope :through_services, (lambda do |services| {:conditions => {:is_edited => true, :services => services}, :order => "created_at DESC"} end)
  named_scope :companies, :conditions => {:profile_type => "company"}  

  after_create :set_interested_in

  def to_params
    "#{id}-#{name.parameterize}"
  end
  
  def individual?
    self.profile_type == "individual"
  end

  def company?
    self.profile_type == "company"
  end

  def update_profile_information profile_details, key_individual_details
    unless profile_details.blank?
      profile_details[:interested_in] = nil if !profile_details[:interested_in].nil? && profile_details[:interested_in] == ""
      self.update_attributes(profile_details)
      self.update_is_edited
      self.update_url_slug
      self.update_website self.website unless self.website.blank?
    end
    self.key_individual.update_key_individual key_individual_details unless key_individual_details.blank?
  end

  def update_url_slug
    self.update_attribute(:url_slug, self.to_params)
  end
  
  def update_is_edited
    self.update_attribute(:is_edited, true)
  end

  def update_website website_link
    website = website_link.match("http") ? website_link : "http://"+ website_link
    self.update_attribute( :website , website )  
  end

private
  def set_interested_in
    self.update_attributes :interested_in => "FT projects,PT projects,Expert Advisory"
  end
end
