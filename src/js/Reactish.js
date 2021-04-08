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

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = key => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
    console.log(dom)
  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;
  while(nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
if(!fiber.dom) {
  fiber.dom = createDom(fiber)
}
if(fiber.parent) {
  fiber.parent.dom.appendChild(fiber.dom)
}

const elements = fiber.props.children
let i = 0;
let prevSibling = null

while (i < elements.length) {
  const elem = elements[i]

  const newFiber = {
    type: elem.type,
    props: elem.props,
    parent: fiber,
    dom: null
  }

  if(i === 0) {
    fiber.child=newFiber
  }else{
    prevSibling.sibling = newFiber
  }

  prevSibling = newFiber
  i++
}

if(fiber.child){
  return fiber.child
}
let nextFiber = fiber
while(nextFiber) {
  if(nextFiber.sibling) {
    return nextFiber.sibling
  }
  nextFiber = nextFiber.parent
}

}


const Reactish = {
  createElement,
  render,
};
/** @jsx Reactish.createElement */
const element =(
  "div",
  {id: "bloggo"},
  Reactish.createElement("h1", null, `BLOGGO IN PROG...GO`)
);
const container = document.getElementById("root");
Reactish.render(element, container);

// const element = Reactish.createElement(
//   <div id="bloggo">
//     <h1>TOTES BLOGGO IN PROGRESS</h1>
//     <p>Hi!</p>
//     <p>Welcome to the new site for my blog!<br/>
//     ...once it's ready.</p>
//   </div>
// )