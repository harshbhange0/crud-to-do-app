import React, { useEffect, useState } from "react";
import axios from "axios";

// import { FcAddRow } from "react-icons/fc";

function ToDoList() {
  const [changeS, setChangeS] = useState("db");
  const baseUrl = `http://localhost:5000/todo/${changeS}`;
  const [taskShow, setTaskShow] = useState([]);
  const [newTask, setNewTask] = useState("");

  //get all tasks
  const getTask = async (e) => {
    const response = await axios.get(`${baseUrl}/all`);
    setTaskShow(response.data.data);
  };
  //add new tasks
  const handleAdd = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${baseUrl}/add`, {
      Task: newTask,
    });
    console.log(response?.data.data);
    setNewTask("");
    getTask();
    return;
  };
  //delete task
  const handleDeleteTask = async (task_id) => {
    try {
      const response = await axios.delete(`${baseUrl}/delete/${task_id}`);
      console.log(task_id);
      console.log(response?.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTask = async (id) => {
    console.log(id);
    let updateTask = prompt("Update task");
    if (updateTask) {
      const response = await axios.put(`${baseUrl}/edit/${id}`, {
        Task: updateTask,
      });
      console.log(response?.data.data);
    } else {
      alert("Please enter a task");
      updateTask = prompt("Please Update task");
    }
  };
  const handleComplete = async (id, e) => {
    let isTrue = e.target.checked;
    try {
      let response = await axios.put(`${baseUrl}/is-complete/${id}`, {
        completed: isTrue,
      });
      console.log(isTrue);
      console.log(response?.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    getTask();
  }, [newTask]);

  return (
    <div className="relative rounded-md  bg-gradient-to-tr from-purple-400/50  via-blue-400/50   to-violet-500/50 px-4 py-2">
      <button className="absolute top-[-30%]" onClick={getTask}>Refresh</button>
      <div className="h-[400px] overflow-auto">
        {taskShow?.map((task, i) => {
          return (
            <div
              key={task._id}
              className="m-4  rounded-md bg-slate-50 p-3  shadow-md shadow-purple-500/50"
            >
              <div className="flex items-center justify-between py-2">
                Task No. {i + 1}{" "}
                <div className="flex flex-row items-center justify-start gap-4">
                  <label htmlFor={task._id}>Complete</label>
                  <input
                    type="checkbox"
                    id={task._id}
                    checked={task.completed}
                    onChange={(e) => {
                      handleComplete(task._id, e);
                    }}
                  />
                </div>
              </div>
              <p className="border bg-slate-100 p-2 shadow-sm">
                {" "}
                {task.Task || task.task}
              </p>
              <div className="my-3 flex flex-row items-center justify-around">
                <button
                  onClick={() => {
                    handleDeleteTask(task._id);
                  }}
                  className="rounded-md border bg-red-100 p-2 text-red-500"
                >
                  Delete Task
                </button>
                <button
                  onClick={() => handleUpdateTask(task._id)}
                  className="rounded-md border bg-green-100 p-2 text-green-500"
                >
                  Edit Task
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleAdd}
        className="  flex flex-row items-center justify-center gap-2 px-8 py-2 "
      >
        <input
          type="text"
          autoComplete="off"
          placeholder="Add Task"
          required
          className="w-full rounded-md px-1 py-2 outline-none"
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
          }}
        />
        <button type="submit" className="rounded-md bg-white p-2">
          Add
        </button>
      </form>
      <button
        onClick={() => {
          setChangeS("json");
        }}
        className="mx-auto my-3 block border px-2 py-1"
      >
        Changed Storage to {changeS}
      </button>
    </div>
  );
}

export default ToDoList;
