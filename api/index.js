const express = require("express");
const cors = require("cors");
const app = require("express")();
const { v4 } = require("uuid");
const mongoose = require("mongoose");

require("dotenv").config();

const port = 5000;

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

app.use(cors());
app.use(express.json());

const messageSchema = new mongoose.Schema({
  user: String,
  messageBody: String,
  room: String,
  when: String,
  dateCreated: Number,
});

const Message = mongoose.model("messages", messageSchema);

app.get("/api", (_, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

app.get("/api/get-all-messages", async (_, res) => {
  const allMessages = await Message.find({});
  res.send(allMessages);
});

app.get("/api/clear-messages", async () => {
  const currentTime = Date.now();
  const allMessages = await Message.find({});
  for (const message of allMessages) {
    if (message.dateCreated && currentTime - message.dateCreated > 900000) {
      await Message.deleteOne({ _id: message._id });
    }
  }
});

app.post("/api/add-message", async (req) => {
  const message = new Message(req.body);
  const currentTime = new Date();
  const currentDate = currentTime.toLocaleString();
  message.when = currentDate;
  message.dateCreated = currentTime;
  await message.save();
});

app.listen(port, async () => {
  console.log(`Now listening on http://localhost:${port}`);
});

module.exports = app;
