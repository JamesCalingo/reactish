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

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  console.log(dom);
  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

const isEvent = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps){
//Remove old event listeners
Object.keys(prevProps)
.filter(isEvent)
.filter(key => 
  !key in nextProps || 
  isNew(prevProps, nextProps)(key)
  )
  .forEach(name => {
    const eventType = name
    .toLowerCase()
    .substring(2)
    dom.removeEventListener(
      eventType, prevProps[name]
    )
  }) 
 
  //Remove old properties
  Object.keys(prevProps)
  .filter(isProperty)
  .filter(isGone(prevProps, nextProps))
  .forEach(name => {
    dom[name]  = ""
  })

  //Set new changes
  Object.keys(nextProps)
  .filter(isProperty)
  .filter(isNew(prevProps, nextProps))
  .forEach(name => {
    dom[name] = nextProps[name]
  })
  //Add new event listeners
  Object.keys(nextProps)
  .filter(isEvent)
  .filter(isNew(prevProps, nextProps))
  .forEach(name => {
    const eventType = name
    .toLowerCase()
    .substring(2)

    dom.addEventListener(
      eventType, nextProps[name]
    )
  })
}


function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  const domParent = fiber.parent.dom;
  if(fiber.effectTag === "PLACEMENT" && fiber.dom != null){
  domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = []
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

if (!nextUnitOfWork && wipRoot) {
  commitRoot();
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // if(fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }

  const elements = fiber.props.children;
  reconcileChildren(fiber, elements)
  
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(wipFiber, elements) {
  let i = 0;
  let oldFiber = 
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (i < elements.length || oldFiber != null) {
    const elem = elements[i];
    
    let newFiber = null
    

    const sameType = oldFiber && elem && elem.type == oldFiber.type

    if(sameType){
      // update node
      newFiber = {
        type: oldFiber.type,
        props: elem.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      }
    }

    if(element && !sameType){
      //add node
      newFiber = {
        type: elem.type,
        props: elem.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      }
    }

    if(oldFiber && !sameType){
      //delete old node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }
    
    if (i === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    
    prevSibling = newFiber;
    i++;

  }
}

const Reactish = {
  createElement,
  render,
};
/** @jsx Reactish.createElement */
function App(props) {
  return <h1> TEST</h1>
}

const element =
  ("div",
  { id: "bloggo" },
  Reactish.createElement("h1", null, [`BLOGGO IN PROG...GO`], props.name));
const container = document.getElementById("root");
Reactish.render(element, container);

// const element =(
//   <div id="bloggo">
//     <h1>TOTES BLOGGO IN PROGRESS</h1>
//     <p>Hi!</p>
//     <p>Welcome to the new site for my blog!<br/>
//     ...once it's ready.</p>
//   </div>
// )
