const express = require("express");
const router = express.Router();
router.use(express.json());
const conn = require("../db.js");

const { promisify } = require("util");
const { resolve } = require("path");
const fs = require("fs");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

router.get("/reset", truncateTables);
router.get("/create", sqlInject);

//path to mp3files in pc
const path = "C:\\Users\\tomas\\Music";

function truncateTables(req, res) {
  const sqlTracks = "TRUNCATE TABLE alltracks;";
  conn.query(sqlTracks, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.status(200).json({ result });
  });
}

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f), []);
}

async function getString(directory) {
  const tracks = await getFiles(directory)
    .then((files) =>
      files.filter(function (file) {
        let mp3s = [];
        if (!file.includes(".mp3")) {
          mp3s.push(file);
          return;
        }
        return mp3s;
      })
    )
    .catch((e) => console.error(e));
  let allTracks = "";
  for (let track of tracks) {
    allTracks += `("${track}",'1'),`;
  }
  let result = allTracks.slice(0, -1).replace(/\\/g, "\\\\");
  return result;
}
async function sqlInject(req, res) {
  const tracks = await getString(path);
  const allsql = `INSERT INTO alltracks (path, playlist_id) VALUES ${tracks};`;
  conn.query(allsql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    const sql = `INSERT INTO tracks (path, playlist_id) 
    SELECT alltracks.path, alltracks.playlist_id 
    FROM alltracks WHERE NOT EXISTS
    (SELECT path FROM tracks WHERE tracks.path = alltracks.path AND tracks.playlist_id = alltracks.playlist_id);`;
    conn.query(sql, (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.status(200).json({ result });
    });
  });
}

module.exports = router;
