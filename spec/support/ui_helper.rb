
module UiHelper

  def filling_signup registration
    visit "#{ui_path}/#/signup" unless page.has_css?("#signup-form")
    expect(page).to have_css("#signup-form")


    fill_in("signup-email", :with=>registration[:email])
    fill_in("signup-name", :with=>registration[:name])
    fill_in("signup-password", :with=>registration[:password])
    fill_in("signup-password_confirmation", :with=>registration[:password])
  end

  def signup registration, success=true

    filling_signup registration
    click_on("Sign Up")
    if success
      #TODO: uncomment after fixing the error
      # expect(page).to have_no_button("Sign Up")#, :wait=>5)
    else
      expect(page).to have_button("Sign Up")
    end

  end
end