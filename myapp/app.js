const express = require("express")
const path = require("path")
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())


const dbPath = path.join(__dirname, "todos.db");

let db = null;

const initializeDBAndServer = async () => {
    try {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      app.listen(3000, () => {
        console.log("Server Running at http://localhost:3000/");
      });
    } catch (e) {
      console.log(`DB Error: ${e.message}`);
      process.exit(1);
    }
  };
  
  initializeDBAndServer();


  app.get("/todos/", async (request, response) => {
    console.log("ok")
    const getTodosQuery = `
      SELECT
        *
      FROM
        todos;`;
    const todosArray = await db.all(getTodosQuery);
    response.send(todosArray);
  });

  app.post("/todos/", async (request, response) => {
    const todoDetails = request.body;
    const {id,name,status
    } = todoDetails;
    const addtodoQuery = `
      INSERT INTO
        todos (Id,name,status)
      VALUES
        (
           ${id},
          '${name}',
           '${status}'

        );`;
  
    const dbResponse = await db.run(addtodoQuery);
    const todoId = dbResponse.lastID;
    response.send({ todoId: todoId });
  });

  app.put("/todos/:todoId/", async (request, response) => {
    const { todoId } = request.params;
    const todoDetails = request.body;
    const {
      name,status
    } = todoDetails;
    const updatetodoQuery = `
      UPDATE
        todos
      SET
        name='${name}',
        status='${status}'
      WHERE
        Id = ${todoId};`;

    await db.run(updatetodoQuery);
    response.send("Todo Updated Successfully");
  });

  
  app.delete("/todos/:todoId/", async (request, response) => {
    const { todoId } = request.params;
    const deleteTodoQuery = `
      DELETE FROM
        todos
      WHERE
        Id = ${todoId};`;
    await db.run(deleteTodoQuery);
    response.send("Todo Deleted Successfully");
  });
