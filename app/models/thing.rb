class Thing < ActiveRecord::Base
  validates :name, presence: true
  # validates_presence_of :name
end
