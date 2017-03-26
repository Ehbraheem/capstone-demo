class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def orgaizer_or_admdin?
    user.has_role([Role::ADMIN, Role::ORGANIZER], @record.model_name.name, @record.id)
  end

  def organizer?
    @user.has_role([Role::ORGANIZER], @record.model_name.name, @record.id)
  end

  def member_or_organizer?
    @user.has_role([Role::MEMBER, Role::ORGANIZER], @record.model_name.name, @record.id)
  end

  def member?
    @user.has_role([Role::MEMBER], @record.model_name.name, @record.id)
  end

  def originator?
    @user.has_role([Role::ORIGINATOR], @record.model_name.name, @record.id)
  end

  def index?
    false
  end

  def show?
    scope.where(:id => record.id).exists?
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  def scope
    Pundit.policy_scope!(user, record.class)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope
    end
  end
end
