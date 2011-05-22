require 'monkeywrench'
class User < ActiveRecord::Base


  has_many :requests
  has_many :resources
  has_many :valid_resources, :conditions => {:is_deleted => false}
  has_many :votes
  has_one :profile
  has_one :payment_preference
  has_private_messages

  validates_presence_of :password, :unless => Proc.new { |user| user.facebook_uid }
  validates_presence_of :email
  validates_uniqueness_of :email, :message =>": has already been registered."
  validates_format_of :email, :with => /^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})$/i, :message => ": please use a valid email"

  named_scope :individual_users, :conditions => 'user_type = "individual"'
  named_scope :company_users, :conditions => 'user_type = "company"'

  cattr_reader :per_page
  @@per_page = 25

  def password=(value ="")
    if value.length >=6 && value.length <= 20
      write_attribute("password", Digest::SHA1.hexdigest(value))
    else
      self.errors.add("Password should be 6 to 20 characters")
    end
  end

  def change_admin_status
    self.update_attributes :is_admin => !self.is_admin
  end

  def own_resource?(resource)
    self.id  == resource.user_id
  end

  def individual?
    user_type == "individual"
  end

  def company?
    user_type == "company"
  end

  def self.create_facebook_user new_user
    user = User.new(new_user)
    return user if user.save
  end

  def generate_token(length=6)
    chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ23456789'
    token = ''
    length.times { |i| token << chars[rand(chars.length)] }
    token
  end

  def delete_resources
    unless self.resources.blank?
      self.resources.each do |resource|
        resource.set_deleted
      end
    end
  end

  def has_pending_payment?
    pending_orders.size > 0
  end

  def pending_orders
    orders = []
    resources.each {|resource| orders << resource.pending_orders.flatten unless resource.pending_orders.blank?}
    orders.flatten
  end

  def monthly_paid_earnings
    orders = []
    resources.each {|resource| orders << resource.paid_orders.flatten unless resource.paid_orders.blank?}
    paid_months = orders.flatten.group_by {|order| order.created_at.at_end_of_month}
    monthly_earnings = []
    paid_months.each do |month, orders|
      earnings = 0
      orders.each {|order| earnings += order.resource.selling_price}
      monthly_earnings << {:month => month, :total_earnings => earnings, :orders => orders }
    end
    monthly_earnings
  end

  def monthly_pending_earnings
    orders = []
    resources.each {|resource| orders << resource.pending_orders.flatten unless resource.pending_orders.blank?}
    pending_months = orders.flatten.group_by {|order| order.created_at.at_end_of_month}
    monthly_earnings = []
    pending_months.each do |month, orders|
      earnings = 0
      orders.each {|order| earnings += order.resource.selling_price}
      monthly_earnings << {:month => month, :total_earnings => earnings, :orders => orders }
    end
    monthly_earnings
  end


  def pay_for_pending_orders_within_date(start_time, end_time)
    orders = []
    earnings = 0.0
    resources.each {|resource| orders << resource.pending_orders_within_date(start_time, end_time).flatten unless resource.pending_orders.blank?}
    orders.flatten.each do |order|
      order.pay
      earnings += order.resource.selling_price
    end
    earnings
  end
end
