# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

squares = Square.create(
  [
    {name: 'first',  parent_id: 0},
    {name: 'second', parent_id: 1},
    {name: 'third',  parent_id: 1},
    {name: 'fourth', parent_id: 2},
    {name: 'fifth',  parent_id: 2},
    {name: 'sixth',  parent_id: 3},
    {name: 'seventh', parent_id: 3}
  ])