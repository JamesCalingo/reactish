function createElement(type, props, ...children) {
  // Elements in React can be broken down into two simple components: A type, and props.
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