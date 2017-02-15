require 'rails_helper'

describe Foo, type: :model do

  # add db cleanup
  include_context "db_cleanup"#, :transaction
  include_context 'db_scope'
  # %w( db_cleanup db_scope).each { |action| include_context action}

  before(:each) do
    @foo = Foo.create(:name=> "test")
  end
  let(:foo) { Foo.find(@foo.id) }
  context "created Foo (let)" do

		it { expect(foo).to be_persisted }

		it { expect(foo.name).to eq("test") }

		it { expect(Foo.find(foo.id)).to_not be_nil }

  end

	context "created Foo (subject)" do

		subject { @foo }

		it { is_expected.to be_persisted }

		it { expect(subject.name).to eq("test") }

		it { expect(Foo.find(subject.id)).to_not be_nil }

  end

  # context "created Foo (lazy)" do
  #   let!(:before_count) { Foo.count } # eager instatiation
  #
  #   it { expect(foo).to be_persisted }
  #
  #   it { expect(foo.name).to eq("test") }
  #
  #   it { expect(Foo.find(foo.id)).to_not be_nil }
  #
  #   it { foo; expect(Foo.count).to eq(before_count + 1) } # called the function created by let to insert record in DB
  #
  # end


	# context "valid foo" do
	# 	it "has a name" do
	# 		foo = Foo.create(:name=> "test")
	# 		expect(foo).to be_valid
	# 		expect(foo.name).to_not be_nil
	# 	end
	# end
end
