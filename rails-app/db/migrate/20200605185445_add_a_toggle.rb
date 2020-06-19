class AddAToggle < ActiveRecord::Migration[6.0]
  def up
    FeatureAdapter.insert_new_feature(name: "ft_something_2", description: "something")
  end

  def down
    FeatureAdapter.delete_feature(name: "ft_something_2")
  end
end