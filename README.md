# Hakilebara.github.io

My personal blog and microblog. All the content is created in a private Notion DB and synced using Github Action.

Shoutout to [notion-to-md](https://github.com/souvikinator/notion-to-md) for their great library. 

## Run locally

```bash
rbenv install 3.4.1
rbenv local 3.4.1
bundle config set path 'vendor/bundle'
bundle install
bundle exec jekyll serve --open-url --livereload
```


