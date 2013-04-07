class PagesController < ApplicationController

  def index

  end

  def test
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
