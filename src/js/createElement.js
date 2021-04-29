import Reactish from "./Reactish"
/** @jsx Reactish.createElement */
const element = Reactish.createElement(
  "div",
  null,
  Reactish.createElement("h1", null, "TOTES BLOGGO IN PROGGO"),
  Reactish.createElement("p", null, `This site is still very much under construction, but trust me, there'll be some awesome stuff here when it's ready.`),
 
  )
  
  const container = document.getElementById("root");
  Reactish.render(element, container);