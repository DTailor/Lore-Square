class Square < ActiveRecord::Base
  attr_accessible :name,:parent_id
  has_many :checkins
  has_many :users, :through => :checkins


  def children
		Square.where(:parent_id => id )
  end

  # ========================================
  # 
  def to_node
   hash =  { "value" => 1, "id" => self.id, "name" => self.name }
    unless children.empty?
    	hash["children"] = self.children.map { |c| c.to_node }
		end
		hash
  end

	def one_to_json
		JSON.parse(self.to_node.to_json)
	end

  def self.all_to_json
    array = Square.where(:parent_id => nil).map(&:one_to_json)
    {"name" => "ACMComputingClassificationSystem", "children" => array}.to_json
  end
	# ========================================
  def self.search_ids(string)
    all_squares = Square.all
    target = all_squares.select{|s| s.name == string}.first
    result = [target.id]
    parent_id = target.parent_id
    while(parent_id)
      current = all_squares.select{|s| s.id == parent_id}.first
      result << current.id
      parent_id = current.parent_id
    end
    result.reverse
  end

	def self.populate_data()
		str = File.read(Rails.root.to_s + "/app/helpers/data.json")
		hash = JSON(str)
		hash["children"].each{|child| populate_helper(nil, child) }
	end

	def self.populate_helper(p_id, node)
		s = Square.new
		s.name = node["name"]
		s.parent_id = p_id
		s.save
		children = node["children"]
		if children
			children.each{|child| populate_helper(s.id, child)}
		end
	end

	def descendents
    children.map do |child|
      [child] + child.descendents
    end.flatten
  end

end

