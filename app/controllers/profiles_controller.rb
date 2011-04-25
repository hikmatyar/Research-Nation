class ProfilesController < ApplicationController

  layout 'main'

  def company
    @profile = Profile.new
    set_tags
  end

  def individual
    @profile = Profile.new
    set_tags
  end

  def view_profile_list
    @profiles = Profile.find :all, :order => 'created_at DESC'
  end

  def profile_page
    @profile = Profile.find params[:id]
    @interests = @profile.interested_in.split(",") unless @profile.interested_in.blank?
  end

  def create
    profile = session[:profile].blank? ? Profile.new(params[:profile]) : session[:profile]
    key_individual = session[:key_individual].blank? ? KeyIndividual.new(params[:key_individual]) : session[:key_individual]
    picture_path = params[:picture_path]

    unless logged_in?
      session[:key_individual] = key_individual
      session[:profile] = profile
      return redirect_to :controller => 'users'  , :action => 'register'
    end

    if profile.save
      unless params[:picture].blank?
        picture = Picture.new
        picture.profile_id = profile.id
        picture.add_picture(picture_path, params[:picture])
      end
      session[:profile] = nil
      key_individual.profile_id = profile.id
      key_individual.save
      session[:key_individual] = nil
      return redirect_to :controller => 'resources', :action => 'view_posts'
    end

  end

  def types
    render :text => "company\nindividual"
  end

  def edit_company_profile
    @profile = Profile.find params[:id]
    @key_individual = @profile.key_individual
    @countries = Country.all.collect(&:name)
  end

  def edit_individual_profile
    @profile = Profile.find params[:id]
    @key_individual = @profile.key_individual
    set_tags
  end

  def edit_company_profile
    @profile = Profile.find params[:id]
    @key_individual = @profile.key_individual
    set_tags
  end

  def delete
    profile = Profile.find params[:id]
    profile.destroy
    return redirect_to :controller => 'admin', :action => 'dashboard'
  end

  def get_locations
    locations = Profile.all(:select => 'distinct(country)').collect(&:country)
    render :text => locations.join("\n")
  end

  def get_industry_focus
    industry_focus = Profile.all(:select => 'distinct(industry_focus)').collect(&:industry_focus)
    render :text => industry_focus.join("\n")
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

  def filter_by_industry
    @profiles = Profile.find :all, :conditions => ['industry_focus like ?', "%#{params[:industry]}%" ], :order => 'created_at DESC'
   render :partial => 'profiles'
  end

  def filter_by_interests
    @profiles = Profile.find :all, :conditions => ['interests like ?', "%#{params[:interests]}%" ], :order => 'created_at DESC'
   render :partial => 'profiles'
  end

  def send_mail_to_profile
    individual = KeyIndividual.find_by_email params[:email]
    profile = individual.profile
    body = params[:contact]
    ContactMailer.deliver_profile_email body["name"], body["email"], body["subject"], body["message"], recipient
    return redirect_to :action => 'profile_page', :id => profile.id
  end

  def set_tags
    @countries = Country.all.collect(&:name)
    @research_type = ["Advertising Research", "Attitude & Usage Research", "Brand Research", "Business to Business", "Competitive Intelligence", "Concept/Positioning", "Consumer Research", "Corporate Image/Identity", "Customer Satisfaction", "Employee Surveys", "Demographic Research", "International (i.e. non-US)", "Legal Research", "Marketing Research", "Media Research", "Modeling & Predictive Research", "Mystery Shopping", "New Product Research", "Packaging Research", "Price Research", "Problem Detection", "Product Research", "Evaluation Studies", "Psychological Research", "Public Opinion", "Recruiting Research", "Retail Research", "Secondary Research", "Seminars/ Training", "Strategic Research", "Technology Evaluations", "Website Usability"]
    @industry_focus = ["Acquisitions", "Ad Agencies", "Agriculture", "Airlines", "Alcoholic Beverages", "Clothing", "Automotive", "Beverages", "Industrial", "Candy", "Gambling", "Chemicals", "Media & Communications", "Tech", "Construction", "Consumer Durables", "Consumer Services", "Cosmetics", "Demographics", "Education", "Electronics", "Entertainment", "Environment", "Fitness", "Fashion", "Financial Services & Investing", "Foods", "Gay & Lesbian", "Government", "Health Care", "Legal", "Couponing", "Military", "Non-Profits", "Packaged Goods", "Pets", "Oil & Gas", "Public Relations", "Real Estate", "Religion", "Retail", "Small Businesses", "Startups", "Sports", "Tobacco", "Toys", "Transportation", "Travel", "Utilities/Energy"]
  end

end
