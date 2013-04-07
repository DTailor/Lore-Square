LoreSquare::Application.routes.draw do
  devise_for :users, :controllers => { 
    :sessions => "users/sessions", 
    :registrations => "users/registrations",
    :omniauth_callbacks => "users/omniauth_callbacks"
  }

  devise_scope :user do
    match '/users/sign_out' => 'devise/sessions#destroy'
  end

  namespace :squares do
    get 'index' => :index
    post 'search' => :search
    post 'checkin' => :checkin
  end

  namespace :pages do
    get 'test' => :test
    get 'acm' => :acm
    get 'acm_new' => :acm_new
    get 'acm_value' => :acm_value
    get 'index' => :index
  end

  root :to => "squares#index"

end
