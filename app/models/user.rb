class User < ActiveRecord::Base

  has_many :requests
  has_many :resources

  validates_presence_of :first_name
  validates_presence_of :last_name
  validates_presence_of :password

  validates_presence_of :email
  validates_uniqueness_of :email, :message =>"has already been registered"
  validates_format_of :email, :with => /^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})$/i, :message => "format is not valid"

  def password=(value ="")
    if value.length >=6 && value.length <= 20
      write_attribute("password", Digest::SHA1.hexdigest(value))
    else
      self.errors.add("Password should be between 6 to 20 characters")
    end
  end

end
