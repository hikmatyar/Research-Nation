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
                   :url => "http://researchnation.net/users/new_password/#{user.id}?token=#{token}&email=#{user.email}"
    sent_on Time.now
  end

  def successful_purchase_email(current_user, resource)
      recipients   current_user.email
      subject      "ResearchNation:You have successfully purchased #{resource.title}"
      from         "no-reply@researchnation.net"
      content_type "text/plain"
      body         :user => current_user,
                   :resource => resource
      sent_on Time.now
  end


  def payment_sent_email(user, start_time, end_time, earnings)
      recipients   user.email
      subject      "ResearchNation: Payment sent of $ #{earnings}"
      from         "no-reply@researchnation.net"
      bcc           "postkhalid@yahoo.com"
      content_type "text/plain"
      body         :user => user,
                   :start_time => start_time,
                   :end_time => end_time,
                   :earnings => earnings
      sent_on Time.now
  end

end
