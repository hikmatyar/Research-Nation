class User < ActiveRecord::Base

  has_many :requests
  has_many :resources

  validates_presence_of :first_name
  validates_presence_of :last_name
  validates_presence_of :email

  validates_uniqueness_of :email

  validates_format_of :email, :with => /^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})$/i, :message => "format is not valid."

  def password=(value)
    write_attribute("password", Digest::SHA1.hexdigest(value))
  end

end
