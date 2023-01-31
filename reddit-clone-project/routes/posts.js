const express = require("express");
const router = express.Router();
router.use(express.json());
const conn = require("../db.js");

router.get("/posts/:id", getPost);
router.get("/posts", getAllPosts);
router.post("/user/:id/posts", postAPost);
router.patch("/user/:user_id/posts/:id/upvote", upvote);
router.patch("/user/:user_id/posts/:id/downvote", downvote);
router.delete("/user/:user_id/posts/:id", deletePost);
router.patch("/user/:user_id/posts/:id", updatePost);

function getPost(req, res) {
  const sql = `SELECT * FROM posts JOIN user on posts.user_id = user.user_id WHERE post_id = ${req.params.id};`;
  conn.query(sql, (error, results) => {
    if (error) {
      res.status(500).send({ message: error });
    }
    res.status(200).json(results);
  });
}

function getAllPosts(req, res) {
  const sql = "SELECT * FROM posts JOIN user on posts.user_id = user.user_id;";
  conn.query(sql, (error, results) => {
    if (error) {
      res.status(500).send({ message: error });
    }
    res.status(200).json(results);
  });
}

function postAPost(req, res) {
  let id = req.body.user_id;
  const sql = `INSERT INTO posts (title, post_body,user_ID) VALUES ('${req.body.title}', '${req.body.post_body}', '${id}');`;
  conn.query(sql, (error, results) => {
    if (error || results.affectedRows === 0) {
      res.status(400).send({ message: "Internal server Error" });
    }
    const sql = `SELECT * FROM posts WHERE post_id = ? ;`;
    conn.query(sql, results.insertId, (error, results) => {
      if (error) {
        res.status(500).send({ message: "Internal Server Error." + error });
      }
      res.status(201).json(results[0]);
    });
  });
}

function upvote(req, res) {
  const sqlQuerry = `SELECT * FROM posts WHERE post_id = ${req.params.id};`;
  conn.query(sqlQuerry, (error, results) => {
    if (error) {
      res.status(400).send({ message: "Internal server Error" });
    }
    if (results[0].user_id == parseInt(req.params.user_id)) {
      res.status(405).send({ message: "Cannot vote on your post!" });
    } else {
      const sql = `UPDATE posts SET votes = votes + 1 WHERE post_id = ${req.params.id};`;
      conn.query(sql, (error, results) => {
        if (error || results.affectedRows === 0) {
          res.status(400).send({ message: "Internal server Error" });
        }
        const sql = `SELECT * FROM posts WHERE post_id = ? ;`;
        conn.query(sql, req.params.id, (error, results) => {
          if (error) {
            res.status(500).send({ message: "Internal Server Error." + error });
          }
          res.status(201).json(results[0]);
        });
      });
    }
  });
}

function downvote(req, res) {
  const sqlQuerry = `SELECT * FROM posts WHERE post_id = ${req.params.id};`;
  conn.query(sqlQuerry, (error, results) => {
    if (error) {
      res.status(400).send({ message: "Internal server Error" });
    }
    if (results[0].user_id == parseInt(req.params.user_id)) {
      res.status(405).send({ message: "Cannot vote on your post!" });
    } else {
      const sql = `UPDATE posts SET votes = votes - 1 WHERE post_id = ${req.params.id};`;
      conn.query(sql, (error, results) => {
        if (error || results.affectedRows === 0) {
          res.status(400).send({ message: "Internal server Error" });
        }
        const sql = `SELECT * FROM posts WHERE post_id = ? ;`;
        conn.query(sql, req.params.id, (error, results) => {
          if (error) {
            res.status(500).send({ message: "Internal Server Error." + error });
          }
          res.status(201).json(results[0]);
        });
      });
    }
  });
}

function deletePost(req, res) {
  const sqlQuerry = `SELECT * FROM posts WHERE post_id = ${req.params.id};`;
  conn.query(sqlQuerry, (error, results) => {
    if (error) {
      res.status(400).send({ message: "Internal server Error" });
    }
    if (results[0].user_id !== parseInt(req.params.user_id)) {
      res
        .status(405)
        .send({ message: "Cannot delete a post which is not yours!" });
    } else {
      const sql = `DELETE FROM posts WHERE post_id = ${req.body.post_id};`;
      conn.query(sql, (error, results) => {
        if (error || results.affectedRows === 0) {
          res.status(400).send({ message: "Internal server Error" });
        }
        res.status(200).send({ message: "Post deleted!" });
      });
    }
  });
}

function updatePost(req, res) {
  const sqlQuerry = `SELECT * FROM posts WHERE post_id = ${req.params.id};`;
  conn.query(sqlQuerry, (error, results) => {
    if (error) {
      res.status(400).send({ message: "Internal server Error" });
    }
    if (results[0].user_id !== parseInt(req.params.user_id)) {
      res
        .status(405)
        .send({ message: "Cannot update a post which is not yours!" });
    } else {
      let body = `'${req.body.post_body}'`;
      let title = `'${req.body.title}'`;
      if (title == `'undefined'`) {
        title = null;
      }
      if (body == `'undefined'`) {
        body = null;
      }
      const sql = `UPDATE posts SET title = COALESCE(${title}, title), post_body = COALESCE(${body},post_body) WHERE post_id = ${req.params.id};`;
      conn.query(sql, (error, results) => {
        if (error || results.affectedRows === 0) {
          res.status(400).send({ message: "Internal server Error" });
        }
        const sql = `SELECT * FROM posts WHERE post_id = ? ;`;
        conn.query(sql, req.params.id, (error, results) => {
          if (error) {
            res.status(500).send({ message: "Internal Server Error." + error });
          }
          res.status(201).json(results[0]);
        });
      });
    }
  });
}

module.exports = router;
