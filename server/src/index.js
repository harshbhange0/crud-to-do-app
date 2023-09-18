import express from "express";
import cors from "cors";
import connectionMongoDB from "./db/DbConnect.js";
import { AddTodo, DeleteTodo, EditTodo, TodoItems,Com } from "./routes/TodoApi.js";
import { AddTodoItemJ, allItemsJ, deleteItemJ, editItemJ } from "./routes/TodoJsonApi.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
}));
// json routes
app.use("/todo/json", allItemsJ);
app.use("/todo/json", AddTodoItemJ);
app.use("/todo/json", deleteItemJ);
app.use("/todo/json", editItemJ);


//db routes
app.use("/todo/db", TodoItems);
app.use("/todo/db", AddTodo);
app.use("/todo/db", DeleteTodo);
app.use("/todo/db", EditTodo);
app.use("/todo/db", Com);


connectionMongoDB();

const PORT = 5000;
app.listen(PORT, () => {
  console.log("server listening on " + PORT);
});
