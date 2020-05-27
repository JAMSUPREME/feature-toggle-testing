class ApplicationController < ActionController::Base
  before_action :set_unleash_context

  private

  def set_unleash_context
    @unleash_context = Unleash::Context.new(
      session_id: session.id,
      remote_address: request.remote_ip,
      user_id: session[:user_id]
    )
  end
  
end
