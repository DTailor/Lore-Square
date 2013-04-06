class CreateCheckins < ActiveRecord::Migration
  def change
    create_table :checkins do |t|

      t.timestamps
    end
  end
end
