class Profile < ActiveRecord::Base

  has_one :key_individual
  has_one :picture
  belongs_to :user

end
