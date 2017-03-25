require 'rails_helper'

RSpec.describe Role, type: :model do

  context "user assigned roles" do
    # we start with an instance of a Devise user in the database
    let(:user) { FactoryGirl.create(:user) }

    it "has roles" do
      # we add two Role definition to the Devise user
      user.roles.create(:role_name=>Role::ADMIN)
      user.roles.create(:role_name=>Role::ORIGINATOR, :mname=>"Foo")
      user.roles.create(:role_name=>Role::ORGANIZER, :mname=>"Bar", :mid=>1)
      user.roles.create(:role_name=>Role::MEMBER, :mname=>"Baz", :mid=>1)

      db_user = User.find(user.id)
      expect(db_user.has_role([Role::ADMIN])).to be true
      expect(db_user.has_role([Role::ORIGINATOR], "Bar")).to be false
      expect(db_user.has_role([Role::ORIGINATOR], "Foo")).to be true
      expect(db_user.has_role([Role::MEMBER], "Baz", 1)).to be true
    end
  end
end
