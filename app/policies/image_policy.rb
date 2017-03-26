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
    def resolve
      if @user
        scope
      else
        scope.where("1!=1")
      end
    end
  end
end
