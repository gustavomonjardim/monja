function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function getChildren(children) {
  return children.map(child =>
    typeof child === "object" ? child : createTextElement(child)
  );
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: getChildren(children)
    }
  };
}

export { createElement };
