function updateDomProperties(dom, prevProps, nextProps) {
  const isEvent = key => key.startsWith("on");
  const isStyle = key => key === "style";
  const isProperty = key =>
    key !== "children" && !isEvent(key) && !isStyle(key);
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isGone = next => key => !(key in next);

  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => isGone(nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(eventName => {
      const eventType = eventName.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[eventName]);
    });

  // Add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(eventName => {
      const eventType = eventName.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[eventName]);
    });

  const prevStyle = prevProps.style ?? {};
  const nextStyle = nextProps.style ?? {};

  // Remove old styles
  Object.keys(prevStyle)
    .filter(isGone(prevStyle, nextStyle))
    .forEach(styleName => {
      dom.style[styleName] = "";
    });

  // Add new styles
  Object.keys(nextStyle)
    .filter(isNew(prevStyle, nextStyle))
    .forEach(styleName => {
      dom.style[styleName] = nextStyle[styleName];
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(nextProps))
    .forEach(propName => {
      dom[propName] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(propName => {
      dom[propName] = nextProps[propName];
    });
}

function getDOMParent(fiber) {
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  return domParentFiber.dom;
}

function commitDeletion(fiber) {
  const domParent = getDOMParent(fiber);
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function commitPlacement(fiber) {
  if (fiber.dom !== null) {
    const domParent = getDOMParent(fiber);

    if (!fiber.prevSibling) {
      domParent.appendChild(fiber.dom);
    } else {
      domParent.insertBefore(fiber.dom, fiber.prevSibling.dom.nextSibling);
    }
  }
}

function commitWork(fiber) {
  if (fiber.dom !== null) {
    updateDomProperties(fiber.dom, fiber.alternate.props, fiber.props);
  }
}

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDomProperties(dom, {}, fiber.props);

  return dom;
}

export { createDom, commitDeletion, commitPlacement, commitWork };
