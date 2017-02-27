require 'rails_helper'

RSpec.feature "Authns", type: :feature, :js => true do
  include_context "db_cleanup_each"
  let(:user_props) { FactoryGirl.attributes_for(:user) }

  feature "sign-up" do

    context "valid registration" do

      scenario "creates account and navigates away from signup page" do
        start_time = Time.now

        signup user_props

        # check for redirection to home page
        expect(page).to have_no_css("#signup-form")
        # check the DB for the new user
        user = User.where(:email=>user_props[:email]).first
        # make sure it is our recently created user
        expect(user.created_at).to be  > start_time
      end
    end

    context "rejected registration" do

      scenario "account not created and stays on page"

      scenario "displays error messages"

    end

    context "invalid field" do

      scenario "bad email"

      scenario "missing password"

    end
  end

  feature "anonymous user" do

    scenario "show login form"

  end

  feature "login" do

    context "valid user login" do

      scenario "closes form and displays current user name"

      scenario "menu shows logout option"

      scenario "can access authenticated resources"

    end

    context "invalid user login" do

      scenario "error message displayed and leaves user unauthenticated"

    end
  end

  feature "logout" do

    scenario "closes form and removes user name"

    scenario "can no longer access authenticated resources"

  end

end
