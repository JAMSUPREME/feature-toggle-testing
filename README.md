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
- "Enabled" by default
- No API in the client for creating toggles (you could probably build a wrapper or write SQL)

# 