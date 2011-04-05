class User < ActiveRecord::Base


  has_many :requests
  has_many :resources

  validates_presence_of :first_name
  validates_presence_of :last_name
  validates_presence_of :password
  validates_presence_of :email
  validates_uniqueness_of :email, :message =>"has already been registered"
  validates_format_of :email, :with => /^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})$/i, :message => "format is not valid"

  cattr_reader :per_page
  @@per_page = 10

  def password=(value ="")
    if value.length >=6 && value.length <= 20
      write_attribute("password", Digest::SHA1.hexdigest(value))
    else
      self.errors.add("Password should be between 6 to 20 characters")
    end
  end

  def change_admin_status
    self.update_attributes :is_admin => !self.is_admin
  end

  def self.create_facebook_user(first_name, last_name, email, id, password, gender, birthday,location )
    user = User.new
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.facebook_uid = id
    user.password = password
    user.gender = gender
    user.birthday = birthday
    user.location = location
    user.save
    return user
  end

end
