const express = require('express');
const router = express.Router();
router.use(express.json());
const conn = require('../db.js');

router.post('/', createPlaylist);
router.get('/', getAllPlaylists);
router.delete('/:id',deletePlaylist);

function createPlaylist(req, res) {
  const checkSql = 'SELECT * FROM playlists WHERE title = ?;';
  conn.query(checkSql,req.body.title, (err,result) => {
    if(err) {
      res.status(500).json({error: err});
      return;
    };
    if(result.length > 0) {
      res.status(405).json({message: 'Playlist with that name already exists!'});
      return;
    };
    const sql = 'INSERT INTO playlists (title,system_rank) VALUES (?, 0);';
    conn.query(sql, req.body.title, (err,result) => {
      if(err) {
        res.status(500).json({error: err});
        return;
      };
      res.status(200).json({message:'Playlist succesfully created.'});
    });
  });
};

function getAllPlaylists (req, res) {
  const sql = 'SELECT * FROM playlists WHERE id > 2;';
  conn.query(sql, (err, result) => {
    if(err) {
      res.status(500).json({error:err});
      return;
    };
    res.status(200).json(result);
  });
};

function deletePlaylist(req, res) {
  const checkSql = `SELECT * FROM playlists WHERE id = ?;`;
  conn.query(checkSql, req.params.id, (err,result) => {
    if(err) {
      res.status(500).json({error: err});
      return;
    };
    if (result.length < 1) {
      res.status(400).json({message: 'No such playlist with given ID.'});
      return;
    };
    if(result.system_rank === 1) {
      res.status(405).json({message: 'Cannot delete playlist with given ID.'});
      return;
    };
    const sql = 'DELETE FROM playlists WHERE id = ?';
    conn.query(sql, req.params.id, (err,result) => {
      if (err) {
        res.status(500).json({error : err});
        return;
      };
      const trackSql = 'DELETE FROM tracks WHERE playlist_id = ?;';
      conn.query(trackSql, req.params.id, (err, result) => {
        if(err) {
          res.status(500).json({error: err});
          return;
        };
        res.status(200).json({message: 'Playlist successfully deleted.'});
      })
    });
  });
};

module.exports = router;