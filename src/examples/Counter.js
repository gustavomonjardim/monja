import Monja from "../monja";

/** @jsx Monja.createElement */
function Counter() {
  const [state, setState] = Monja.useState(1);
  return (
    <div>
      <h1>Count: {state}</h1>
      <button onClick={() => setState(c => c + 1)}>Increase</button>
      <button onClick={() => setState(c => c - 1)}>Decrease</button>
    </div>
  );
}

export default Counter;
