require 'rails_helper'

RSpec.describe "Images", type: :request do
  include_context "db_cleanup_each"
  let(:account) { signup FactoryGirl.attributes_for(:user) }
  let(:image_props) { FactoryGirl.attributes_for(:image) }

  context "quick API check" do
    let!(:user) { login account}

    it_should_behave_like "resource index", :image

    it_should_behave_like "show resource", :image

    it_should_behave_like "create resource", :image

    it_should_behave_like "existing resource", :image

  end

  shared_examples "cannot create" do
    it "create fails" do
      jpost images_path, image_props
      expect(response.status).to be >= 400
      expect(response.status).to be < 500
      expect(parsed_body).to include("errors")
    end

    it "it created" do
      jpost images_path, image_props
      expect(response).to have_http_status :created
      payload = parsed_body
      expect(payload).to include("id")
      expect(payload).to include("caption"=>image_props[:caption])
      expect(payload).to include("user_roles")
      expect(payload["user_roles"]).to include(Role::ORGANIZER)
      expect(Role.where(:user_id=>user["id"],:role_name=>Role::ORGANIZER)).to exist
    end
  end

  shared_examples "cannot update" do |status|
    it "update fails with #{status}" do
      jput image_path(image_id), FactoryGirl.attributes_fr(:image)
      expect(response).to have_http_status status
      expect(parsed_body).to include "errors"
    end
  end

  shared_examples "cannot delete" do |status|
    it "delete fails with #{status}" do
      jdelete image_path(image_id), image_props
      expect(response).to have_http_status status
      expect(parsed_body).to include "errors"
    end
  end

  shared_examples "can create" do
    it "can create" do
      jpost images_path, image_props
      expect(response).to have_http_status :created
      payload=parsed_body
      expect(payload).to include("id")
      expect(payload).to include("caption"=>image_props[:caption])
    end
  end

  shared_examples "can update" do
    it "can update" do
      jput image_path(image_id), image_props
      expect(response).to have_http_status :no_content
    end
  end

  shared_examples "can delete" do
    it "can delete" do
      jdelete image_path(image_id)
      expect(response).to have_http_status :no_content
    end
  end

  shared_examples "all fields present" do |user_roles=[]|
    it "list has all fields" do
      jget images_path
      expect(response).to have_http_status :ok

      pp parsed_body
      payload=parsed_body
      expect(payload.size).to_not eq 0
      payload.each do |image|
        expect(image).to include("id")
        expect(image).to include("caption")
        if user_roles.empty?
          expect(image).to_not include "user_roles"
        else
          expect(image).to include "user_roles"
          expect(image["user_roles"].to_a).to include(*user_roles)
        end
      end
    end

    it "get has all fields" do
      jget image_path(image.id)
      expect(response).to have_http_status :ok

      pp parsed_body
      payload=parsed_body
      expect(payload).to include("id"=>image.id)
      expect(payload).to include("caption"=>image.caption)
    end

    it "get has all fields with #{user_roles}" do
      jget image_path(image.id)
      expect(response).to have_http_status :ok

      pp parsed_body
      payload=parsed_body
      expect(payload).to include("id"=>image.id)
      expect(payload).to include("caption"=>image.caption)
      if user_roles.empty?
        expect(payload).to_not include("user_roles")
      else
        expect(payload["user_rolse"].to_a).to include(*user_roles)
      end
    end
  end

  describe "access" do
    let(:images_props) { (1..3).map { FactoryGirl.attributes_for(:image, :with_caption) } }
    let(:image_props) { images_props[0] }
    let!(:images) { Image.create(images_props) }
    let!(:image) { images[0] }

    context "unauthenticated caller" do
      before(:each) { logout nil }

      it_should_behave_like "cannot create"

      it_should_behave_like "all fields present"

    end

    context "authenticated caller" do
      let!(:user) { login account }

      it_should_behave_like "can create"

      it_should_behave_like "all fields present"

    end
  end

  describe "Image authorization" do

    let(:alt_account) { signup FactoryGirl.attributes_for(:user) }
    let(:admin_account) { apply_admin(signup FactoryGirl.attributes_for(:user)) }
    let(:image_props) { FactoryGirl.attributes_for(:image, :with_caption) }
    let(:image_resources) { 3.times.map { create_resource images_path, :image} }
    let(:image_id) { image_resources[0]["id"] }
    let(:image) { Image.find(image_id) }

    context "caller is unauthenticated" do

      before(:each) { login account; image_resources; logout }

      it_should_behave_like "cannot create"
      it_should_behave_like "cannot update", :unathorized
      it_should_behave_like "cannot delete", :unathorized
      it_should_behave_like "all fields present", []
    end

    context "caller is authenticated organzer" do

      let!(:user) { login account }

      before(:each) { image_resources }

      it_should_behave_like "can create"
      it_should_behave_like "can update"
      it_should_behave_like "can delete"
      it_should_behave_like "all fields present"#, [Role::ORGANIZER]
    end

    context "caller is authenticated non-organizer" do

      before(:each) { login account; image_resources; login admin_account }

      it_should_behave_like "cannot update", :forbidden
      it_should_behave_like "can delete"
      it_should_behave_like "all fields present", []
    end
  end
end
