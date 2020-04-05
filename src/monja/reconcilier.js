import {
  createDom,
  commitDeletion,
  commitPlacement,
  commitWork
} from "./renderer";

import { hasEffectDepsChanged, runEffects, cleanUpEffects } from "./hooks";

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = [];
let wipFiber = null;
let hookIndex = null;
let firstEffect = null;
let lastEffect = null;

function commitAllDeletions(deletions) {
  deletions.forEach(fiber => {
    commitDeletion(fiber);
    cleanUpEffects(fiber);
  });
}

function commitAllHostEffects(fiber) {
  let nextEffect = fiber;

  while (nextEffect !== null) {
    switch (nextEffect.effectTag) {
      case "PLACEMENT":
        commitPlacement(nextEffect);
        runEffects(nextEffect);
        break;
      case "UPDATE":
        cleanUpEffects(nextEffect);
        commitWork(nextEffect);
        runEffects(nextEffect);
        break;
    }

    const next = nextEffect.nextEffect;
    nextEffect.nextEffect = null;
    nextEffect = next;
  }
}

function commitRoot() {
  commitAllDeletions(deletions);
  commitAllHostEffects(firstEffect);
  currentRoot = wipRoot;
  wipRoot = null;
  firstEffect = null;
  lastEffect = null;
  deletions = [];
}

function reconcileChildren(wipFiber, children) {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling = null;

  while (index < children.length || oldFiber != null) {
    const element = children[index];

    let newFiber = null;

    const sameType =
      element?.type === oldFiber?.type && element?.props?.key === oldFiber?.key;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        key: element.props.key,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
        nextEffect: null
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        key: element.props.key,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
        nextEffect: null
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (firstEffect === null) {
      firstEffect = newFiber;
      lastEffect = newFiber;
    } else {
      lastEffect.nextEffect = newFiber;
      lastEffect = newFiber;
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
      newFiber.prevSibling = null;
    } else if (element) {
      prevSibling.sibling = newFiber;
      newFiber.prevSibling = prevSibling;
    }

    prevSibling = newFiber;
    index += 1;
  }
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children.flat());
}

/*
  Cria o elemento HTML para a fibra atual. E reconcilia seus filhos.
  Retorna a próxima fibra a ser reconciliada
*/
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

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

  return nextFiber;
}

/*
  Loop responsável por fazer o processo de reconciliação da árvore de componentes.
  Quando não tem mais nada a ser reconciliado, o resulto é commitado no DOM
*/
function workLoop(deadline) {
  while (nextUnitOfWork && !deadline.didTimeout) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

/*
  Função principal, responsável por criar o elemento raiz da árvore de componentes
*/
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  };

  nextUnitOfWork = wipRoot;
}

function useState(initial) {
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];

  const hook = {
    tag: "state",
    state: oldHook ? oldHook.state : initial
  };

  const setState = action => {
    if (typeof action === "function") {
      hook.state = action(hook.state);
    } else {
      hook.state = action;
    }
    render(currentRoot.child, currentRoot.dom);
  };

  wipFiber.hooks.push(hook);
  hookIndex++;

  return [hook.state, setState];
}

function useEffect(effect, deps) {
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];

  const hasChanged = hasEffectDepsChanged(oldHook?.deps, deps);

  const hook = {
    tag: "effect",
    effect: hasChanged ? effect : null,
    cleanUp: hasChanged ? oldHook?.cleanUp : null,
    deps
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
}

export { render, useState, useEffect };
