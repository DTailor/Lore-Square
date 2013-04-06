class SquaresController < ApplicationController
	
	def index
		@squares = Square.all
		@names = @squares.map{|s| s.name}
	end

  def search
    result_array = Square.search_ids(params[:square])
    render :json => result_array, :layout => false
  end
end
