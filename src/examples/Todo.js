import Monja, { useState, useEffect } from "../monja";

function Todo() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    console.log("useEffect");
    return () => {
      console.log("cleanup effect");
    };
  }, [todo]);

  const addTodo = () => {
    if (todo) {
      setTodos(todos => [
        { text: todo, id: number, completed: false },
        ...todos
      ]);
      setTodo("");
      setNumber(number => number + 1);
    }
  };

  const toggleStatus = id => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: 20
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <input
          value={todo}
          onChange={e => {
            setTodo(e.target.value);
          }}
          style={{ width: 300, padding: 8 }}
        />
        <button
          style={{
            backgroundColor: "black",
            color: "#FFF",
            paddingTop: 8,
            paddingBottom: 8,
            textTransform: "uppercase",
            minWidth: 200,
            marginLeft: 20
          }}
          onClick={addTodo}
        >
          Add Todo
        </button>
      </div>
      {todos
        .filter(item => !item.completed)
        .map(item => (
          <div
            key={item.id}
            style={{
              paddingTop: 12
            }}
          >
            <input
              name="isGoing"
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleStatus(item.id)}
            />
            <span
              style={{
                fontSize: 22,
                color: "black",
                marginLeft: 8
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      {todos
        .filter(item => item.completed)
        .map(item => (
          <div
            key={item.id}
            style={{
              paddingTop: 12
            }}
          >
            <input
              name="isGoing"
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleStatus(item.id)}
            />
            <span
              style={{
                fontSize: 22,
                color: "gray",
                textDecoration: "line-through",
                marginLeft: 8
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
    </div>
  );
}

export default Todo;
