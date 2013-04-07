class PagesController < ApplicationController
  def test
  end

  def acm
    respond_to do |format|
      format.json { render :json => Square.all_to_json }
    end
  end  
end
