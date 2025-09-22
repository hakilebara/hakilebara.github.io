---
title: "Using Notion and Github Pages as a free publishing platform"
id: "178a97bc-458a-80a1-ba86-ff519674cee8"
layout: post
date: "2025-01-11T18:47:00.000Z"
---

For a long time I have been looking for a personal publishing platform that I enjoy using. I strongly believe that a friction-less writing experience is key to help me write more. 


The best online text editor I have used so far is Notion.


I have experience using [GitHub Pages built-in support for Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll). It is free and relatively easy to use.


Therefore my personal publishing platform will use Notion as an online text editor and GitHub/Jekyll as a publishing platform.


I struggle writing long form articles. Thus I am going to focus on getting comfortable writing very short form texts or micro-posts.


## How does my personal publication platform work


In Notion, I created two private databases. One for blog articles, the other for micro-blog posts.

In each DB, I use a Kanban view and group each post by Status : `Idea` → `Draft` → `Deploy` → `Published` 


![Default caption](/assets/img/276a97bc-458a-80b8-8d19-dbd4a698ce81.png)


![Default caption](/assets/img/276a97bc-458a-8036-8372-c08bd9f5f6d3.png)


When I move a post to `Deploy`, it means that it is ready to be published. I can now run a GitHub Action workflow to :

- pull the post from Notion using Notion’s API
- convert the Notion API JSON response into a markdown file using [https://github.com/souvikinator/notion-to-md](https://github.com/souvikinator/notion-to-md)
- commit the file to GitHub
- Publish the updated website to GitHub Pages

## Challenge: Notion temporary S3 links


The [Notion API documentation](https://developers.notion.com/reference/file-object#notion-hosted-files-type-file) states that:

> Each time you fetch a Notion-hosted file, it includes a temporary public url valid for 1 hour.

This means I cannot reasonably use the S3 link the Notion provides to display images.


I worked around this limitation by downloading images images from S3 to GitHub using notion-to-md [as follow](https://github.com/hakilebara/hakilebara.github.io/blob/2c1f24b7dfcbb27b37f5d5fef58c2e7833b75af7/sync_notion.js#L12-L45).


And that’s it 🙂


So far, I am fairly happy with this publication system. Its source code is available [here](github.com/hakilebara/hakilebara.github.io/).

