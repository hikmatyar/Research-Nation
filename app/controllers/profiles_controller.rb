class ProfilesController < ApplicationController

  layout 'main'

  def new
    @profile = Profile.new
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

end
