require 'rails_helper'

RSpec.describe "ImageContents", type: :request do
	include_context "db_cleanup"
	let!(:user) { login signup(FactoryGirl.attributes_for(:user)) }
	let(:image_props) { FactoryGirl.attributes_for(:image) }

	context "lifecycle" do
		include_context "db_clean_after"
		it "generates sizes from original" do
			pp except_original image_props
			jpost images_url, image_props
			pp parsed_body
			expect(response).to have_http_status :created
			image  = Image.find(parsed_body["id"])
			expect(ImageContent.image(image).count).to eq 5
		end

		it "provides ImageContent upon request" do
			jpost images_url, image_props
			expect(response).to have_http_status :created
			image  = Image.find(parsed_body["id"])

			get image_content_path(image.id) # no need for credentials
			expect(response).to have_http_status :ok
			pp response.header
			expect(response.header["content-transfer-encoding"]).to eq "binary"
			expect(response.header["content-type"]).to eq "image/jpg"
			expect(response.header["content-disposition"]).to include "inline"
			expect(response.header["content-disposition"]).to include "filename"

			expect(default=ImageContent.image(image).smallest.first).to_not be_nil
			expect(response.body.size).to eq default.content.data.size
		end

		it "deletes ImageContent with image" do
			jpost images_url, image_props
			expect(response).to have_http_status :created
		end
	end
end