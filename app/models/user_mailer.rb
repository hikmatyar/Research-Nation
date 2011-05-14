class UserMailer < ActionMailer::Base

  def registration_email(first_name, last_name, email)
      recipients   email
      subject      "Welcome to Research Nation!"
      from         "no-reply@researchnation.net"
      content_type "text/html"
      body         :first_name => first_name,
                   :last_name => last_name,
                   :email => email
    sent_on Time.now
  end

  def password_reset_email(user, token)

      recipients   user.email
      subject      "Research Nation - Password Reset"
      from         "no-reply@researchnation.net"
      content_type "text/html"
      body         :email => user.email,
                   :url => "http://researchnation.net/users/new_password/#{user.id}?token=#{token}&email=#{user.email}"
    sent_on Time.now
  end

  def successful_purchase_email(current_user, resource)
      recipients   current_user.email
      subject      "Research Nation - You have successfully purchased #{resource.title}"
      from         "no-reply@researchnation.net"
      content_type "text/html"
      body         :user => current_user,
                   :resource => resource
      sent_on Time.now
  end


  def payment_sent_email(user, start_time, end_time, earnings)
      recipients   user.email
      subject      "Research Nation - Payment sent of US$ #{earnings}"
      from         "no-reply@researchnation.net"
      bcc           "admin@researchnation.net"
      content_type "text/html"
      body         :user => user,
                   :start_time => start_time.strftime("%B %d, %Y"),
                   :end_time => end_time.strftime("%B %d, %Y"),
                   :earnings => earnings.to_i
      sent_on Time.now
  end

end
