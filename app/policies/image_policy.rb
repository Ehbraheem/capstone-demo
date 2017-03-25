class ImagePolicy < ApplicationPolicy

	def create?
		@user
	end

  def index?
    true
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
