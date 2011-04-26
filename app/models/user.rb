require 'monkeywrench'
class User < ActiveRecord::Base


  has_many :requests
  has_many :resources
  has_many :votes
  has_one :profile
  has_private_messages

  validates_presence_of :password, :unless => Proc.new { |user| user.facebook_uid }
  validates_presence_of :email
  validates_uniqueness_of :email, :message =>"Hmm, that email's already taken"
  validates_format_of :email, :with => /^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})$/i, :message => "Hi! Please use a valid email"

  cattr_reader :per_page
  @@per_page = 1000

  def password=(value ="")
    if value.length >=6 && value.length <= 20
      write_attribute("password", Digest::SHA1.hexdigest(value))
    else
      self.errors.add("Password should be between 6 to 20 characters")
    end
  end

  def name
    name = first_name + " " + last_name
    name
  end

  def name=(user_name)
    name = user_name.split(" ")
    self.first_name = name[0]
    self.last_name = name[1..name.length].join(" ")
  end
  def change_admin_status
    self.update_attributes :is_admin => !self.is_admin
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
end
