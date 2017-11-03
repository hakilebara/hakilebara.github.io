---
published: false
---
## TIL how to sideload JSON-API relationships with Phoenix 1.3

```elixir
# lib/myapp_web/controllers/album_controller.ex

  def show(conn, %{"id" => id, "include" => include }) do
    post = Blog.get_post!(id)
    render(conn, "show.json-api", data: post, opts: [include: String.replace(include, " ", "")])
  end
  def show(conn, %{"id" => id}) do
    post = Blog.get_post!(id)
    render(conn, "show.json-api", data: post)
  end
```
