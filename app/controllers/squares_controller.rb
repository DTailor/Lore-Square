class SquaresController < ApplicationController
	
	def index
		@squares = Square.all
		@names = @squares.map{|s| s.name}
	end

  def search
    puts params
    result_array = Square.search_ids(params[:square])
    # p result_array
    # respond_to do |format|
    render :json => result_array, :layout => false
    # result_array = Square.search_ids(params[:search][:])
    # end
  end
end
