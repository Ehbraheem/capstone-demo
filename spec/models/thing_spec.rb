require 'rails_helper'

RSpec.describe Thing, type: :model do

  include_context "db_cleanup"

  context "build valid thing" do

    it "default thing created with random description and notes" do
      thing = FactoryGirl.build(:thing)
      expect(thing).to be_an_instance_of Thing
      expect(thing.name).to_not be_nil
      expect(thing.save).to be true
    end

    it "create thing with non-nil description" do
      thing = FactoryGirl.build(:thing, :with_description)
      expect(thing).to be_an_instance_of Thing
      expect(thing.description).to_not be nil
      expect(thing.save).to be true
    end

    it "create thing with non-nil notes" do
      thing = FactoryGirl.build(:thing, :with_notes)
      expect(thing).to be_an_instance_of Thing
      expect(thing.notes).to_not be nil
      expect(thing.save).to be true
    end

    it "create thing with explicit nil-description" do
      thing = FactoryGirl.build(:thing, description: nil)
      expect(thing).to be_an_instance_of Thing
      expect(thing.description).to be nil
      expect(thing.save).to be true
    end
    it "create thing with explicit nil-notes" do
      thing = FactoryGirl.build(:thing, notes: nil)
      expect(thing).to be_an_instance_of Thing
      expect(thing.notes).to be nil
      expect(thing.save).to be true
    end
    it "cannot create thing without name field" do
      thing = FactoryGirl.build(:thing, name: nil)
      # byebug
      expect(thing).to be_an_instance_of Thing
      expect(thing).to respond_to :errors
      expect(thing.name).to be nil
      expect(thing.save).to be false
    end
  end

  context "build invalid thing" do

    let(:thing) { FactoryGirl.build(:thing, :name=>nil)}

    it "provides error messages" do
      expect(thing.validate).to be false
      expect(thing.errors.messages).to include(:name=>["can't be blank"])
    end
  end

end
