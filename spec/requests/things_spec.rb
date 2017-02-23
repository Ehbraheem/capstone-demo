require 'rails_helper'

RSpec.describe "Things", type: :request do

  include_context "db_cleanup_each", :transaction
  let(:account) { signup FactoryGirl.attributes_for(:user) }
  let(:thing_props) { FactoryGirl.attributes_for(:thing)}

  context "quick API check" do
    let!(:user) { login account}

    it_should_behave_like "resource index", :thing

    it_should_behave_like "show resource", :thing

    it_should_behave_like "create resource", :thing

    it_should_behave_like "existing resource", :thing
  end


  shared_examples "can create" do

    it "can create" do
      jpost things_path, thing_prop
      expect(response).to have_http_status :created
      payload = parsed_body
      expect(payload).to include("id")
      # byebug
      expect(payload).to include("name"=>thing_prop[:name])
      expect(payload).to include("notes"=>thing_prop[:notes])
      expect(payload).to include("description"=>thing_prop[:description])
    end

    it "reports error for invalid data" do
      jpost things_path, thing_prop.except(:name)
      pp parsed_body
      #must require :name property -- otherwise get :unprocessable_entity
      #must rescue ActionController::ParameterMissing exception
      #must render :bad_request
      payload = parsed_body
      expect(payload).to include("errors")
      expect(payload["errors"]).to include("full_messages")
      expect(payload["errors"]["full_messages"]).to include /name/i
      expect(response).to have_http_status(:bad_request)

    end
  end

  shared_examples "cannot create" do

    it "create fails" do
      jpost things_path, thing_props
      expect(response.status).to be >= 400
      expect(response.status).to be < 500
      expect(parsed_body).to include("errors")
    end

  end

  shared_examples "annonymous user all fields present" do

    it "get has all fields" do
      jget thing_path(thing_id)
      expect(response).to have_http_status :ok

      # pp parsed_body
      payload = parsed_body
      expect(payload).to include("id"=> thing.id)
      expect(payload).to include("name" => thing.name)
      expect(payload).to include("description" => thing.description)
      expect(payload).to include("notes"=> thing.notes)
    end

  end

  shared_examples "authenticated user all fields present" do

    it "list has all fields" do
      jget things_path
      expect(response).to have_http_status :ok

      # pp parsed_body
      payload = parsed_body
      expect(payload.size).to be > 0
      payload.each do |thing|
        expect(thing).to include("id")
        expect(thing).to include("name")
        expect(thing).to include("notes")
        expect(thing).to include("description")
      end
    end

  end

  shared_examples "can delete" do
    it "delete instance" do
      jdelete thing_path(thing_id)
      expect(response).to have_http_status :no_content
    end
  end

  shared_examples "cannot delete" do
    it "fails to delete" do
      jdelete thing_path(thing_id)
      expect(response.status).to be >= 400
      expect(response.status).to be < 500
      expect(parsed_body).to include("errors")
    end
  end

  shared_examples "can update" do
    it "update successfully" do
      jput thing_path(thing_id), thing_props
      expect(response).to have_http_status :no_content
    end

    it "reports update error for invalid data" do
      jput thing_path(thing_id), thing_props.merge(name: nil)
      expect(response).to have_http_status :bad_request
    end

  end

  shared_examples "cannot update" do
    it "fails to update" do
      jput thing_path(thing_id), thing_props
      expect(response.status).to be >= 400
      expect(response.status).to be < 500
    end
  end

  shared_examples "field(s) redacted" do

    let(:redacted_thing) { setup_redacted[0]}

    # before(:all) { setup_redacted }

    it "list does not include non-fields" do
      # setup_redacted
      jget things_path
      expect(response).to have_http_status :ok
      payload = parsed_body
      payload.each do |thing|
        expect(thing).to include("name")
        expect(thing).to include("description")
        expect(thing).to include("notes")
        expect(thing).to include("id")
      end

    end

    it "list does not include non-members" do
      # setup_redacted
      jget thing_path(redacted_thing)
      expect(response).to have_http_status :ok
      payload = parsed_body
      expect(payload).to include("name"=>redacted_thing.name)
      expect(payload).to include("description"=>nil)
      expect(payload).to include("notes"=>nil)
      expect(payload).to include("id"=>redacted_thing.id)
    end

    it "list does not include notes" do
      # setup_redacted
      jget thing_path(redacted_thing)
      expect(response).to have_http_status :ok
      payload = parsed_body
      expect(payload).to include "id"=>redacted_thing.id
      expect(payload).to include "name"=>redacted_thing.name
      expect(payload).to include "notes"
      expect(payload["notes"]).to eq nil
    end

    it "list does not include descripton" do
      # setup_redacted
      # pp setup_redacted
      jget thing_path(redacted_thing)
      expect(response).to have_http_status :ok
      payload = parsed_body
      expect(payload).to include "id"=>redacted_thing.id
      expect(payload).to include "name"=>redacted_thing.name
      expect(payload).to include "description"
      expect(payload["description"]).to eq nil
    end
  end

  shared_examples "field(s) not redacted" do

    it "list does include notes and description" do |things|
      jget things_path
      expect(response).to have_http_status :ok
      payload = parsed_body
      payload.each do |thing|
        expect(thing).to include("name")
        expect(thing).to include("notes")
        expect(thing).to include "description"
        expect(thing).to include "id"
      end
    end
  end

  describe "access" do
    let(:things_props) { (1..5).map { FactoryGirl.attributes_for(:thing, :with_fields ) } }
    let(:thing_prop) { things_props[0] }
    let!(:things) { Thing.create(things_props) }
    let(:thing) { things[0] }
    let(:thing_id) { thing.id }
    let(:setup_redacted) { Thing.delete_all; Thing.create(things_props.map { |thing| thing.except!(:notes, :description)}) }

    context "unauthenticated caller" do
      before(:each) do
        logout nil
      end

      it_should_behave_like "cannot create"

      it_should_behave_like "annonymous user all fields present"

      it_should_behave_like "cannot update"

      it_should_behave_like "cannot delete"

    end

    context "authenticated caller" do
      let!(:user) { login account }

      it_should_behave_like "can create"

      it_should_behave_like "authenticated user all fields present"

      it_should_behave_like "annonymous user all fields present"

      it_should_behave_like "can update"

      it_should_behave_like "can delete"

      it_should_behave_like "field(s) not redacted"

      it_should_behave_like "field(s) redacted"

    end

  end


end
