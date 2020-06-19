# Simple adapter on top of the unleash DB schema
# Useful for abstracting consistent ways to make your features
# See https://github.com/Unleash/unleash/blob/master/docs/database-schema.md for schema docs
class FeatureAdapter

  class << self
    def get_connection
      my_pool = ActiveRecord::Base.establish_connection(
        :adapter  => "postgresql",
        :host     => "localhost",
        :port => "15432",
        :username => "postgres",
        :password => "unleash",
        :database => "postgres"
      )
      
      my_pool.connection
    end
  
    def get_features
      # Using raw psql result (rails abstraction is preferred):
      # get_connection.execute("SELECT * FROM features;").values
      db_result = get_connection.exec_query("SELECT * FROM features;")
      
      db_result.rows
    end

    # Example:
    # FeatureAdapter.insert_new_feature(name: "ft_something_2", description: "something")
    def insert_new_feature(name:, description:, enabled: false, strategies: nil)
      strat = strategies.nil? ? "[{\"name\":\"default\"}]" : strategy
      bindings = [
        [nil, name],
        [nil, description],
        [nil, enabled ? 1 : 0],
        [nil, strat]
      ]
      get_connection.exec_query("INSERT INTO features (name, description, enabled, strategies) VALUES ($1,$2,$3,$4);", "SQL", bindings, prepare: true)
    end

    def delete_feature(name:)
      # NOTE: need to see if the variant has last_updated info
      get_connection.exec_query("SELECT * FROM features WHERE name='#{name}';")
    end
  end
end