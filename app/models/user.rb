class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, :remember_me
  has_many :checkins
  has_many :squares, :through => :checkins

  def check_in(square)
    self.squares.push(square) if self.can_check_in?(square)
  end

  def check_out(square)
    self.squares.delete(square)
  end

  def can_check_in?(square)
    return false if self.squares.include? square
    children = square.children
    checkins = self.squares
    unless children.empty?
      children.each do |child|
        return false unless checkins.include? child
      end
    end
    return true
  end

end
