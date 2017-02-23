class CreateThings < ActiveRecord::Migration
  def change
    create_table :things do |t|
      t.string :name, null: false
      t.text :description
      t.text :notes

      t.timestamps null: false
    end
  end
end
