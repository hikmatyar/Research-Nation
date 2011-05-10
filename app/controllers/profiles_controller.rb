class ProfilesController < ApplicationController

  before_filter :set_tags, :only => ["company", "individual", "view_profile_list", "edit_individual_profile", "edit_company_profile"]

  before_filter :redirect_to_login, :except => ["view_profile_list", "search_results", "profile_page"]

  def view_profile_list
    @profiles = []
    profiles = params[:filter].blank? ? ( Profile.find :all, :order => 'created_at DESC' ) : ( Profile.find :all, :conditions => [ "research_type = ? OR industry_focus = ?", params[:filter], params[:filter] ], :order => 'created_at DESC')
    profiles.each do |profile|
      @profiles.push(profile) unless profile.is_edited==false || profile.user.user_type == "Buyer"
    end
  end

  def search_results
    choices = params[:choices].split(",") unless params[:choices].blank?

    conditions   = "profile_type ='seller'"
    conditions  += " AND industry_focus = '#{params[:industry].strip}'" if params[:industry].downcase != "all"
    conditions  += " AND country = '#{params[:country].strip}' " if params[:country].strip.downcase != "all"
    conditions  += " AND profile_type = '#{params[:profile_type].strip}' " if params[:profile_type].strip.downcase != "all"
    conditions  += "AND is_edited = 1 "

    @profiles = []
    profiles_list = Profile.find :all, :conditions => conditions, :order => 'created_at DESC'

    unless choices.blank?
      profiles_list.each do |profile|
        choices.each do |choice|
          if !profile.interested_in.blank? && profile.interested_in.split(",").include?(choice)
            @profiles << profile
            break
          end
        end
      end
    else
      conditions  +=  "and interested_in IS NULL"
      @profiles = (Profile.find :all, :conditions => conditions, :order => 'created_at DESC')
    end
    @profiles.flatten!
   render :partial => 'profiles'
  end

  def profile_page
    @profile = Profile.find_by_url_slug params[:url_slug]
    @interests = @profile.interested_in.split(",") unless @profile.interested_in.blank?
    @user = User.new unless logged_in?
  end

  def company
    @profile = Profile.new
  end

  def individual
    @profile = Profile.new
  end

  def create
    profile = session[:profile].blank? ? Profile.new(params[:profile]) : session[:profile]
    key_individual = session[:key_individual].blank? ? KeyIndividual.new(params[:key_individual]) : session[:key_individual]

    unless logged_in?
      session[:key_individual] = key_individual
      session[:profile] = profile
      return redirect_to :controller => 'users'  , :action => 'register'
    end

    profile.user_id = session[:user]
    if profile.save
      key_individual = KeyIndividual.new
      key_individual.profile_id = profile.id
      key_individual.save

      session[:profile] = nil
      session[:key_individual] = nil

      key_individual.profile_id = profile.id
      key_individual.save
      return redirect_to :controller => 'users', :action => 'profile'
    end
  end

  def update

    profile = Profile.find params[:id]
    key_individual = profile.key_individual.blank? ? KeyIndividual.new : profile.key_individual

    if key_individual.new_record?
      key_individual.profile_id = profile.id
      key_individual.save
    end

    profile.update_profile_information(params[:profile], params[:key_individual])

    flash[:notice] = "Your information was updated successfully"
    return redirect_to :controller => 'users', :action => 'profile'

  end

  def types
    render :text => "company\nindividual"
  end

  def edit_individual_profile
    user = User.find session[:user]
    redirect_to_home if user.company_seller?  || user.profile.id == params[:id]
    @profile = Profile.find params[:id]
    @key_individual = @profile.key_individual unless @profile.key_individual.blank?
  end

  def edit_company_profile
    user = User.find session[:user]
    redirect_to_home if !user.company_seller? || user.profile.id == params[:id]
    @profile = Profile.find params[:id]
    @key_individual = @profile.key_individual unless @profile.key_individual.blank?
  end

  def delete
    profile = Profile.find params[:id]
    profile.destroy
    return redirect_to :controller => 'admin', :action => 'dashboard'
  end

  def send_message_to_profile
    profile = Profile.find params[:id]
    message = Message.new
    message.subject = params["subject"]
    message.body = params[:message]
    message.sender = User.find session[:user]
    message.recipient = profile.user
    if message.save
      return render :text => "<p class='flash'>Thank you! Your message has been sent</p>"
    else
      render :text => "Hmm. Something seems to be wrong...let me look into it"
    end
  end

private
  def set_tags
    @research_type = ["Advertising Research", "Attitude & Usage Research", "Brand Research", "Business to Business", "Competitive Intelligence", "Concept/Positioning", "Consumer Research", "Corporate Image/Identity", "Customer Satisfaction", "Employee Surveys", "Demographic Research", "International (i.e. non-US)", "Legal Research", "Marketing Research", "Media Research", "Modeling & Predictive Research", "Mystery Shopping", "New Product Research", "Packaging Research", "Price Research", "Problem Detection", "Product Research", "Evaluation Studies", "Psychological Research", "Public Opinion", "Recruiting Research", "Retail Research", "Secondary Research", "Seminars/ Training", "Strategic Research", "Technology Evaluations", "Website Usability"]
    @industry_focus = ["All", "Acquisitions", "Ad Agencies", "Agriculture", "Airlines", "Alcoholic Beverages", "Clothing", "Automotive", "Beverages", "Industrial", "Candy", "Gambling", "Chemicals", "Media & Communications", "Tech", "Construction", "Consumer Durables", "Consumer Services", "Cosmetics", "Demographics", "Education", "Electronics", "Entertainment", "Environment", "Fitness", "Fashion", "Financial Services & Investing", "Foods", "Gay & Lesbian", "Government", "Health Care", "Legal", "Couponing", "Military", "Non-Profits", "Packaged Goods", "Pets", "Oil & Gas", "Public Relations", "Real Estate", "Religion", "Retail", "Small Businesses", "Startups", "Sports", "Tobacco", "Toys", "Transportation", "Travel", "Utilities/Energy"]
  end

end
