const express = require('express');
const router = express.Router();
router.use(express.json());
const conn = require('../db.js');
const mm = require('musicmetadata');
const fs = require('fs');
const path = 'C:\\Users\\tomas\\Music';

router.get('/', getAllTracks);
router.post('/:playlist_id', addToPlaylist);
router.get('/:playlist_id', getPlaylist);
router.delete('/:playlist_id/:track_id', deleteTrack);

function getSong(path) {
  if (fs.existsSync(path)) {
    return new Promise((resolve, reject) => {
      mm(fs.createReadStream(path), { duration: true }, function (err, track) {
        if (err) return reject(err);
        return resolve(track);
      });
    });
  };
};

async function readSong(results) {
  let output = [];
  for (let i = 0; i < results.length; i++) {
    const song = await getSong(results[i].path);
    if (song){
    song.url = results[i].path;
    song.id = results[i].id;
    song.playlist_id = results[i].playlist_id
    output.push(song);
    };
  };
  return output;
}
//<img src=`data:image/png;base64,picture[0].data.toString('base64')` />

function getAllTracks(req, res) {
  const sql = "SELECT * FROM tracks WHERE playlist_id = '1';";
  conn.query(sql, async (error, results) => {
    if (error) {
      res.status(500).json({ error: error });
      return;
    };
    const output = await readSong(results);
    res.status(200).json(output);
  });
};

//first check for duplicates then add
function addToPlaylist(req, res) {
  const checkSql = `SELECT * FROM tracks WHERE path = ? AND playlist_id = ? ;`;
  conn.query(checkSql, [path.concat(req.body.path), req.params.playlist_id], (err, result) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    };
    if (result.length > 0) {
      res.status(405).json({ message: 'Song already in playlist.' });
      return;
    };
    const sql = 'INSERT INTO tracks (path, playlist_id) VALUES ( ?, ?);';
    conn.query(sql, [path.concat(req.body.path), req.params.playlist_id], (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.status(200).json({ message: "Successfully added!" });
    });
  });
};

function getPlaylist(req, res) {
  const sql = `SELECT * FROM tracks WHERE playlist_id = ?;`;
  conn.query(sql, req.params.playlist_id, async (err, result) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    };
    const output = await readSong(result);
    res.status(200).json(output)
  });
};

function deleteTrack(req, res) {
  const playlistId = req.params.playlist_id;
  const trackId = req.params.track_id;
  const checkSql = 'SELECT * FROM tracks WHERE playlist_id = ? AND id = ?;';
  conn.query(checkSql, [playlistId, trackId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    };
    if (!playlistId || !trackId) {
      res.status(400).json({ message: 'Please provide playlist and track IDs.' });
      return;
    };
    if (result.length < 1) {
      res.status(400).json({ message: 'Invalid combination of Playlist and track ID.' });
      return;
    }
    const sql = 'DELETE FROM tracks WHERE id = ?;';
    conn.query(sql, trackId, (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      };
      res.status(200).json({ message: 'Song succesfully deleted from playlist.' });
    });
  });
};

module.exports = router;