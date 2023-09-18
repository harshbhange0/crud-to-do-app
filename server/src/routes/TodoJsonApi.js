import express from "express";
import fs from "fs";
import { promisify } from "util";
import cron from 'node-cron';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const todoFilePath = "./tasks.json";

async function readTodoFile() {
  const data = await readFileAsync(todoFilePath, "utf8");
  return JSON.parse(data);
}

async function writeTodoFile(todoItems) {
  await writeFileAsync(
    todoFilePath,
    JSON.stringify(todoItems, null, 2),
    "utf8"
  );
}

const allItemsJ = express.Router();
allItemsJ.get("/all", async (req, res) => {
  const todoItems = await readTodoFile();
  res.json({
    data: todoItems,
  });
});

const AddTodoItemJ = express.Router();
AddTodoItemJ.post("/add", async (req, res) => {
  const taskText = req.body.Task;
  const completed = req.body.completed;
  const todoItems = await readTodoFile();
  const newTask = {
    _id: Date.now().toString(),
    Task: taskText,
    completed: completed,
  };
  todoItems.push(newTask);
  await writeTodoFile(todoItems);
  res.json({
    success: true,
    message: "Task Saved Successfully",
    data: newTask,
  });
});

const deleteItemJ = express.Router();
deleteItemJ.delete("/delete/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const todoItems = await readTodoFile();
  const index = todoItems.findIndex((item) => item._id === taskId);
  if (index !== -1) {
    const deletedTask = todoItems.splice(index, 1)[0];
    await writeTodoFile(todoItems);
    res.json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }
});

const editItemJ = express.Router(); // Corrected the assignment operator here
editItemJ.put("/edit/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const updatedTaskData = req.body;
  const todoItems = await readTodoFile();
  const index = todoItems.findIndex((item) => item._id === taskId);
  
  if (index !== -1) {
    const updatedTask = { ...todoItems[index], ...updatedTaskData };
    todoItems[index] = updatedTask;
    await writeTodoFile(todoItems);
    
    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }
});

editItemJ.put("/is-complete/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const { completed } = req.body; // Extract task completeness from the request body

  try {
    const todoItems = await readTodoFile(); // Read the JSON data

    const index = todoItems.findIndex((item) => item._id === taskId);

    if (index !== -1) {
      // Update the completeness of the task
      todoItems[index].completed = completed;

      // Write the updated data back to the JSON file
      await writeTodoFile(todoItems);

      res.json({
        success: true,
        message: "Task completeness updated successfully",
        data: todoItems[index],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
  } catch (error) {
    console.error("Error updating Task completeness:", error);
    res.status(500).json({
      success: false,
      message: "Error updating Task completeness",
      error: error.message,
    });
  }
});
cron.schedule("* * * * *", async () => {
  const todoItems = await readTodoFile();

  // Filter and keep only tasks where completed is not true
  const filteredTasks = todoItems.filter(item => !item.completed);

  // If any tasks were removed, write the updated data back to the JSON file
  if (filteredTasks.length !== todoItems.length) {
    await writeTodoFile(filteredTasks);
    console.log('Deleted completed tasks.');
  }
});


export { allItemsJ, AddTodoItemJ, deleteItemJ, editItemJ };
