class User < ActiveRecord::Base

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable,
         :omniauth_providers => [:facebook]

  attr_accessible :email, :password, :password_confirmation,
                  :remember_me, :provider, :uid, :avatar, :name

  has_attached_file :avatar, :styles => { :medium => "300x300>", :thumb => "100x100>" },
                    :default_url => "/images/:style/missing.png"

  has_many :checkins
  has_many :squares, :through => :checkins

  RANKS = { (0..2)           => 'Private',
            (3..4)          => 'Corporal',
            (5..6)          => 'Sergeant',
            (7..8)          => 'Lieutenant',
            (9..10)         => 'Captain',
            (11..11)        => 'Major',
            (12..13)        => 'Colonel',
            (14..+1.0/0.0)   => 'General'
          }

  def self.find_for_facebook_oauth(auth, signed_in_resource=nil)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      user = User.create(
                         provider:auth.provider,
                         uid:auth.uid,
                         name:auth.info.name,
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

  def check_in(square)
    if self.can_check_in?(square)
       self.squares.push(square)
       return true
    else 
      return false
    end 
  end

  def check_out(square)
    self.squares.delete(square)
  end

  def rank
    RANKS.each do |k, v|
      return v if k.include?(self.squares.count)
    end

    nil
  end

  def can_check_in?(square)
    return false if self.squares.include? square
    # children = square.children
    # checkins = self.squares
    # unless children.empty?
    #   children.each do |child|
    #     return false unless checkins.include? child
    #   end
    # end
    return true
  end

  def progress_for square
    # total = square.children
    # checked_in = total.select { |s| self.squares.include? s }
    # checked_in.size / total.size * 100
  end

end
