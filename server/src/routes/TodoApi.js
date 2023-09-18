import Express from "express";
import cron from "node-cron";
import Task from "../model/Task.js";

// http://localhost:5000/todo/all
const TodoItems = Express.Router();
TodoItems.get("/all", async (req, res) => {
  try {
    const todoItems = await Task.find();
    res.json({
      data: todoItems,
    });
  } catch (error) {
    console.error("Error fetching Task:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Task",
      error: error.message,
    });
  }
});
//http://localhost:5000/todo/add
const AddTodo = Express.Router();
AddTodo.post("/add", async (req, res) => {
  const taskText = req.body.Task; // Task is the field name in your request body
  try {
    const newTask = new Task({
      task: taskText, // Use the taskText variable to set the 'task' field
    });
    const savedTask = await newTask.save();

    res.json({
      success: true,
      message: "Task Saved Successfully",
      data: savedTask,
    });
  } catch (error) {
    console.error("Error saving Task:", error);
    res.status(500).json({
      success: false,
      message: "Error saving Task",
      error: error.message,
    });
  }
});

const DeleteTodo = Express.Router();
//http://localhost:5000/todo/delete/6506b371234f67545e43013c

DeleteTodo.delete("/delete/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // Assuming Task is a Mongoose model and you want to delete a task by its ID
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    console.error("Error deleting Task:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting Task",
      error: error.message,
    });
  }
});

// http://localhost:5000/todo/edit/6506b38f234f67545e43013e
const EditTodo = Express.Router();

EditTodo.put("/edit/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const { task } = req.body; // Extract task and taskComplete from the request body

  try {
    const updatedTaskData = {
      task, // Include the taskComplete field
    };

    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, {
      new: true, // Return the updated task
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating Task:", error);
    res.status(500).json({
      success: false,
      message: "Error updating Task",
      error: error.message,
    });
  }
});
const Com = Express.Router();
Com.put("/is-complete/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const { completed } = req.body; // Extract task and taskComplete from the request body

  try {
    const updatedTaskData = {
      completed, // Include the taskComplete field
    };

    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, {
      new: true, // Return the updated task
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating Task:", error);
    res.status(500).json({
      success: false,
      message: "Error updating Task",
      error: error.message,
    });
  }
});

cron.schedule("* * * * *", async () => {
  try {
    // Find and delete completed tasks
    const deletedTasks = await Task.deleteMany({ completed: true });

    console.log(`Deleted ${deletedTasks.deletedCount} completed tasks.`);
  } catch (error) {
    console.error("Error deleting completed tasks:", error);
  }
});

export { TodoItems, AddTodo, DeleteTodo, EditTodo, Com };
