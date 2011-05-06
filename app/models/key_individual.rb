class KeyIndividual < ActiveRecord::Base

  belongs_to :profile

  def update_key_individual details
    self.update_attributes details
    self.update_linkedin self.linkedin
  end

  def update_linkedin linkedin_profile
    linkedin = linkedin_profile.match("http")? linkedin_profile : "http://"+ linkedin_profile
    self.update_attribute( :linkedin , linkedin )
  end
end
