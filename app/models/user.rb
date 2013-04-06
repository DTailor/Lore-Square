class User < ActiveRecord::Base

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable,
         :omniauth_providers => [:facebook]

  attr_accessible :email, :password, :password_confirmation,
                  :remember_me, :provider, :uid

  def self.find_for_facebook_oauth(auth, signed_in_resource=nil)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      user = User.create(
                         provider:auth.provider,
                         uid:auth.uid,
                         email:auth.info.email,
                         password:Devise.friendly_token[0,20]
                         )
    end
    user
  end

  def self.new_with_session(params, session)
    fb_data = "devise.facebook_data"
    super.tap do |user|
      if data = session[fb_data] && session[fb_data]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end                  
end
