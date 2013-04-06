class Square < ActiveRecord::Base
  attr_accessible :name,:parent_id


  def children
		Square.where(:parent_id => id )
  end

  # ========================================
  # 
  def to_node
   hash =  { "name" => self.name }
    unless children.empty?
    	hash["children"] = self.children.map { |c| c.to_node }
		end
		hash
  end

	def to_json
		self.to_node.to_json
	end

	# ========================================

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
	

end

