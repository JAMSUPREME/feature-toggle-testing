# Overview

Basic examples of apps with feature toggles

# Startup

I recommend opening up two shells, one for your ruby app and the other for your unleash resources.
```
# Shell 1
# cd ~/Github/toggle-stuff/rails-app
ruby s
```

```
# Shell 2
# cd ~/Github/toggle-stuff/unleash-docker
docker-compose up
```

# Opinions about unleash

- No out-of-the-box scheduling support
- "Enabled" by default (when creating in UI, though you can disable)
- No API in the client for creating toggles (you could probably build a wrapper or write SQL)

# Testing

We'll do a pretty basic setup where each scenario gets its own block. There are different ways to organize your tests depending on how you're changing the code, but usually adding another scenario in the existing scope is OK.

In Ruby, I recommend using `Mocha` for mocking/stubbing because I find it to be the easiest to read.