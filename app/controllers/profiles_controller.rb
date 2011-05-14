class ProfilesController < ApplicationController

  before_filter :set_tags, :only => ["company", "individual", "view_profile_list", "edit_individual_profile", "edit_company_profile"]

  before_filter :redirect_to_login, :except => ["view_profile_list", "search_results", "profile_page"]

  before_filter :redirect_to_admin_login, :only => ["delete"]

  def view_profile_list
    @profiles = []
    if !params[:company_type].blank?
    @profiles = Profile.through_company_type(params[:company_type])
    elsif !params[:services].blank?
      @profiles = Profile.through_services(params[:services])
    else
      @profiles = Profile.edited.interested
    end
  end

  def search_results
    choices = params[:choices].split(",") unless params[:choices].blank?
    conditions = ''
    conditions  = "country = '#{params[:country].strip}' " if params[:country].strip.downcase != "all"
    if params[:profile_type].strip.downcase != "all" and conditions.size > 0
      conditions  += " AND profile_type = '#{params[:profile_type].strip.downcase}' "
    elsif params[:profile_type].strip.downcase != "all"
      conditions  = "profile_type = '#{params[:profile_type].strip.downcase}' "
    end
    if conditions.size > 0
      conditions  += " AND is_edited = 1 "
    else
      conditions = "is_edited = 1"
    end

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
      conditions  +=  " and interested_in IS NULL"
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


  def update
    set_profile_data

    @profile.update_profile_information(params[:profile], params[:key_individual])
    if @profile.errors.empty?
      if (session[:admin] && !params[:user_id].blank?)
        flash[:notice] = "Profile information updated successfully"
        return redirect_to :controller => 'admin', :action => 'profiles'
      else
        flash[:notice] = "Your information was updated successfully"
        return redirect_to :controller => 'users', :action => 'profile'
      end
    end
    return render :action => :edit_individual_profile if @profile.individual?
    return render :action => :edit_company_profile
  end

  def types
    render :text => "company\nindividual"
  end

  def edit_individual_profile
    set_profile_data
  end

  def edit_company_profile
    set_profile_data
  end

  def delete
    user = User.find params[:user_id]
    if !user.profile.blank? && user.profile.destroy
      flash[:notice] = "Profile deleted."
    end
    return redirect_to :controller => 'admin', :action => 'profiles'
  end

  def send_message_to_profile
    profile = Profile.find_by_url_slug params[:id]
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
    @company_type = ["Large Firm", "Medium-sized Firm", "Small Firm", "Internet Startup"]
    @services = ["Surveys", "Focus Groups", "Custom Research", "Full Service"]
  end

  def set_profile_data
    user_id = (session[:admin] && !params[:user_id].blank?) ? params[:user_id] : session[:user]
    user = User.find user_id

    @profile = user.profile.blank? ? Profile.new : user.profile
    if @profile.new_record?
      @profile.user_id = user_id
      user.company? ? @profile.profile_type = "company" : @profile.profile_type = "individual"
      @profile.save
    end

    @key_individual = @profile.key_individual.blank? ? KeyIndividual.new : @profile.key_individual
    if @key_individual.new_record?
      @key_individual.profile_id = @profile.id
      @key_individual.save
    end

  end

end
