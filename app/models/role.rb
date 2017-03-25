class Role < ActiveRecord::Base
  ADMIN="admin"
  ORIGINATOR="originator"
  ORGANIZER="organizer"
  MEMBER="member"

  belongs_to :user, inverse_of: :roles
end
