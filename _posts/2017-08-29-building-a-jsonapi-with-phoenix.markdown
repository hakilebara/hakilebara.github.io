---
layout: post
title: Building a jsonapi.org API with Phoenix 1.3
date: '2017-08-29 10:02:44 +0200'
categories: elixir phoenix jsonapi
published: false
---

In this post I will document my experience of building a barebones API using Phoenix 1.3. The API will follow the [jsonapi.org](jsonapi.org) specification.

## setting up a pure api project with Phoenix


```mix phx.new myapp --no-html --no-brunch --database=mysql```

I am using MySQL here because I am familiar with it. If you don't specify a '--database' option, Phoenix will expect a PostgreSQL database by default.

![Imgur](http://i.imgur.com/QZZ7AKo.png)

```bash
cd myapp
mix ecto.create
iex -S mix phoenix.server
```

`mix ecto create` will create database a database called `myapp_dev`. 

## installing dependencies

To emit json-api payloads I will be using the [vt-elixir/ja_serializer](https://github.com/vt-elixir/ja_serializer) library.
As of today there are only two Elixir server libraries that implements the json-api spec. I chose ja_serializer because it looks more popular and better documented than [jeregrine/jsonapi](https://github.com/jeregrine/jsonapi).

```elixir
# myapp/mix.exs

defp deps do
  [
    # ...
      {:ja_serializer, "~> 0.12.0"},
    # ...
  ]
end
```
Replace `0.12.0` with the latest version of the library.

`mix deps.get`

## configuration

You need to tell Phoenix how to handle the "application/vnd.api+json" mime type.

```elixir
# myapp/config/config.exs

config :phoenix, :format_encoders,
  "json-api": Poison

config :mime, :types, %{
  "application/vnd.api+json" => ["json-api"]
}
```

```bash
mix deps.clean plug --build
mix deps.get
```


```elixir
# myapp/lib/myapp_web/router.ex

defmodule MyappWeb.Router do
  use MyappWeb, :router

  pipeline :api do
    plug :accepts, ["json-api"]
  end

  scope "/api", MyappWeb do
    pipe_through :api
  end
end
```


## generating resources

`mix phx.gen.json Assets Image images name:string url:string position:integer`

```elixir
# myapp/lib/myapp_web/router.ex

defmodule MyappWeb.Router do
  use MyappWeb, :router

  pipeline :api do
    plug :accepts, ["json-api"]
    plug JaSerializer.ContentTypeNegotiation
    plug JaSerializer.Deserializer
  end

  scope "/api", MyappWeb do
    pipe_through :api

    resources "/images", ImageController, except: [:new, :edit]
  end

end
```


`mix ecto.migrate`

## generating fake data


```elixir
# myapp/priv/repo/seeds.exs

alias Myapp.Repo
alias Myapp.Assets.Image

[
  %Image{
    name: "image 1",
    url: "",
    position: 1,
  },
  %Image{
    name: "image 2",
    url: "",
    position: 2,
  },
  %Image{
    name: "image 3",
    url: "",
    position: 3,
  },
  %Image{
    name: "image 4",
    url: "",
    position: 4,
  }
] |> Enum.each(&Repo.insert!(&1))
```

Notice the exclamation mark after `insert`, this means that the function will throw and error if something goes wrong.


`mix run priv/repo/seeds.exs`

## testing our API with curl

`curl -sH "Accept: application/vnd.api+json" http://localhost:4003/api/images | python -m json.tool`

Here we use a python one-liner to prettify the curl output.

```json
{
    "data": [
        {
            "id": 1,
            "name": "image 1",
            "position": 1,
            "url": ""
        },
        {
            "id": 2,
            "name": "image 2",
            "position": 2,
            "url": ""
        },
        {
            "id": 3,
            "name": "image 3",
            "position": 3,
            "url": ""
        },
        {
            "id": 4,
            "name": "image 4",
            "position": 4,
            "url": ""
        }
    ]
}
```
It works! However the json format does not follow the jsonapi.org spec.


Now we want our images to be part of a gallery

TODO: Explain one-to-many relationship with graph


`mix phx.gen.json Assets Gallery galleries name:string`

![Imgur](http://i.imgur.com/dBe486G.png)

Choose yes

Generate a migration. (what's a migration)

`mix ecto.gen.migration add_field_to_images`

Add the resource to your :api scope in lib/myapp_web/router.ex

```elixir
#lib/myapp_web/router.ex
defmodule MyappWeb.Router do
  use MyappWeb, :router

  pipeline :api do
    plug :accepts, ["json-api"]
    plug JaSerializer.ContentTypeNegotiation
    plug JaSerializer.Deserializer
  end

  scope "/api", MyappWeb do
    pipe_through :api

    resources "/images", ImageController, except: [:new, :edit]
    resources "/galleries", GalleryController, except: [:new, :edit]
  end

end
```

`mix ecto.migrate`

```ruby
#priv/repo/migrations/TIMESTAMP_add_field_to_images.exs

defmodule Myapp.Repo.Migrations.AddFieldToImages do
  use Ecto.Migration

  def change do
    alter table("images") do
      add :gallery_id, references(:galleries, on_delete: :delete_all)
    end
  end
end
```


> Note: You may be wondering where are all these keywords, 'alter', 'scope', 'pipeline', etc. from. They not part of the Elixir standard library. They are called 'macros'.


`mix ecto.migrate`

![Imgur](http://i.imgur.com/5G5FiYc.png)

The field gallery_id has been added to the `images` table along with a foreign key and a delete constraint.

```ruby
defmodule Myapp.Assets.Gallery do
  use Ecto.Schema
  import Ecto.Changeset
  alias Myapp.Assets.Gallery
  alias Myapp.Assets.Image


  schema "galleries" do
    field :name, :string
    has_many :images, Image

    timestamps()
  end

  @doc false
  def changeset(%Gallery{} = gallery, attrs) do
    gallery
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
```


```ruby
defmodule Myapp.Assets.Image do
  use Ecto.Schema
  import Ecto.Changeset
  alias Myapp.Assets.Image
  alias Myapp.Assets.Gallery

  schema "images" do
    field :name, :string
    field :position, :integer
    field :url, :string
    belongs_to :gallery, Gallery

    timestamps()
  end

  @doc false
  def changeset(%Image{} = image, attrs) do
    image
    |> cast(attrs, [:name, :url, :position])
    |> validate_required([:name, :url, :position])
  end
end```

```ruby
alias Myapp.Repo
alias Myapp.Assets.Image
alias Myapp.Assets.Gallery

Repo.delete_all Image
Repo.delete_all Gallery
[
  %Gallery{
    name: "image 1",
    images: [
      %Image{
        name: "image 1",
        url: "",
        position: 1,
      },
      %Image{
        name: "image 2",
        url: "",
        position: 2,
      },
      %Image{
        name: "image 3",
        url: "",
        position: 3,
      },
      %Image{
        name: "image 4",
        url: "",
        position: 4,
      },
      %Image{
        name: "image 5",
        url: "",
        position: 6,
      },
      %Image{
        name: "image 6",
        url: "",
        position: 6,
      }
    ]
  },
] |> Enum.each(&Repo.insert!(&1))```


`mix run priv/repo/seeds.exs`

Then configure ja_serializer in both gallery and image views


Install Ember and generate project

```
ember help generate model
ember g model gallery name:string images:has-many:image
ember g model image name:string url:string position:number gallery:belongs-to:gallery```
