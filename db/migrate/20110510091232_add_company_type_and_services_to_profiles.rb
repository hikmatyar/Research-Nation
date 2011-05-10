class AddCompanyTypeAndServicesToProfiles < ActiveRecord::Migration
  def self.up
    add_column :profiles, :company_type, :string
    add_column :profiles, :services, :string
  end

  def self.down
    remove_column :profiles, :company_type
    remove_column :profiles, :services
  end
end
