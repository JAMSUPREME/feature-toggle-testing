require 'test_helper'

class HelloTest < ActionDispatch::IntegrationTest

  # Make sure UNLEASH is always unstubbed
  teardown do
    UNLEASH.unstub(:is_enabled?)
  end

  test "can get a 200 OK" do
    get "/"
    assert_response :success
    
    data = JSON.parse(@response.body)
    assert data.key?("hello")
    assert_equal data["hello"], "to you!"
    # Verifying types is a good idea if you're changing types
    assert data.is_a?(Hash)
  end

  test "can get a 200 OK with hello_restructure" do
    # We don't care about the specifics of the unleash context, so match the toggle name and anything
    UNLEASH.expects(:is_enabled?).with("hello_restructure", anything).returns(true)

    get "/"
    assert_response :success
    
    data = JSON.parse(@response.body)
    assert data.is_a?(Array)
    assert_equal data[0], "hello"
  end
end
