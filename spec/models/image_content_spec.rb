require 'rails_helper'
require_relative '../support/image_content_helper'

Mongo::Logger.logger.level = ::Logger::DEBUG

RSpec.describe ImageContent, type: :model do
  include_context "db_cleanup"
  include ImageContentHelper

  let(:fin) { image_file }

  context "BSON::Binary" do
  	it "demonstrates BSON::Binary" do
  		binary = BSON::Binary.new fin.read
  		expect(binary.data.size).to eq fin.size

  		fout = File.open("tmp/out.jpg", "wb")
  		fout.write(binary.data)
  		expect(fout.size).to eq fin.size
  		fout.close
  	end

  	context "using helper" do
  		it "derives BSON::Binary from file" do
  			binary = ImageContent.to_binary fin
  			expect(binary.class).to be BSON::Binary
  			expect(binary.data.size).to eq fin.size
  		end
  		it "derives BSON::Binary from StringIO" do
  			strio = StringIO.new fin.read
  			binary = ImageContent.to_binary strio
  			expect(binary.class).to be BSON::Binary
  			expect(binary.data.size).to eq fin.size
  		end
  		it "derives BSON::Binary from BSON::Binary" do
  			binary = BSON::Binary.new fin.read
  			binary = ImageContent.to_binary(binary)
  			expect(binary.class).to be BSON::Binary
  			expect(binary.data.size).to eq fin.size
  		end
  		it "derives BSON::Binary from base64 encoded String" do
  			content = BSON::Binary.new fin.read
  			b64 = Base64.encode64 content.data
  			binary = ImageContent.to_binary b64 
  			expect(binary.class).to be BSON::Binary
  			expect(binary.data.size).to eq fin.size
  		end
  	end
  end

  context "assign content" do
  	it "sets content" do
  		strio = StringIO.new fin.read
  		ic = ImageContent.new
  		ic.content = strio
  		expect(ic.content.class).to be BSON::Binary
  		expect(ic.content.data.size).to eq fin.size
  	end
  	it "mass-assigns content" do
  		strio = StringIO.new fin.read
  		ic = ImageContent.new content: strio
  		expect(ic.content.class).to be BSON::Binary
  		expect(ic.content.data.size).to eq fin.size
  	end
  end

  context "set size from JPEG" do
  	let(:ic) { ImageContent.new content_type: "image/jpg", content: fin }

  	it "reads EXIF from JPEG" do
  		expect(exif=ic.exif).to_not be_nil
  		expect(exif.width).to_not be_nil
  		expect(exif.height).to_not be_nil
  	end
  	it "sets size from EXIF" do
  		expect(ic.width).to eq ic.exif.width
  		expect(ic.height).to eq ic.exif.height
  	end
  	it "sets size manually" do
  		width=666; height=444
  		ic = ImageContent.new(
  			width: width,
  			height: height,
  			content_type: "image/png",
  			content: fin)
  		expect(ic.width).to eq width
  		expect(ic.height).to eq height
  	end
  end

  context "valid image content" do
  	let(:ic) { ImageContent.new content_type: "image/jpg", content: fin, image_id: 1 }

  	before(:each) do
  		expect(ic.validate).to be true
  		expect(ic.errors.messages).to be_empty
  	end

  	it "requires image" do
  		ic.image_id = nil
  		expect(ic.validate).to be false
  		expect(ic.errors.messages).to include :image_id
  	end
  	it "requires content_type" do
  		validation_check ic, :content_type
  	end
  	it "requires content" do
  		validation_check ic, :content
  	end
  	it "requires width" do
  		validation_check ic, :width
  	end
  	it "requires height" do
  		validation_check ic, :height
  	end
  	it "requires supported content_type" do
  		ic.content_type = "image/png"
  		ic.content = ic.content
  		expect(ic.validate).to be false
  		expect(ic.errors.messages).to include :content_type
  		expect(ic.errors.messages[:content_type]).to include /png/
  	end
  	it "checks content size maximum" do
  		content = ""
  		decoded_pad = ic.content.data
  		begin
  			content += decoded_pad
  		end while content.size < ImageContent::MAX_CONTENT_SIZE
  		ic.content = Base64.encode64 content
  		
  		expect(ic.validate).to be false
  		expect(ic.errors.messages).to include :content
  	end
  end

  context "image content factory" do
  	
  end
end
