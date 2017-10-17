---
layout: post
title:  "TIL how to change Phoenix development server port"
type: til
date:   2017-08-29 10:04:44 +0200
categories: til elixir phoenix
published: true
---


You can run your Phoenix dev server on a different port that tcp/4000.

{% highlight elixir %}
# myapp/config/dev.exs
config :my_app, MyApp.Endpoint,
  http: [port: System.get_env("PORT") || 4000],
{% endhighlight %}
Phoenix will use the ENV variable "PORT" if it exists. Otherwise it will fallback to tcp/4000.
Then from the terminal

{% highlight bash %}
$ PORT=4003 mix phx.server
{% endhighlight %}
or
{% highlight bash %}
$ PORT=4003 iex -S mix phx.server
{% endhighlight %}

[reference: Chris McCord's answer on github](https://github.com/phoenixframework/phoenix/issues/962#issuecomment-111635557)

**Tested on** <br>
*elixir 1.4.4* <br>
*phoenix 1.3.0* <br>
*macOS Sierra 10.12.6* <br>
