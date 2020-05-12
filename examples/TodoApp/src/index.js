import Monja, { useState, useEffect } from "../../../src";

import Item from "./Item";

function TodoApp() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log("useEffect");
    return () => {
      console.log("cleanup effect");
    };
  }, [todo]);

  const addTodo = () => {
    if (todo) {
      setTodos(todos => [
        { text: todo, id: index, completed: false },
        ...todos
      ]);
      setTodo("");
      setIndex(index + 1);
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
      <div>
        {todos
          .filter(item => !item.completed)
          .map(item => (
            <Item
              key={item.id}
              toggleStatus={() => toggleStatus(item.id)}
              completed={false}
              text={item.text}
            />
          ))}
      </div>
      <div>
        {todos
          .filter(item => item.completed)
          .map(item => (
            <Item
              key={item.id}
              toggleStatus={() => toggleStatus(item.id)}
              completed
              text={item.text}
            />
          ))}
      </div>
    </div>
  );
}

const container = document.getElementById("root");

Monja.render(<TodoApp />, container);
