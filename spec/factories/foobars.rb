FactoryGirl.define do

  # FOO factories
  factory :foo_fixed, class: 'Foo' do
    name "test"
  end

  factory :foo_sequence, class: 'Foo' do
    sequence(:name) { |n| "test#{n}" }
  end

  factory :foo_names, class: 'Foo' do
    sequence(:name) { |n| %w{ larry moe curly }[n%3] }
  end

  factory :foo_transient, class: 'Foo' do
    name 'test'
    transient do
      male true
    end

    after(:build) do |object, props|
      object.name = props.male ? "Mr Test" : "Ms Test"
    end
  end

  factory :foo_ctor, class: 'Foo' do
    transient do
      hash {}
    end
    initialize_with { Foo.new(hash)}
  end

  # random name from faker gem
  factory :foo_faker, class: 'Foo' do
    name { Faker::Name.name }
  end

  factory :foo, :parent => :foo_faker do
  end

  # BAR factories
  factory :bar_fixed, :class => Bar do
    name "test"
  end

  factory :bar_sequence, :class => Bar do
    sequence(:name) { |n| "test#{n}"}
  end

  factory :bar_names, :class => Bar do
    sequence(:name) { |n| %w( Ojo Badira Segun Hassan )[n%4] }
  end

  factory :bar_transient, :class => Bar do
    name "test"

    trasient do
      male true
    end

    after(:build) do |object, props|
      object.name = props.male ? "Mr Test" : "Ms Test"
    end

  end

  factory :bar_ctor, :class => Bar do

    transient do
      hash {}
    end
    initialize_with { Bar.new hash}
  end

  factory :bar_faker, :class => Bar do
    name { Faker::Team.name.titleize }
  end

  factory :bar, :parent => :bar_faker do
  end
end
