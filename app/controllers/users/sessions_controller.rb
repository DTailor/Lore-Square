class Users::SessionsController < Devise::SessionsController
  layout 'users'

def after_sign_in_path_for(resource)
  pages_index_path
end

end
