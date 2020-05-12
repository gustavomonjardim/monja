import Monja from "../../../src";

function Todo({ toggleStatus, completed, text }) {
  return (
    <div
      style={{
        paddingTop: 12
      }}
    >
      <input
        name="isGoing"
        type="checkbox"
        checked={completed}
        onChange={toggleStatus}
      />
      <span
        style={{
          fontSize: 22,
          color: completed ? "gray" : "black",
          marginLeft: 14,
          textDecoration: completed ? "line-through" : "none"
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default Todo;
