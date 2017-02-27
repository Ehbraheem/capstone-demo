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

      background(:each) do
        signup user_props
        expect(page).to have_no_css("#signup-form")
      end

      scenario "account not created and stays on page" do
        dup_user = FactoryGirl.attributes_for(:user, :email=>user_props[:email])
        signup dup_user, false # should be rejected by server

        # account not created
        expect(User.where(:email=>user_props[:email], :name=>user_props[:name])).to exist
        expect(User.where(:email=>dup_user[:email], :name=>dup_user[:name])).to_not exist

        expect(page).to have_css("#signup-form")
        expect(page).to have_button("Sign Up")
      end

      scenario "displays error messages" do
        bad_props = FactoryGirl.attributes_for(:user,
                                               :email=>user_props[:email],
                                               :password=>"123")
                                                .merge(:password_confirmation=>"abc")
        signup bad_props, false

        # displays error information
        expect(page).to have_css("#signup-form > span.invalid",
                                  :text=>"Password confirmation doesn't match password")
      end

    end

    context "invalid field" do

      after(:each) do
        within("#signup-form") do
          expect(page).to have_button("Sign Up", :disabled=>true)
        end
      end

      scenario "bad email" do

        filling_signup FactoryGirl.attributes_for(:user, :email=>"yadayadayada")
        expect(page).to have_css("input[name='signup-email'].ng-invalid-email")

      end

      scenario "missing password" do

        filling_signup FactoryGirl.attributes_for(:user, :password=>nil)
        expect(page).to have_css("input[name='signup-password'].ng-invalid-required")
        expect(page).to have_css("input[name='signup-password_confirmation'].ng-invalid-required")

      end

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
