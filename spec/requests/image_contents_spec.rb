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

	context "validation" do
		include_context "db_clean_after"
		it_behaves_like "image requires parameter", :content
		it_behaves_like "image requires parameter", :content_type

		it "image requires valid content" do
			start_count = Image.count
			image_props[:image_content][:content] = "blah blah blah"
			jpost images_url, image_props
			expect(response).to have_http_status :unprocessable_entity
			expect(Image.count).to eq start_count

			payload = parsed_body
			expect(payload).to include "errors"
			expect(payload["errors"]).to include "full_messages"
			expect(payload["errors"]["full_messages"]).to include "unable to create image contents", "no start of image marker found"
		end

		it "image requires supported content_type" do
			start_count = Image.count
			image_props[:image_content][:content_type] = "image/blah"
			jpost images_url, image_props
			expect(response).to have_http_status :unprocessable_entity
			expect(Image.count).to start_count

			payload = parsed_body
			expect(payload).to include "errors"
			expect(payload["errors"]).to include "full_messages"
			expect(payload["errors"]["full_messages"]).to include "unable to create image contents"

			expect(payload["errors"]).to_not include "width"
			expect(payload["errors"]).to_not include "height"
			expect(payload["errors"]).to include "content_type"
			expect(payload["errors"]["content_type"]).to include /not supported type/
		end

		it "rejects image too large" do
			content = ""
			decoded_pad = Base64.decode64 image_props[:image_content][:content]
			begin
				content += decoded_pad
			end while content.size < ImageContent::MAX_CONTENT_SIZE
			image_props[:image_content][:content] = Base64.encode64 content

			jpost images_url, image_props
			expect(response).to have_http_status :unprocessable_entity
			payload = parsed_body
			expect(payload["errors"]).to include "content"
			expect(payload["errors"]["content"]).to include /too large/
		end
	end

	context "content queries" do
		let(:image_content) { ImageContent.image(@image) }
		before(:each) do
			unless @image
				jpost images_url, image_props
				expect(response).to have_http_status :created
				@image = Image.find(parsed_body["id"])
			end
		end

		it "provides size equal to width only" do
			ics = image_content.order(:width.asc)
			get image_content_url @image, { width: ics[2].width}
			expect(response).to have_http_status :ok
			expect(response.body.size).to eq ics[2].content.data.size
		end

		it "provides smallest size GTE width only" do
      ics=image_content.order(:width.asc)
      get image_content_url(@image, {width:ics[2].width+1})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[3].content.data.size)
    end

    it "provides size equal to height only" do
      ics=image_content.order(:height.asc)
      get image_content_url(@image, {height:ics[3].height})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[3].content.data.size)
    end

    it "provides smallest size GTE height only" do
      ics=image_content.order(:height.asc)
      get image_content_url(@image, {height:ics[3].height+1})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[4].content.data.size)
    end

    it "provides size equal to width and height" do
      ics=image_content.order(:height.asc)
      get image_content_url(@image, {width:ics[2].width, height:ics[3].height})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[3].content.data.size)
    end

    it "provides smallest size GTE width and height" do
      ics=image_content.order(:height.asc)
      get image_content_url(@image, {width:ics[4].width, height:ics[2].height})
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics[4].content.data.size)
    end

    it "provides largest size " do
      ics=image_content.order(:height.desc)
      get image_content_url(@image)
      expect(response).to have_http_status(:ok)
      expect(response.body.size).to eq(ics.first.content.data.size)
    end
	end
end

shared_examples "image requires parameter" do |parameter|
	it "image requires content" do
		start_count = Image.count
		image_props[:image_content].delete(parameter)
		jpost images_url, image_props
		expect(response).to have_http_status :bad_request
		expect(Image.count).to eq(start_count) #image is not saved

    payload=parsed_body
    expect(payload).to include("errors")
    expect(payload["errors"]).to include("full_messages")
    expect(payload["errors"]["full_messages"][0]).to include("param is missing", parameter.to_s)
	end
end