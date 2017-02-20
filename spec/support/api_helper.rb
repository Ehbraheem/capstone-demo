module ApiHelper

  def parsed_body
    JSON.parse response.body
  end

  # automate the passing of payload bodies as json
  %w( put post).each do |http_method_name|
    define_method("j#{http_method_name}") do |path, params={}, headers={}|
      headers = headers.merge('Content-Type' => 'application/json') if !params.empty?
      self.send(http_method_name, path, params.to_json, headers)
    end
  end

  RSpec.shared_examples "resource index" do |model|

    let!(:resources) { (1..5).map { |idx| FactoryGirl.create(model) } }
    let(:payload) { parsed_body }

    it "returns all #{model.to_s.classify} instances" do
      get send("#{model}s_path"), {}, { "Accept" => "application/json"}
      expect(response).to have_http_status :ok
      expect(response.content_type).to eq "application/json"

      expect(payload.count).to eq resources.count
      response_check if respond_to?(:response_check)
    end

  end

  RSpec.shared_examples "show resource" do |model|
    let(:resource) { FactoryGirl.create(model) }
    let(:payload) { parsed_body}
    let(:bad_id) { 1234567890 }

    it "returns #{model.to_s.classify} when using correct ID" do
      get send("#{model}_path",(resource.id))
      expect(response).to have_http_status :ok
      expect(response.content_type).to eq "application/json"

      response_check if respond_to?(:response_check)
    end

    it "returns not found when using incorrect ID" do
      get send("#{model}_path", bad_id)
      expect(response).to have_http_status(:not_found)
      expect(response.content_type).to eq("application/json")
      error_state if respond_to?(:error_state)
    end
  end

  RSpec.shared_examples "create resource" do |model|
    let(:resource_state) { FactoryGirl.attributes_for(model) }

    it "can create #{model.to_s.classify} with provided name" do
      jpost send("#{model}s_path"), resource_state
      expect(response).to have_http_status :created
      expect(response.content_type).to eq "application/json"
      check_data if respond_to?(:check_data)
    end
  end

  RSpec.shared_examples "existing resource" do |model|
    let(:resource) { FactoryGirl.create(model) }
    let(:new_name) { "testing" }

    it "can update name" do
      # verify name is not yet the new name
      expect(resource.name).to_not eq(new_name)
      jput send("#{model}_path",resource.id), {:name => new_name}

      expect(response).to have_http_status :no_content

      # verify the changes propagate to the DB
      response_check if respond_to?(:response_check)
    end

    it "can be deleted" do
      head send("#{model}_path",resource.id)
      expect(response).to have_http_status :ok

      delete send("#{model}_path",resource.id)
      expect(response).to have_http_status :no_content

      head send("#{model}_path",resource.id)
      expect(response).to have_http_status :not_found
    end
  end

end