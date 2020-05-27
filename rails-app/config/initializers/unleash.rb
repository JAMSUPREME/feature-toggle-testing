Unleash.configure do |config|
  config.url         = 'http://localhost:4242/api'
  config.app_name    = 'my_rails_app'
  config.refresh_interval = 1
end

UNLEASH = Unleash::Client.new