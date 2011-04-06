require 'monkeywrench'
class User < ActiveRecord::Base


  has_many :requests
  has_many :resources

  validates_presence_of :first_name
  validates_presence_of :last_name
  validates_presence_of :password, :unless => Proc.new { |user| user.facebook_uid }
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

  def self.create_facebook_user(first_name, last_name, email, id, gender, birthday,location )
    user = User.new
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.facebook_uid = id
    user.gender = gender
    user.birthday = birthday
    user.location = location
    user.save
    return user
  end

  def subscribe_to_newsletter
    settings = YAML::load(File.open("#{RAILS_ROOT}/config/monkeywrench.yml"))
    MonkeyWrench::Config.new(:datacenter => "us2", :apikey => settings[RAILS_ENV]['api_key'])
    list = MonkeyWrench::List.find_by_name("Research Nation")
    list.subscribe(self.email)
  end

end
