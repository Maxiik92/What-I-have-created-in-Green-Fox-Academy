const express = require('express');
const router = express.Router();
router.use(express.json());
const conn = require('../db.js');

router.post('/user', createUser);
router.delete('/user/:id', deleteUser);
router.patch('/user/:id', updateUser);
router.post('/check',checkUser);
router.get('/user/:user_id',getUser);

function createUser(req, res) {
  const findName = `SELECT name from User WHERE name = '${req.body.name}';`;
  conn.query(findName, (error, results) => {
    if (error) {
      res.status(500).json({ message: error });
      return;
    };
    if (results.length > 0) {
      res.status(400).json({ message: "Username already in use" });
      return;
    };
    const sql = `INSERT INTO user (name, user_password) VALUES ('${req.body.name}', '${req.body.user_password}');`;
    conn.query(sql, (error, results) => {
      if (error || results.affectedRows === 0) {
        res.status(400).send({ message: error });
        return;
      }
      const sql = `SELECT * FROM user WHERE user_id = ? ;`;
      conn.query(sql, results.insertId, (error, results) => {
        if (error) {
          res.status(500).send({ message: 'Internal Server Error.' + error });
          return;
        };
        res.status(201).send(results[0]);
      });
    });
  })
};

function deleteUser(req, res) {
  const sql = (`DELETE FROM user WHERE user_id = ${req.params.id};`);
  conn.query(sql, (error, results) => {
    if (error || results.affectedRows === 0) {
      res.status(400).send({ message: error });
      return
    };
    res.status(200).send({ message: "User deleted!" });
  });
};

function updateUser(req, res) {
  const sql = (`UPDATE user SET name = ${req.body.name};`);
  conn.query(sql, (error, results) => {
    console.log(error, results)
    if (error || results.affectedRows === 0) {
      res.status(400).send({ message: error });
    };
    const sql = `SELECT * FROM user WHERE user_id = ? ;`;
    conn.query(sql, req.params.id, (error, results) => {
      if (error) {
        res.status(500).send({ message: error });
      };
      res.status(201).send(results[0]);
    });
  });
};

function checkUser(req, res) {
  const sql = `SELECT * FROM user WHERE name = '${req.body.name}' AND user_password = '${req.body.user_password}';`
  conn.query(sql,(error,results) => {
    if(error) {
      res.status(500).json({messsage: error});
      return;
    }
    else if(!results[0]) {
      res.status(400).json({message: "Wrong name or password."});
      return;
    };
    res.status(200).json(results[0]);
  });
};

function getUser (req, res) {
  const sql = `SELECT * FROM user WHERE user_id='${req.params.user_id}';`
  conn.query(sql, (error, results) => {
    if(error) {
      res.status(500).json({message : error});
      return;
    };
    if(!results[0]) {
      res.status(400).json({message: "id cannot be found"});
      return;
    };
    res.status(200).json(results[0]);
  });
};

module.exports = router;