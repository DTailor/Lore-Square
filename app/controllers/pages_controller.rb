class PagesController < ApplicationController

  def test
    @squares = Square.all
    @names = @squares.map{|s| s.name}
  end

  def index
    @squares = Square.all
    @names = @squares.map{|s| s.name}
  end

  def acm
    respond_to do |format|
      format.json { render :json => File.read(Rails.root.to_s + "/app/views/pages/acm.json") }
    end
  end

  def acm_new
    respond_to do |format|
      format.json { render :json => File.read(Rails.root.to_s + "/app/views/pages/acm_new.json") }
    end
  end    

  def acm_value
    respond_to do |format|
      format.json { render :json => File.read(Rails.root.to_s + "/app/views/pages/acm_value.json") }
    end
  end   
end
