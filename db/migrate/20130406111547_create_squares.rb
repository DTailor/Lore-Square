class CreateSquares < ActiveRecord::Migration
  def self.up
    create_table :squares do |t|
      t.string :name, :null => false
      t.integer :parent_id

      t.timestamps
    end
  end
 
  def self.down
    drop_table :squares
  end
end
