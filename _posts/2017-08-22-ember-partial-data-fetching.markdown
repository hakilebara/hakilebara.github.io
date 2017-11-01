---
title: Loading Partial Models with Emberjs
date: 2017-08-22 11:04:44 Z
categories:
- emberjs
- ember-data
- jsonapi
layout: post
---

Problem: How can I fetch an index of shallow models and flesh them out when needed?

Example: you have an index of stories to display but you don't want to fetch all the stories' content on the index route.

If your backend api is following the [json:api][json-api] spec. You can use [Sparse Fieldsets][sparse-fieldsets].

Given the following routes:
{% highlight javascript %}
// app/router.js
Router.map(function() {
  this.route('stories', function() {
    this.route('story', { path: ':story_id' });
  });
});
{% endhighlight %}

This should only fetch the attributes you need to display your index of stories.
{% highlight javascript %}
// app/routes/stories/index.js
model() {
  return this.store.query('story', { fields: { story: 'title' } });
}
{% endhighlight %}

Then on the individual story route (e.g `/stories/1`), you can use setupController to flesh out your model with extra data.
{% highlight javascript %}
// app/routes/stories/story.js
setupController(controller, model) {
  /** this._super(controller, model); **/
  if(!model.get('content')) { // if the model is not fully fleshed-out
    let fullModel = this.findRecord('story', model.id);
    controller.set('model', fullModel);
  }
}
{% endhighlight %}

The model hooks blocks the UI, however the subsequent fetch in setupController will not.
This means that if you launch the app at /stories and that navigate to /stories/1 you might see that
the stories' content is missing for a few seconds.

This is actually wanted. We render a part of the UI and then wait for the rest of the UI to load.
This is a good place to put a content placeholder while the stories content
is being fetched. This is would be a good use case for ember-concurrency.

[json-api]: http://jsonapi.org
[sparse-fieldsets]: http://jsonapi.org/format/#fetching-sparse-fieldsets
