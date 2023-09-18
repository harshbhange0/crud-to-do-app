import { Schema, model } from "mongoose";

const TaskS = new Schema({
  task: {
    type: String,
    required: true, // Makes the field required
  },
  completed: {
    type: Boolean, 
  },
});

const Task = model("Tasks", TaskS);

export default Task;
