require 'test_helper'

class HelloTest < ActionDispatch::IntegrationTest

  # Make sure all toggles are OFF by default, and do not accidentally hit the server during tests
  setup do
    UNLEASH.stubs(:is_enabled?).returns(false)
  end

  # Make sure UNLEASH is always unstubbed
  teardown do
    UNLEASH.unstub(:is_enabled?)
  end

  test "can get a 200 OK" do
    # It's usually a good idea to explicitly stub your toggles in the "normal path",
    # but if you have a lot of toggles, that can lead to modifying a lot of existing tests,
    # so omitting it is also acceptable
    # UNLEASH.expects(:is_enabled?).with("hello_restructure", anything).returns(false)

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
    assert_equal "hello", data[0]
  end
end
