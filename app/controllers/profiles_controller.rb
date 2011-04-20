class ProfilesController < ApplicationController

  layout 'main'

  def company
    @profile = Profile.new
    @countries = Country.all.collect(&:name)
    @expertise = ["A","B","C","D"]
  end

  def individual
    @profile = Profile.new
    @countries = Country.all.collect(&:name)
    @expertise = ["A","B","C","D"]
  end

  def view_profile_list
    @profiles = Profile.find :all, :order => 'created_at DESC'
  end

  def create
    profile = Profile.new params[:profile]
    key_individual = KeyIndividual.new params[:key_individual]
    if profile.save
      key_individual.profile_id = profile.id
      key_individual.save
      return redirect_to :controller => 'main', :action => 'index'
    end
  end

  def types
    render :text => "company\nindividual"
  end

  def get_locations
    locations = Profile.all(:select => 'distinct(country)').collect(&:country)
    render :text => locations.join("\n")
  end

  def get_expertise
    expertise = Profile.all(:select => 'distinct(expertise)').collect(&:expertise)
    render :text => expertise.join("\n")
  end

  def get_interests
    interests = Profile.all(:select => 'distinct(interested_in)').collect(&:interested_in)
    render :text => interests.to_s.split(",").join("\n")
  end

  def filter_by_profile_type
   @profiles = Profile.find :all, :conditions => ['profile_type = ?', params[:profile_type]], :order => 'created_at DESC'
   render :partial => 'profiles'
  end

  def filter_by_location
    @profiles = Profile.find :all, :conditions => ['country = ?', params[:location]], :order => 'created_at DESC'
   render :partial => 'profiles'
  end

  def filter_by_expertise
    @profiles = Profile.find :all, :conditions => ['expertise like ?', "%#{params[:expertise]}%" ], :order => 'created_at DESC'
   render :partial => 'profiles'
  end

  def filter_by_interests
    @profiles = Profile.find :all, :conditions => ['interests like ?', "%#{params[:interests]}%" ], :order => 'created_at DESC'
   render :partial => 'profiles'
  end

end
