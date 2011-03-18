class User < ActiveRecord::Base

  has_many :requests
  has_many :researches

  def password=(value)
    write_attribute("password", Digest::SHA1.hexdigest(value))
  end

end
