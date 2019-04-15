---
title: Creating A Codemod
date: {}
categories:
  - javascript
layout: post
published: true
---

# How I created my first codemod

## What is a codemod?

A codemod is a tool that allows large scale refactoring on a codebase. Codemods are intented to change your source code. They are an alternative to `sed` and `awk` scripts.

## Why create a codemod?

Sometimes your source code requires large, repetitive changes. For example, let's say you need to change this:

```javascript
var name = "Chris";

var greeting = "Hello " + name + "!";
```

into this

```javascript
var name = "Chris";

var greeting = `Hello ${name}!`;
```

You might be able to this with a search and replace regular expression. You could also do these changes manually. However these approaches are error-prone and/or time-consuming.

On the other hand, codemods are code refactoring tools. They transform source code into AST (Abstract Syntax Tree) which is a json based tree representation of the code. It other words it transforms your javascript source into a large mutable object. You can see an example [here](https://astexplorer.net/#/gist/229bd40cce520df1ed420a4e634f399d/ff994dc0fa424cfcb7b18e2f8942e9f6b4d339b3).

## A 

This blog post will 
We are going to use `codemod-cli`, a tool created by Robert Jackson. This tool will generate a jscodeshift project.

```bash
npm install --global codemod-cli

# OR

yarn global add codemod-cli
```
