class User < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable
          # :confirmable, :omniauthable
  include DeviseTokenAuth::Concerns::User

  has_many :roles, inverse_of: :user, dependent: :destroy

  def has_role role_list, mname=nil, mid=nil
    role_names = roles.relevant(mname, mid).map {|r| r.role_name }
    (role_names & role_list).any?
  end
end
