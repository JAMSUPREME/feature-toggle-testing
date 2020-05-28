class HelloController < ApplicationController

  def show

    # Slightly more elaborate scenario for more complicated situations
    # in which you might want to pull the logic out into providers of some sort
    hello_provider = nil
    if UNLEASH.is_enabled? "hello_restructure", @unleash_context 
      hello_provider = HelloV2Provider.new
    else
      hello_provider = HelloV1Provider.new
    end

    render :json => hello_provider.hello.to_json

    # Simple version with plain if/else and no abstractions
    # if UNLEASH.is_enabled? "hello_restructure", @unleash_context
    #   return render :json => ["hello", "hi", "hey"].to_json
    # end
    # render :json => {:hello => "to you!"}.to_json
  end

  def pretty
    render "pretty"
  end
end


class HelloV1Provider
  def hello
    return {:hello => "to you!"}
  end
end

class HelloV2Provider
  def hello
    return ["hello", "hi", "hey"]
  end
end

# If you wanted, a factory could be used on top of the Hello Providers
# class HelloFactory
# end