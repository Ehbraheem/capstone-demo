FactoryGirl.define do
  factory :thing do
    name         { Faker::Commerce.product_name }
    sequence(:description) { |n| n%5 === 0 ? nil : Faker::Lorem.paragraphs.join }
    sequence(:notes) { |n| n%5 < 2 === 0 ? nil :  Faker::Lorem.paragraphs.join }

    trait :with_description do
      description { Faker::Lorem.paragraphs.join }
    end

    trait :with_notes do
      notes  { Faker::Lorem.paragraphs.join }
    end

    trait :with_fields do
      :with_notes
      :with_description
    end
  end
end
