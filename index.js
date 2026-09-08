const express = require("express");
const { host, port } = require("./jsons/app.json");
const faker = require("./fakeData");
const mock = require("./mockData");

const fakeData = new faker();
const mockData = new mock();

const app = express();
app.use(express.json());

app.get("", (_, res) => {
  res.status(200).send("hello world!");
});

app.get("/fake/:type", async (req, res) => {
  const data = await fakeData.init({
    type: req.params.type,
    query: req.query,
  });

  res.status(data.statusCode).json(data);
});
app.get("/fake/:type/:id", async (req, res) => {
  const data = await fakeData.init({
    type: req.params.type,
    id: req.params.id,
    query: req.query,
  });

  res.status(data.statusCode).json(data);
});

app.get("/fake/:type/:id/:subtype", async (req, res) => {
  const data = await fakeData.init({
    type: req.params.type,
    id: req.params.id,
    subtype: req.params.subtype,
    query: req.query,
  });

  res.status(data.statusCode).json(data);
});

app.get("/mock/:type", async (req, res) => {
  const data = await mockData.init({
    type: req.params.type,
    query: req.query,
  });
  res.status(data.statusCode ?? 200).json(data);
});

app.get("/mock/:type/:id", async (req, res) => {
  const data = await mockData.init({
    type: req.params.type,
    id: req.params.id,
    query: req.query,
  });

  res.status(data.statusCode ?? 200).json(data);
});

app.use((_, res) => {
  res.status(404).send("not found");
});

app.listen(port, host, () => {
  console.log(`http://${host}:${port}`);
});
