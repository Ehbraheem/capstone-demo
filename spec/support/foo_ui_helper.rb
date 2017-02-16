module FooUiHelper

  FOO_FORM_XPATH = "//h3[text()='Foos']/../form"
  FOO_LIST_XPATH = "//h3[text()='Foos']/../ul"

  def create_foo foo_state
    visit root_path unless page.has_css?("h3", text:"Foos") # already on the Foos page
    expect(page).to have_css("h3", text:"Foos") # on the Foos page
    within(:xpath, FOO_FORM_XPATH)do
      fill_in("name", :with => foo_state[:name])
      click_button("Create Foo")
    end
    within(:xpath, FOO_LIST_XPATH) do
      using_wait_time 5 do
        expect(page).to have_css("li a", :text=>foo_state[:name])
      end
    end
  end

  def update_foo existing_name, new_name

    within(:xpath, FOO_FORM_XPATH) do
      find_field("name", :readonly=>false, :wait=>5)
      fill_in("name", :with=> new_name)
      click_button("Update Foo")
    end
    within(:xpath, FOO_LIST_XPATH) do
      expect(page).to have_css("li", count:1)     # only one record exist after update
      expect(page).to have_no_css("li", text:existing_name)
      expect(page).to have_css("li a")
      expect(page).to have_css("li", text:new_name)
      expect(page).to have_no_content(existing_name)
      expect(page).to have_content(new_name)
    end

  end

  def delete_foo name

    within(:xpath, FOO_FORM_XPATH) do
      click_button("Delete Foo")
    end
    within(:xpath, FOO_FORM_XPATH) do
      expect(page).to have_css("input[ng-model*='foo.name']")
      expect(page).to have_no_content("Update Foo")
      expect(page).to have_no_content("Delete Foo")
      expect(page).to have_content("Create Foo")
    end
    within(:xpath, FOO_LIST_XPATH) do
      expect(page).to have_css("li", count:0)     # no record exist after delete
      expect(page).to have_no_css("li", text:foo_state[:name])
      expect(page).to have_no_css("li a")
      expect(page).to have_no_css("li", text:new_name)
      expect(page).to have_no_content(foo_state[:name])
      expect(page).to have_no_content(new_name)
    end

  end

end