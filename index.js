const express = require("express");
var cors = require("cors");
const fs = require("fs");
var mysql = require('mysql2');

// connecting to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'travel'
});
connection.connect((err) => {
  if (err) { console.log("DB Connection Failed."); return }

  // Initializing Exprress Server
  const app = express();
  app.use(cors());

  //Routes/Apis
  app.use("/readFile", async (req, res) => {
    res.end(await fs.readFileSync("./data.json"))
  });
  app.use("/writeFile", async (req, res) => {
    var id = req.query.id
    var name = req.query.name
    if (id && name) {
      var data = JSON.parse(await fs.readFileSync("./data.json"))
      data.data.push({ id: id, name: name })
      await fs.writeFileSync("./data.json", JSON.stringify(data))
      res.json({ status: "File Updated." })
    } else {
      res.end("Error Occured")
    }
  });

  // display
  app.get("/users", (req, res) => {
    connection.query("SELECT * FROM user;", (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

// search
  app.get("/user/:id", (req, res) => {
    if(!req.params.id){
      res.json({error: "Id required"})
      return
    }
    var id = req.params.id
    connection.query("SELECT * FROM user WHERE userid = "+id, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // add
  app.get("/adduser", (req, res) => {
    if(!req.query.userid){
      res.json({error: "Id required"})
      return
    }
    if(!req.query.name){
      res.json({error: "Name required"})
      return
    }
    var userid = req.query.userid
    var name = req.query.name
    connection.query(`INSERT INTO user(userid,name) VALUES(${userid},'${name}')`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // update
  app.get("/updateuser", (req, res) => {
    if(!req.query.id){
      res.json({error: "Id required"})
      return
    }
    if(!req.query.name){
      res.json({error: "Name required"})
      return
    }
    var id = req.query.id
    var name = req.query.name
    connection.query(`UPDATE user SET name = '${name}' WHERE userid = ${id}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // delete
  app.get("/deleteuser", (req, res) => {
    if(!req.query.id){
      res.json({error: "Id required"})
      return
    }
    
    var id = req.query.id
    connection.query(`DELETE FROM user WHERE userid = ${id}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  //Port
  const port = 8000;

  //Starting a server
  app.listen(port, () => {
    console.log(`*** SERVER STARTED AT PORT ${port} ***`);
  });

})
