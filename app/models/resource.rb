class Resource < ActiveRecord::Base

  belongs_to :user
  has_many :attachments

  acts_as_paranoid

  cattr_reader :per_page
  @@per_page = 10

  validates_presence_of :selling_price
  validates_presence_of :title
  validates_numericality_of :selling_price

  def self.create_resource resource_data
    resource = resource_data
    resource.save
  end

  def download
    resource_id = params[:id]
    resource = Resource.find resource_id
    sample = resource.attachments.find_by_attachment_type("sample")
    s3_settings = YAML::load(File.open("#{RAILS_ROOT}/config/s3.yml"))
    bucket = s3_settings[RAILS_ENV]['bucket']
    AWS::S3::Base.establish_connection!(
      :access_key_id     => s3_settings[RAILS_ENV]['access_key'],
      :secret_access_key => s3_settings[RAILS_ENV]['secret_key']
    )

    obj = AWS::S3::S3Object.find(sample.file_name, bucket)
    return redirect_to obj.url
    return redirect_to :controller => 'main', :action => 'index'
  end

end
