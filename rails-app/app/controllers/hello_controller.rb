class HelloController < ApplicationController

  def show

    if UNLEASH.is_enabled? "hello_restructure", @unleash_context
      return render :json => ["hello", "hi", "hey"].to_json
    end

    render :json => {:hello => "to you!"}.to_json
  end

  def pretty
    render "pretty"
  end
end