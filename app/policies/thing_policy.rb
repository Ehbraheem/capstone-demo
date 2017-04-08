class ThingPolicy < ApplicationPolicy

  def index?
    true
  end

  def show?
    @user
  end

  def create?
    byebug
    originator?
  end

  def update
    organizer?
  end

  def  destroy?
    organizer_or_admin?
  end

  def get_linkables?
    true
  end

  def get_images?
    true
  end

  def add_image?
    member_or_organizer?
  end

  def update_image?
    organizer?
  end

  def remove_image?
    organizer_or_admin?
  end

  class Scope < Scope

    def user_roles members_only=true
      join_condition = members_only ? "join" : "left join"
      joins_caluse = ["#{join_condition} Roles r on r.mname='Thing'",
                      "r.mid=Things.id",
                        "r.user_id #{user_criteria}"].join(" and ")
      scope.select("Thing.*, r.role_name")
            .joins(joins_caluse)
      .tap { |s|
        if members_only
          s.where("r.role_name"=>[Role::ORGANIZER, Role::MEMBER])
        end
      }
    end
    def resolve
      user_roles
    end
  end
end
