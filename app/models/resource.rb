class Resource < ActiveRecord::Base

  belongs_to :user
  has_many :attachments
  has_many :votes

  has_one :order

  acts_as_paranoid

  cattr_reader :per_page
  @@per_page = 1000

  validates_presence_of :selling_price
  validates_presence_of :title
  validates_numericality_of :selling_price

  def self.create_resource resource_data
    resource = resource_data
    resource.save
  end

  def update_url_slug
    self.update_attribute( :url_slug, self.to_params )
  end

  def to_params
    "#{id}-#{title.parameterize}"
  end

end
