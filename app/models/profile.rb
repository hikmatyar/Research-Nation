class Profile < ActiveRecord::Base

  has_one :key_individual
  belongs_to :user

end
