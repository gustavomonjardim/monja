import Monja from "../monja";

/** @jsx Monja.createElement */
function Todo() {
  const [todo, setTodo] = Monja.useState("");
  const [todos, setTodos] = Monja.useState([]);
  const [completed, setCompleted] = Monja.useState([]);
  const [number, setNumber] = Monja.useState(0);

  const addTodo = () => {
    if (todo) {
      setTodos(todos => [...todos, { text: todo, id: number }]);
      setTodo("");
      setNumber(number => number + 1);
    }
  };

  const completeTask = completedTodo => {
    setCompleted(completed => [...completed, completedTodo]);
    setTodos(todos => todos.filter(todo => todo.id !== completedTodo.id));
  };

  return (
    <div>
      <input
        value={todo}
        onChange={e => {
          setTodo(e.target.value);
        }}
      />
      <button onClick={addTodo}>Add Todo</button>
      <h1>Todo</h1>
      {todos.map(item => (
        <div>
          <p>{item.text}</p>
          <button onClick={() => completeTask(item)}>Complete Task</button>
        </div>
      ))}
      <h1>Completed</h1>
      {completed.map(item => (
        <div>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export default Todo;
