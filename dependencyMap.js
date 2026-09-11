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
const OpenFoodFacts = require("./service/OpenFoodFacts");
const MealDB = require("./service/MealDB");
const CocktailDB = require("./service/CocktailDB");
const jokeAPI = require("./service/JokeAPI");
const OfficialJoke = require("./service/OfficialJoke");
const RandomUser = require("./service/RandomUser");
const Bored = require("./service/Bored");
const DeckOfCards = require("./service/DeckOfCards");
const Chess = require("./service/Chess");

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
  openFoodFacts: new OpenFoodFacts(),
  mealDB: new MealDB(),
  cocktailDB: new CocktailDB(),
  jokeAPI: new jokeAPI(),
  officialJoke: new OfficialJoke(),
  randomUser : new RandomUser(),
  bored : new Bored(),
  deckOfCards : new DeckOfCards(),
  chess : new Chess()
};
