set :application, "69.41.161.175"
role :app, application
role :web, application
role :db,  application, :primary => true

set :user, "deploy"
set :deploy_to, "/www/d3velopers/researchnation/"

set :scm, :git
set :repository,  "git@github.com:hikmatyar/Research-Nation.git"
#set :branch, "integrations"

namespace :deploy do
  desc "Restart passenger"
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end

  desc "Create symbolic links for log"
  task :symlink_shared do
    run "mkdir -p #{shared_path}/log"
  end

end

#after 'deploy:update_code', 'deploy:symlink_shared'
