const Reactish = {
  createElement,
  render
}

const element = Reactish.createElement(
  <div id="bloggo">
    <h1>TOTES BLOGGO IN PROGRESS</h1>
    <p>Hi!</p>
    <p>Welcome to the new site for my blog!<br/>
    ...once it's ready.</p>
  </div>
)

Reactish.render(element, container)