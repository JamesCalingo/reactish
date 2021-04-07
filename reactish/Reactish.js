const Reactish = {
  createElement,
  render
}

const element = Reactish.createElement(
  "div",
  {id: "bloggo"},
  Reactish.createElement("p", null, "totes bloggo"),
  Reactish.createElement("b")
)

Reactish.render(element, container)