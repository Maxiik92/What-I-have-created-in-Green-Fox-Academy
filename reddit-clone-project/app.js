const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const PORT = 3000;
const postsRouter = require('./routes/posts.js');
const userRouter = require('./routes/user.js');

app.use(express.json());
app.use('/',postsRouter);
app.use('/',userRouter);
app.use(express.static('html/index'));
app.use(express.static('html'));

app.get('/', (req,res) => {
  res.sendFile(__dirname,"html/index/index.html")
});


app.get('/hello', (req, res) => {
  res.send("Hello World!");
})

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`You are now listening to port ${PORT}! Enjoy!`);
})