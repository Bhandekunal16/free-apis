const [faker, mock] = [
  require("./service/fakeData"),
  require("./service/mockData"),
];

const OpenMeteo = require("./service/OpenMeteo");
const RestCountries = require("./service/restCountries");
const Pokemon = require("./service/pokemon");
const RickAndMorty = require("./service/rickAndMorty");
const CatFacts = require("./service/catFacts");
const DogApi = require("./service/dogApi");
const Jikan = require("./service/jikan");
const Coingecko = require("./service/coingecko");
const Ipify = require("./service/ipify");
const Agify = require("./service/agify");
const Genderize = require("./service/genderize");
const Nationalize = require("./service/nationalize");
const Github = require("./service/github");
const OpenLibrary = require("./service/openLibrary");
const Gutendex = require("./service/gutendex");

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
const ipify = new Ipify();
const agify = new Agify();
const genderize = new Genderize();
const nationalize = new Nationalize();
const github = new Github();
const openLibrary = new OpenLibrary();
const gutendex = new Gutendex();

module.exports = {
  github,
  nationalize,
  restCountries,
  fakeData,
  openMeteo,
  mockData,
  pokemon,
  rickAndMorty,
  catFacts,
  dogApi,
  jikan,
  coingecko,
  ipify,
  agify,
  genderize,
  openLibrary,
  gutendex,
};
