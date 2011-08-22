class Resource < ActiveRecord::Base

  belongs_to :user
  has_many :attachments
  has_many :votes

  has_many :orders
  has_many :comments

  cattr_reader :per_page
  @@per_page = 25

  ajaxful_rateable :stars => 5

  validates_presence_of :selling_price
  validates_presence_of :title
  validates_numericality_of :selling_price

  named_scope :sellers_with_paid_resources, :select => "DISTINCT user_id", :conditions => "selling_price > 0"

  def self.create_resource resource_data
    resource = resource_data
    resource.save
  end

  def free?
    self.selling_price == 0
  end

  def update_url_slug
    self.update_attribute(:url_slug, self.to_params)
  end

  def to_params
    "#{id}-#{title.parameterize}"
  end

  def total_orders
    return Order.successful_resource_orders(self.id)
  end

  def pending_orders
    return Order.successful_resource_orders(self.id).payment_pending
  end

  def paid_orders
    return Order.successful_resource_orders(self.id).payment_paid
  end

  def pending_orders_within_date(start_time, end_time)
    return Order.successful_resource_orders_within_month(self.id, start_time, end_time).payment_pending
  end

  def set_deleted
    self.update_attributes :is_deleted => true
  end

  def self.create_posts_via_csv
    require 'csv'
    CSV.open('reports.csv', 'r').each do |row|
      r = Resource.create(:sources => row[0], :selling_price => row[1], :title => row[3], :industry => row[4], :geography => row[5], :description => row[6], :user_id => 149)
      r.update_url_slug
      puts r.inspect
    end
  end
end
