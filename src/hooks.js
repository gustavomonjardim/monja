function cleanUpEffects(fiber) {
  if (fiber.hooks) {
    fiber.hooks
      .filter(
        hook => hook.tag === "effect" && typeof hook.cleanUp === "function"
      )
      .forEach(effectHook => {
        effectHook.cleanUp();
      });
  }
}

function runEffects(fiber) {
  if (fiber.hooks) {
    fiber.hooks
      .filter(
        hook => hook.tag === "effect" && typeof hook.effect === "function"
      )
      .forEach(effectHook => {
        effectHook.cleanUp = effectHook.effect();
      });
  }
}

const hasEffectDepsChanged = (prevDeps, nextDeps) =>
  !prevDeps ||
  !nextDeps ||
  prevDeps.length !== nextDeps.length ||
  prevDeps.some((dep, index) => dep !== nextDeps[index]);

export { hasEffectDepsChanged, runEffects, cleanUpEffects };
