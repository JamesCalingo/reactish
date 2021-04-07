//@ts-ignore
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child == "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = key => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });
    console.log(dom)
  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

const Reactish = {
  createElement,
  render,
};
/** @jsx Reactish.createElement */
// const element =(
//   "div",
//   {id: "bloggo"},
//   Reactish.createElement("h1", null, `TOTES BLOGGO IN PROGRESS`)
// );
// const container = document.getElementById("root");
// Reactish.render(element, container);

const element = Reactish.createElement(
  <div id="bloggo">
    <h1>TOTES BLOGGO IN PROGRESS</h1>
    <p>Hi!</p>
    <p>Welcome to the new site for my blog!<br/>
    ...once it's ready.</p>
  </div>
)