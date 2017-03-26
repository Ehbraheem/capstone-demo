class ImagePolicy < ApplicationPolicy

	def create?
		@user
	end

  def index?
    true
  end

  def update?
    organizer?
  end

  def show?
    true
  end

  def destroy?
    organizer_or_admin?
  end

  class Scope < Scope
    def user_roles
      join_clause = ["left join Roles r on r.mname='Image'",
                    "r.mid=Images.id",
                     "r.user_id #{user_criteria}"].join(" and ")
      scope.select("Images.*, r.role_name")
            .joins(join_clause)
    end
    def resolve
      user_roles
    end
  end
end
