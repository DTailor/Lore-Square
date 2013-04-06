class SquaresController < ApplicationController
	
	def index
		@squares = Square.all
		@names = @squares.map{|s| s.name}
	end
end
