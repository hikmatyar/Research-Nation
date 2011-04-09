class UserMailer < ActionMailer::Base

  def registration_email(first_name, last_name, email)
      recipients   email
      subject      "ResearchNation User"
      from         "no-reply@researchnation.net"
      content_type "text/html"
      body         :first_name => first_name,
                   :last_name => last_name,
                   :email => email
    sent_on Time.now
  end
  
  def password_reset_email(user, token)

      recipients   user.email
      subject      "ResearchNation Password Reset"
      from         "no-reply@researchnation.net"
      content_type "text/html"
      body         :email => user.email,
                   :url => "http://amazing.pk/users/new_password/#{user.id}?email=#{user.email}&token=#{token}"
    sent_on Time.now
  end
end
