const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const PORT = 3000;
const trackRouter = require("./routes/playlist-tracks.js");
const resetRouter = require("./routes/reset.js");
const playlistRouter = require("./routes/playlists.js");

app.use(express.json());
app.use(express.static("html"));
app.use(express.static("assets"));
//this is the route to user music folder
app.use(express.static("C:\\Users\\tomas\\Music\\"));
app.use("/playlist-tracks", trackRouter);
app.use("/playlists", playlistRouter);
app.use("/", resetRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`You are now listening to port ${PORT}! Enjoy!`);
});
