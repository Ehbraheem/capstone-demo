class Role < ActiveRecord::Base
  belongs_to :user, inverse_of: :roles
end
