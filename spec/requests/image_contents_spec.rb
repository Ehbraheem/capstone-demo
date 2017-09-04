require 'rails_helper'

RSpec.describe "ImageContents", type: :request do
	include_context "db_cleanup"
	let!(:user) { login signup(FactoryGirl.attributes_for(:user)) }
	let(:image_props) { FactoryGirl.attributes_for(:image) }

	context "lifecycle" do
		include_context "db_clean_after"
		it "generates sizes from original" do
			pp except_content image_props
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
			id = parsed_body["id"]
			expect(Image.where(id: id)).to exist
			expect(ImageContent.where(image_id: id)).to exist

			jdelete images_url(id)
			expect(response).to have_http_status :no_content

			expect(Image.where(id: id)).to_not exist
			expect(ImageContent.where(image_id: id)).to_not exist

			get image_content_path(id)
			expect(response).to have_http_status :not_found
		end
	end

	context "image responses" do
		before(:each) do
			@image = Image.all.first
			unless @image
				jpost images_url, image_props
				expect(response).to have_http_status :created
				@image = Image.find(parsed_body["id"])
			end
		end
		after(:each) do |test|
			if !test.exception
				expect(response).to have_http_status :ok
				ic = ImageContent.image(@image).smallest.first
				expect(response.body.size).to eq ic.content.data.size
			end
		end

		it "supplies content_url in show response" do
			jget image_url(@image)
			expect(response).to have_http_status :ok
			payload = parsed_body
			expect(payload).to include "content_url"

			jget payload["content_url"]
		end

		it "supplies content_url in index response" do
			jget images_url
			expect(response).to have_http_status :ok
			payload = parsed_body
			expect(payload.length).to be > 0
			expect(payload[0]).to include "content_url"

			jget payload[0]["content_url"]
		end

		it "supplies content_url in thing image response" do
			thing = FactoryGirl.create(:thing)
			thing.thing_images.create(creator_id: user["id"], image: @image)

			jget thing_thing_images_url(thing)
			expect(response).to have_http_status :ok
			payload = parsed_body
			expect(payload.length).to eq 1
			expect(payload[0]).to include "image_content_url"

			jget payload[0]["image_content_url"]
		end
	end

end

shared_examples "image requires parameter" do |parameter|
	it "image requires content" do
		start_count = Image.count
		image_props[:image_content].delete(parameter)
		jpost images_url, image_props
		expect(response).to have_http_status :bad_request
	end
end