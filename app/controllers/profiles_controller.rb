class ProfilesController < ApplicationController

  layout 'main'

  before_filter :set_tags, :only => ["company", "individual", "view_profile_list", "edit_individual_profile", "edit_company_profile"]

  def company
    @profile = Profile.new
  end

  def individual
    @profile = Profile.new
  end

  def view_profile_list
    @profiles = []

    users = User.find_all_by_user_type "Seller"
    users.each do |user|
      @profiles.push(user.profile) unless user.profile.blank?
    end
    @industry_focus.push("All")
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

    profile.user_id = session[:user]
    if profile.save
      unless params[:picture].blank?
        picture = Picture.new
        picture.profile_id = profile.id
        picture.add_picture(picture_path, params[:picture])
      end
      session[:profile] = nil
      session[:key_individual] = nil

      key_individual.profile_id = profile.id
      key_individual.save
      return redirect_to :controller => 'resources', :action => 'view_posts'
    end

  end

  def types
    render :text => "company\nindividual"
  end

  def edit_individual_profile
    @profile = Profile.find params[:id]
    @key_individual = @profile.key_individual
  end

  def edit_company_profile
    @profile = Profile.find params[:id]
    @key_individual = @profile.key_individual
  end

  def delete
    profile = Profile.find params[:id]
    profile.destroy
    return redirect_to :controller => 'admin', :action => 'dashboard'
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

  def search_results
    choices = params[:choices].split(",") unless params[:choices].blank?
    @profiles = Array.new
    unless params[:choices].blank?
      choices.each do |choice|
        @profiles.push(Profile.find :all, :conditions => ['interested_in like ? and industry_focus = ? and location = ? and profile_type = ?', "%#{choice}%", params[:industry], params[:location], params[:profile_type]], :order => 'created_at DESC')
      end
    end
    @profiles.push(Profile.find :all, :conditions => ['industry_focus = ? and location = ? and profile_type = ?', params[:industry], params[:location], params[:profile_type]], :order => 'created_at DESC') if params[:choices].blank?
   render :partial => 'profiles'
  end

  def send_mail_to_profile
    individual = KeyIndividual.find_by_email params[:email]
    profile = individual.profile
    body = params[:contact]
    ContactMailer.deliver_profile_email body["name"], body["email"], body["subject"], body["message"], recipient
    return redirect_to :action => 'profile_page', :id => profile.id
  end

private
  def set_tags
    @research_type = ["Advertising Research", "Attitude & Usage Research", "Brand Research", "Business to Business", "Competitive Intelligence", "Concept/Positioning", "Consumer Research", "Corporate Image/Identity", "Customer Satisfaction", "Employee Surveys", "Demographic Research", "International (i.e. non-US)", "Legal Research", "Marketing Research", "Media Research", "Modeling & Predictive Research", "Mystery Shopping", "New Product Research", "Packaging Research", "Price Research", "Problem Detection", "Product Research", "Evaluation Studies", "Psychological Research", "Public Opinion", "Recruiting Research", "Retail Research", "Secondary Research", "Seminars/ Training", "Strategic Research", "Technology Evaluations", "Website Usability"]
    @industry_focus = ["Acquisitions", "Ad Agencies", "Agriculture", "Airlines", "Alcoholic Beverages", "Clothing", "Automotive", "Beverages", "Industrial", "Candy", "Gambling", "Chemicals", "Media & Communications", "Tech", "Construction", "Consumer Durables", "Consumer Services", "Cosmetics", "Demographics", "Education", "Electronics", "Entertainment", "Environment", "Fitness", "Fashion", "Financial Services & Investing", "Foods", "Gay & Lesbian", "Government", "Health Care", "Legal", "Couponing", "Military", "Non-Profits", "Packaged Goods", "Pets", "Oil & Gas", "Public Relations", "Real Estate", "Religion", "Retail", "Small Businesses", "Startups", "Sports", "Tobacco", "Toys", "Transportation", "Travel", "Utilities/Energy"]
  end

end
