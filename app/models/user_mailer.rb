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
end
