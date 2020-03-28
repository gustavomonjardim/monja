import Monja from "./monja";
import Todo from "./examples/Todo";

const container = document.getElementById("root");

/** @jsx Monja.createElement */
Monja.render(<Todo />, container);
