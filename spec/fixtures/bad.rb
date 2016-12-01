def example
  payload = {
    :meta => {
      :envelope => {
        :token => session.token,
      }
    }
  }
end

fruit = ["mango", "apple", "orange"]

fruit.each end |e|
  puts e
end
