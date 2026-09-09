const express = require("express");
const cors = require("cors");
const { host, port } = require("./jsons/app.json");
const faker = require("./fakeData");
const mock = require("./mockData");
const OpenMeteo = require("./OpenMeteo");
const RestCountries = require("./restCountries");
const Pokemon = require("./pokemon");
const RickAndMorty = require("./rickAndMorty");
const CatFacts = require("./catFacts");
const DogApi = require("./dogApi");
const Jikan = require("./jikan");
const Coingecko = require("./coingecko");

const restCountries = new RestCountries();
const fakeData = new faker();
const mockData = new mock();
const openMeteo = new OpenMeteo();
const pokemon = new Pokemon();
const rickAndMorty = new RickAndMorty();
const catFacts = new CatFacts();
const dogApi = new DogApi();
const jikan = new Jikan();
const coingecko = new Coingecko();

const app = express();
app.use(express.json());
app.use(cors());

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

app.get("/weather", async (req, res) => {
  const {
    latitude,
    longitude,

    current,
    hourly,
    daily,

    timezone,
    forecastDays,
    pastDays,

    temperatureUnit,
    windSpeedUnit,
    precipitationUnit,
  } = req.query;

  const data = await openMeteo.init({
    latitude,
    longitude,

    current,
    hourly,
    daily,

    timezone,
    forecastDays,
    pastDays,

    temperatureUnit,
    windSpeedUnit,
    precipitationUnit,
  });

  res.status(data.statusCode ?? 200).json(data);
});

app.get("/countries", async (req, res) => {
  const data = await restCountries.init({
    type: req.query.type ?? "all",
    value: req.query.value,
    query: {
      fields: req.query.fields,
    },
  });

  res.status(data.statusCode ?? 200).json(data);
});

app.get("/pokemon", async (req, res) => {
  const { type, value, limit, offset } = req.query;

  const data = await pokemon.init({
    type,
    value,

    query: {
      limit,
      offset,
    },
  });

  res.status(data.statusCode ?? 200).json(data);
});

app.get("/rick-and-morty", async (req, res) => {
  const { resource = "character", value, id, ...query } = req.query;

  const data = await rickAndMorty.init({
    type: resource,
    value,
    id,
    query,
  });

  res.status(data.statusCode ?? 200).json(data);
});

app.get("/cat-facts", async (req, res) => {
  const { type = "fact", ...query } = req.query;

  const data = await catFacts.init({
    type,
    query,
  });

  res.status(data.statusCode ?? 200).json(data);
});

app.get("/dogs", async (req, res) => {
  const { type = "random", breed, subBreed, ...query } = req.query;
  const data = await dogApi.init({
    type,
    breed,
    subBreed,
    query,
  });
  res.status(data.statusCode ?? 200).json(data);
});

app.get("/jikan", async (req, res) => {
  const { type = "anime", value, ...query } = req.query;

  const data = await jikan.init({
    type,
    value,
    query,
  });

  res.status(data.statusCode ?? 200).json(data);
});

app.get("/coingecko", async (req, res) => {
  const { type = "ping", value, ...query } = req.query;

  const data = await coingecko.init({
    type,
    value,
    query,
  });

  res.status(data.statusCode ?? 200).json(data);
});

app.use((_, res) => {
  res.status(404).send("not found");
});

app.listen(port, host, () => {
  console.log(`http://${host}:${port}`);
});
