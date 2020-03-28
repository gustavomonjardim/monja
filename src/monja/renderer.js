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

  // Add event listeners
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

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function commitWork(fiber, relative, relationship) {
  if (!fiber) {
    return;
  }
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
    if (relationship === "PARENT") {
      domParent.appendChild(fiber.dom);
    } else {
      domParent.insertBefore(fiber.dom, relative.dom.nextSibling);
    }
  } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
    updateDomProperties(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
    return;
  }

  commitWork(fiber.child, fiber, "PARENT");
  commitWork(fiber.sibling, fiber, "SIBLING");
}

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDomProperties(dom, {}, fiber.props);

  return dom;
}

export { commitWork, createDom };
