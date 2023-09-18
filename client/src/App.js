import React from "react";
import ToDoList from "./components/ToDoList";
function App() {
  return (
    <div className="flex flex-col gap-10 px-2 h-screen items-center justify-center w-full bg-purple-50">
      <h1 className="text-6xl">Todo List</h1>
      <ToDoList />
    </div>
  );
}

export default App;
