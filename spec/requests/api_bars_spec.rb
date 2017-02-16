require 'rails_helper'

RSpec.describe "Bar API", type: :request do

  include_context "db_cleanup_each"

  context "caller requests list of Bars" do
    it_should_behave_like "resource index", :bar do
      let(:response_check) do
        expect(payload.count).to eq resources.count
        expect(payload.map { |f| f["name"]}).to eq(resources.map { |f| f[:name]})
        # pp "PAYLOAD GOOD!!!"
      end
    end
  end

  context "a specific Bar exists" do
    it_should_behave_like "show resource", :bar do
      let(:response_check) do
        expect(payload).to have_key("id")
        expect(payload).to have_key("name")
        expect(payload["id"]).to eq(resource.id.to_s)
        expect(payload["name"]).to eq(resource.name)
        pp "PAYLOAD GOOD!!!"
      end
      let(:error_state) do
        expect(payload).to have_key("errors")
        expect(payload["errors"]).to have_key("full_messages")
        expect(payload["errors"]["full_messages"][0]).to include("cannot", "#{bad_id}")
      end
    end
  end

  context "create a new Bar" do
    it_should_behave_like "create resource", :bar do
      let(:check_data) do

        bar = Bar.where("name" => resource_state[:name]).first
        # pry.binding
        expect(bar).to_not be_nil
        expect(bar).to respond_to(:name, :name=)
      end
    end
  end

  context "existing Bar" do
    it_should_behave_like "existing resource", :bar do
      let(:response_check) do
        expect(Bar.find(resource.id).name).to eq(new_name)
      end
    end
  end

end
