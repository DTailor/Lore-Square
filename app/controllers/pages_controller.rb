class PagesController < ApplicationController
  def index
  end
  def acm_json
    respond_to do |format|
      format.json { render :json => File.read(Rails.root.to_s + "/app/views/pages/flare.json") }
    end
  end

  def test
  end

  def acm
    respond_to do |format|
      format.json { render :json => File.read(Rails.root.to_s + "/app/views/pages/acm.json") }
    end
  end  
end
