const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = require("express")();
const {v4} = require("uuid");


const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://MaxS713:nwcc4cJr0mTYpju4@cluster0.bgmkx.mongodb.net/messages"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));

app.use(cors());
app.use(express.json());

const messageSchema = new mongoose.Schema({
  user: String,
  messageBody: String,
  room: String,
  when: String,
});

const Message = mongoose.model("messages", messageSchema);


app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
  const {slug} = req.params;
  res.end(`Item: ${slug}`);
});

app.get("/api/get-all-messages", async (req, res) => {
  let allMessages = await Message.find({});
  res.send(allMessages);
});

app.post("/api/add-message", async (req, res) => {
  let message = new Message(req.body);
  let currentDate = new Date().toLocaleString();
  message.when = currentDate
  await message.save();
});

app.listen(port, () => {
  console.log("Now listening on http://localhost:" + port);
});

module.exports = app;