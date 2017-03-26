module ApiHelper

  def parsed_body
    JSON.parse response.body
  end

  # automate the passing of payload bodies as json
  %w( put post patch delete get head ).each do |http_method_name|
    define_method("j#{http_method_name}") do |path, params={}, headers={}|
      if %w( post put patch ).include? http_method_name
        headers = headers.merge('Content-Type' => 'application/json') if !params.empty?
        params = params.to_json
      end
      self.send(http_method_name,
                path,
                params,
                headers.merge(access_tokens))
    end
  end

  def signup registration, status=:ok
    jpost user_registration_path, registration
    # pp parsed_body
    expect(response).to have_http_status status
    payload = parsed_body
    if response.ok?
      registration.merge(:id => payload["data"]["id"],
                          :uid => payload["data"]["uid"])
    end
  end

  def login credentials, status=:ok
    # byebug
    jpost user_session_path, credentials.slice(:email, :password)
    expect(response).to have_http_status status
    response.ok? ? parsed_body["data"] : parsed_body
  end

  def logout status=:ok
    jdelete destroy_user_session_path
    @last_tokens = {}
    expect(response).to have_http_status status if status
  end

  def access_tokens?
    !response.headers["access-token"].nil? if response
  end

  def access_tokens
    if access_tokens?
      @last_tokens = ["uid", "client", "token-type", "access-token"].inject({}) {|h,k| h[k]=response.headers[k]; h}
    end
    @last_tokens || {}
  end

  def create_resource path, factory, status=:created
    # byebug
    jpost path, FactoryGirl.attributes_for(factory)
    expect(response).to have_http_status status
    parsed_body
  end

  def apply_admin account
    User.find(account.symbolize_keys[:id]).roles.create(:role_name=>Role::ADMIN)
    account
  end

  def apply_originator account, model_class
    User.find(account.symbolize_keys[:id]).add_role(Role::ORIGINATOR, model_class).save
    account
  end

  def apply_role account, role, object
    user = User.find(account.symbolize_keys[:id])
    arr = object.kind_of?(Array) ? object : [object]
    arr.each do |m|
      user.add_role(role, m).save
    end
    account
  end

  def apply_organizer account, object
    apply_role(account, Role::ORGANIZER, object)
  end

  def apply_member account, object
    apply_role(account, Role::MEMBER, object)
  end

end

RSpec.shared_examples "resource index" do |model|

  let!(:resources) { (1..5).map { |idx| FactoryGirl.create(model) } }
  let(:payload) { parsed_body }

  it "returns all #{model.to_s.classify} instances" do
    jget send("#{model}s_path"), {}, { "Accept" => "application/json"}
    expect(response).to have_http_status :ok
    expect(response.content_type).to eq "application/json"

    expect(payload.count).to eq resources.count
    response_check if respond_to?(:response_check)
  end

end

RSpec.shared_examples "modifiable resource" do |model|
  let(:resource) do
    jpost send("#{model}s_path"), FactoryGirl.attributes_for(model)
    expect(response).to have_http_status :created
    parsed_body
  end

  let(:new_state) { FactoryGirl.attributes_for model }

  it "can update #{model}" do
    # change to new state
    jput send("#{model}_path", resource["id"]), new_state
    expect(response).to have_http_status :no_content

    update_check if respond_to? :update_check
  end

  it "can be deleted" do
    jhead send("#{model}_path", resource["id"])
    expect(response).to have_http_status :ok

    jdelete send("#{model}_path", resource["id"])
    expect(response).to have_http_status :no_content

    jhead send("#{model}_path", resource["id"])
    expect(response).to have_http_status(:not_found)
  end
end

RSpec.shared_examples "show resource" do |model|
  let(:resource) { FactoryGirl.create(model) }
  let(:payload) { parsed_body}
  let(:bad_id) { 1234567890 }

  it "returns #{model.to_s.classify} when using correct ID" do
    jget send("#{model}_path",(resource.id))
    expect(response).to have_http_status :ok
    expect(response.content_type).to eq "application/json"

    response_check if respond_to?(:response_check)
  end

  it "returns not found when using incorrect ID" do
    jget send("#{model}_path", bad_id)
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
  let(:new_name) { FactoryGirl.attributes_for(model) }

  it "can update name" do
    # verify name is not yet the new name
    # expect(resource.name).to_not eq(new_name)
    jput send("#{model}_path",resource.id), new_name

    expect(response).to have_http_status :no_content

    # verify the changes propagate to the DB
    response_check if respond_to?(:response_check)
  end

  it "can be deleted" do
    jhead send("#{model}_path",resource.id)
    expect(response).to have_http_status :ok

    jdelete send("#{model}_path",resource.id)
    expect(response).to have_http_status :no_content

    jhead send("#{model}_path",resource.id)
    expect(response).to have_http_status :not_found
  end
end
