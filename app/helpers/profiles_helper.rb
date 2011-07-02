module ProfilesHelper

  def days_ago(prev_date)
    days = ((Time.now - prev_date)/1.day).to_i
    return "Today" if days == 0
    return  "1 day ago" if days == 1
    return  "#{days} days ago"
  end
end
