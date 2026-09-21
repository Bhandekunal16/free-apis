# Free APIs

A lightweight Node.js/Express service for consuming and exposing free public APIs through a unified local API.

The project currently provides thirty-three API groups:

* **Fake API** — consumes [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
* **Mock API** — consumes [DummyJSON](https://dummyjson.com/)
* **Weather API** — consumes [Open-Meteo](https://open-meteo.com/)
* **Countries API** — consumes [REST Countries](https://restcountries.com/)
* **Pokémon API** — consumes [PokéAPI](https://pokeapi.co/)
* **Rick and Morty API** — consumes [Rick and Morty API](https://rickandmortyapi.com/)
* **Cat Facts API** — consumes [Cat Facts](https://catfact.ninja/)
* **Dogs API** — consumes [Dog API](https://dog.ceo/dog-api/)
* **Jikan API** — consumes [Jikan](https://jikan.moe/)
* **CoinGecko API** — consumes [CoinGecko](https://www.coingecko.com/)
* **IPify API** — consumes [IPify](https://www.ipify.org/)
* **Agify API** — consumes [Agify](https://agify.io/)
* **Genderize API** — consumes [Genderize](https://genderize.io/)
* **Nationalize API** — consumes [Nationalize](https://nationalize.io/)
* **GitHub API** — consumes [GitHub REST API](https://docs.github.com/en/rest)
* **Open Library API** — consumes [Open Library](https://openlibrary.org/)
* **Gutenberg API** — consumes [Gutenberg Project API](https://gutendex.com/)
* **Open Food Facts API** — consumes [Open Food Facts](https://world.openfoodfacts.org/)
* **TheMealDB API** — consumes [TheMealDB](https://www.themealdb.com/)
* **TheCocktailDB API** — consumes [TheCocktailDB](https://www.thecocktaildb.com/)
* **JokeAPI** — consumes [JokeAPI](https://jokeapi.dev/)
* **Official Joke API** — consumes [Official Joke API](https://official-joke-api.appspot.com/)
* **Random User API** — consumes [Random User](https://randomuser.me/)
* **Bored API** — consumes [Bored API](https://bored-api.appbrewery.com/)
* **Deck of Cards API** — consumes [Deck of Cards API](https://deckofcardsapi.com/)
* **Chess.com API** — consumes [Chess.com Public API](https://www.chess.com/news/view/published-data-api)
* **Digimon API** — consumes [Digimon API](https://digi-api.com/)
* **Dragon Ball API** — consumes [Dragon Ball API](https://web.dragonball-api.com/)
* **Open Trivia DB API** — consumes [Open Trivia DB](https://opentdb.com/)
* **TVmaze API** — consumes [TVmaze](https://www.tvmaze.com/api)
* **Studio Ghibli API** — consumes [Studio Ghibli API](https://ghibliapi.vercel.app/)
* **OpenF1 API** — consumes [OpenF1](https://openf1.org/)
* **BallDontLie API** — consumes [BallDontLie NBA API](https://docs.balldontlie.io/)

The service acts as a simple API gateway/proxy layer, providing a consistent local endpoint structure while forwarding requests to external APIs.

---

## Features

* Express-based HTTP server
* Free public API integration
* Unified local API endpoints
* Weather API integration via Open-Meteo
* Country and region data via REST Countries
* Pokémon data and resource lookups via PokéAPI
* Rick and Morty character, location, and episode lookups
* Cat fact retrieval
* Dog images and breed lookups
* Anime, manga, character, and people data via Jikan
* Cryptocurrency prices, markets, and metadata via CoinGecko
* Public IP address lookup via IPify
* Age prediction from names via Agify
* Gender prediction from names via Genderize
* Nationality prediction from names via Nationalize
* GitHub users, repositories, searches, and repository metadata
* Book, author, edition, subject, and ISBN metadata via Open Library
* Public domain book metadata and catalog search via Gutendex
* Food product, category, brand, country, ingredient, additive, allergen, label, and packaging data via Open Food Facts
* Meal, recipe, cocktail, joke, random-user, activity, card, chess, trivia, television, animation, motorsport, Digimon, and Dragon Ball data
* NBA teams, players, games, statistics, standings, and related data via BallDontLie
* Resource validation
* ID-based resource access
* Nested resource access
* Query parameter forwarding
* JSON and binary response handling
* Request timeout protection
* Optional in-memory caching
* HTTP status propagation
* Centralized service logic
* Simple configuration through JSON files
* No database required

---

## Requirements

* Node.js 18+
* npm

Node.js 18+ is recommended because the project uses the native `fetch()` API.

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## Configuration

Application configuration is stored in:

```text
jsons/app.json
```

Example:

```json
{
  "host": "localhost",
  "port": 3000
}
```

### External APIs

External API URLs are configured in:

```text
jsons/routes.json
```

Example:

```json
{
  "fakeData": "https://jsonplaceholder.typicode.com",
  "mockData": "https://dummyjson.com",
  "openMeteo": "https://api.open-meteo.com",
  "restcountries": "https://api.restcountries.com",
  "pokemon": "https://pokeapi.co/api/v2",
  "rickAndMorty": "https://rickandmortyapi.com/api",
  "catFacts": "https://catfact.ninja",
  "dogApi": "https://dog.ceo/api",
  "jikan": "https://api.jikan.moe/v4",
  "coingecko": "https://api.coingecko.com/api/v3",
  "ipify": "https://api.ipify.org",
  "agify": "https://api.agify.io",
  "genderize": "https://api.genderize.io",
  "nationalize": "https://api.nationalize.io",
  "github": "https://api.github.com",
  "openLibrary": "https://openlibrary.org",
  "gutendex": "https://gutendex.com",
  "openFoodFacts": "https://world.openfoodfacts.org/api/v2",
  "mealDB": "https://www.themealdb.com/api/json/v1/1",
  "cocktailDB": "https://www.thecocktaildb.com/api/json/v1/1",
  "jokeAPI": "https://v2.jokeapi.dev",
  "officialJoke": "https://official-joke-api.appspot.com",
  "randomUser": "https://randomuser.me/api",
  "bored": "https://bored-api.appbrewery.com",
  "deckOfCards": "https://deckofcardsapi.com/api/deck",
  "chess": "https://api.chess.com/pub",
  "digimon": "https://digi-api.com/api/v1",
  "dragonBall": "https://dragonball-api.com/api",
  "openTrivia": "https://opentdb.com",
  "tvMaze": "https://api.tvmaze.com",
  "studioGhibli": "https://ghibliapi.vercel.app",
  "openF1": "https://api.openf1.org/v1",
  "balldontlie": "https://api.balldontlie.io/v1"
}
```

BallDontLie authentication is configured in `jsons/ballDontLie.json`:

```json
{
  "defaultTimeout": 15000,
  "key": "YOUR_BALLDONTLIE_API_KEY"
}
```

Keep the API key private and do not commit a real key to source control.

---

## Project Structure

```text
free-apis/
│
├── .vercel/
│   ├── project.json
│   └── README.txt
│
├── jsons/
│   ├── agify.json
│   ├── app.json
│   ├── ballDontLie.json
│   ├── catFacts.json
│   ├── coingecko.json
│   ├── dogApi.json
│   ├── fakeData.json
│   ├── genderize.json
│   ├── github.json
│   ├── gutendex.json
│   ├── ipify.json
│   ├── jikan.json
│   ├── mockData.json
│   ├── nationalize.json
│   ├── openFoodFacts.json
│   ├── openLibrary.json
│   ├── openMeteo.json
│   ├── mealDB.json
│   ├── cocktailDB.json
│   ├── jokeAPI.json
│   ├── officialJoke.json
│   ├── randomUser.json
│   ├── bored.json
│   ├── deckOfCards.json
│   ├── chess.json
│   ├── digimon.json
│   ├── dragonBall.json
│   ├── openTrivia.json
│   ├── tvMaze.json
│   ├── studioGhibli.json
│   ├── openF1.jsonon
│   ├── pokemon.json
│   ├── restCountries.json
│   ├── rickAndMorty.json
│   ├── OpenF1.js
│   ├── OpenTrivia.js
│   ├── StudioGhibli.js
│   ├── TvMaze.json
│   └── routes.json
│
├── service/
│   ├── agify.js
│   ├── BallDontLie.js
│   ├── Bored.js
│   ├── Chess.js
│   ├── CocktailDB.js
│   ├── DeckOfCards.js
│   ├── Digimon.js
│   ├── DragonBall.js
│   ├── catFacts.js
│   ├── coingecko.js
│   ├── dogApi.js
│   ├── fakeData.js
│   ├── genderize.js
│   ├── github.js
│   ├── gutendex.js
│   ├── JokeAPI.js
│   ├── MealDB.js
│   ├── ipify.js
│   ├── jikan.js
│   ├── mockData.js
│   ├── nationalize.js
│   ├── OfficialJoke.js
│   ├── openFoodFacts.js
│   ├── openLibrary.js
│   ├── OpenMeteo.js
│   ├── pokemon.js
│   ├── restCountries.js
│   ├── RandomUser.js
│   └── rickAndMorty.js
│
├── .gitignore
├── API.md
├── FUNCTION.md
├── README.md
├── dependencyMap.js
├── index.js
├── package-lock.json
├── package.json
├── vercel.json
└── vercel.process.sh
```

---

## Running the Server

Start the application:

```bash
node index.js
```

The server will listen on the configured host and port.

Example:

```text
http://localhost:3000
```

---

## Health Check

Request:

```http
GET /
```

Response:

```text
hello world!
```

---

# API Groups

## Fake API

The `/fake` endpoints consume data from JSONPlaceholder.

Available resources:

```text
users
posts
comments
albums
todos
photos
```

Examples:

```http
GET /fake/users
GET /fake/users/1
GET /fake/posts
GET /fake/posts/1
GET /fake/posts/1/comments
GET /fake/users/1/posts
```

Query parameters are forwarded to the upstream API.

Example:

```http
GET /fake/posts?userId=1
```

---

## Mock API

The `/mock` endpoints consume data from DummyJSON.

Available resources depend on:

```text
jsons/mockData.json
```

Example resources:

```text
products
carts
users
posts
comments
quotes
todos
recipes
ip
image
```

Examples:

```http
GET /mock/products
GET /mock/products/1
GET /mock/users
GET /mock/users/1
GET /mock/posts
```

Query parameters can be forwarded to the upstream API:

```http
GET /mock/products?limit=10
GET /mock/products?skip=10&limit=10
GET /mock/products?sortBy=price&order=asc
```

---

## Countries API

The `/countries` endpoint consumes country data from REST Countries.

The endpoint supports these lookup types:

```text
all
name
code
currency
lang
capital
region
subregion
```

Use `type` to select a lookup and `value` for every type except `all`.
The optional `fields` parameter limits the fields returned by REST Countries.

Examples:

```http
GET /countries
GET /countries?type=name&value=india
GET /countries?type=code&value=IN
GET /countries?type=region&value=asia&fields=name,capital,flags
```

---

## Pokémon API

The `/pokemon` endpoint consumes data from PokéAPI.

The `type` parameter selects a PokéAPI resource. Supported resource types
include:

```text
pokemon
ability
berry
characteristic
eggGroup
gender
growthRate
item
itemAttribute
itemCategory
itemFlingEffect
itemPocket
location
locationArea
machine
move
nature
palParkArea
pokeathlonStat
pokedex
region
stat
type
version
versionGroup
```

Use `value` to request a specific resource. `limit` and `offset` are
forwarded for list requests.

Examples:

```http
GET /pokemon
GET /pokemon?type=pokemon&value=charizard
GET /pokemon?type=move&value=thunderbolt
GET /pokemon?type=pokemon&limit=20&offset=20
```

---

## Rick and Morty API

The `/rick-and-morty` endpoint consumes data from the Rick and Morty API.

The `resource` parameter selects one of the supported resources:

```text
character
location
episode
```

Use `value` to request a specific resource. Additional query parameters are
forwarded to the upstream API, including `page` for pagination and filters
such as `name`, `status`, `species`, and `gender` for character requests.

Examples:

```http
GET /rick-and-morty
GET /rick-and-morty?resource=character&value=2
GET /rick-and-morty?resource=character&name=rick&status=alive
GET /rick-and-morty?resource=episode&value=1
```

The default resource is `character`.

---

## Cat Facts API

The `/cat-facts` endpoint consumes data from the Cat Facts API.

The `type` parameter selects the response format:

```text
fact
facts
```

The default type is `fact`. Additional query parameters are forwarded to the
upstream API, such as `max_length` for a single fact or `limit` for a list of
facts.

Examples:

```http
GET /cat-facts
GET /cat-facts?type=facts&limit=10
GET /cat-facts?type=fact&max_length=140
```

---

## Dogs API

The `/dogs` endpoint consumes data from the Dog API.

The `type` parameter selects the operation:

```text
random
randomMultiple
breedImage
breedImages
breedList
subBreeds
breedExists
```

Use `breed` for breed-specific operations and `subBreed` when required.
Additional query parameters are forwarded to the upstream API.

Examples:

```http
GET /dogs
GET /dogs?type=randomMultiple&limit=5
GET /dogs?type=breedImage&breed=hound
GET /dogs?type=breedImages&breed=bulldog
GET /dogs?type=subBreeds&breed=hound
```

The default type is `random`.

---

## Jikan API

The `/jikan` endpoint consumes anime and manga data from Jikan.

The `type` parameter selects the Jikan resource or operation. Supported
types include:

```text
anime
manga
characters
people
producers
magazines
genres
themes
demographics
animeGenres
mangaGenres
animeThemes
mangaThemes
animeFull
animeCharacters
animeStaff
animeEpisodes
animeNews
animeRecommendations
animeReviews
animePictures
animeVideos
animeRelations
animeStreaming
mangaFull
mangaCharacters
mangaNews
mangaRecommendations
mangaReviews
mangaPictures
characterFull
characterPictures
personFull
personPictures
```

Use `value` for a specific anime, manga, character, or person ID when the
selected operation requires one. Additional query parameters are forwarded to
Jikan, including filters and pagination parameters.

Examples:

```http
GET /jikan
GET /jikan?type=anime&value=1
GET /jikan?type=animeFull&value=1
GET /jikan?type=anime&limit=10&page=2
GET /jikan?type=animeCharacters&value=1
```

The default type is `anime`.

---

## CoinGecko API

The `/coingecko` endpoint consumes cryptocurrency data from CoinGecko.

The `type` parameter selects the CoinGecko operation. Supported operations
include `ping`, `simplePrice`, `coins`, `coin`, `coinMarkets`, `markets`,
`trending`, `search`, `global`, `globalDefi`, `categories`, `categoriesList`,
`exchanges`, `exchange`, `exchangeTickers`, `derivatives`,
`derivativesExchanges`, `assetPlatforms`, `nfts`, and `nft`.

Use `value` for operations that require a coin, exchange, or NFT ID. Additional
query parameters such as `ids`, `vs_currencies`, `order`, `per_page`, `page`,
and `query` are forwarded to CoinGecko.

Examples:

```http
GET /coingecko
GET /coingecko?type=simplePrice&ids=bitcoin&vs_currencies=usd
GET /coingecko?type=coin&value=bitcoin
GET /coingecko?type=markets&vs_currency=usd&order=market_cap_desc&per_page=10&page=1
GET /coingecko?type=trending
```

The default type is `ping`.

---

## IPify API

The `/ipify` endpoint returns the public IP address of the client making the
request through IPify.

The default type is `ip`. This service currently supports:

```text
ip
```

Examples:

```http
GET /ipify
GET /ipify?type=ip
```

The response may be returned as plain text or JSON depending on the upstream
content type.

---

## Agify API

The `/agify` endpoint predicts a person's age from their name using Agify.

The default type is `age`. The `name` query parameter is forwarded to the
upstream API and is required for a useful prediction.

Examples:

```http
GET /agify?name=michael
GET /agify?type=age&name=emma&country_id=US
```

---

## Genderize API

The `/genderize` endpoint predicts the likely gender of a person from their
name using Genderize.

The default type is `gender`. The `name` query parameter is forwarded to the
upstream API and is required for a useful prediction. An optional `country_id`
can improve the result.

Examples:

```http
GET /genderize?name=michael
GET /genderize?type=gender&name=emma&country_id=US
```

---

## Nationalize API

The `/nationalize` endpoint predicts the likely nationality of a person from
their name using Nationalize.

The default type is `nationality`. The `name` query parameter is forwarded to
the upstream API and is required for a useful prediction. An optional
`country_id` can narrow the result.

Examples:

```http
GET /nationalize?name=michael
GET /nationalize?type=nationality&name=emma&country_id=US
```

---

## GitHub API

The `/github` endpoint provides read-only access to GitHub users, repositories,
search endpoints, and repository metadata.

The default type is `users`. Supported types are:

```text
user, users, repos, userRepos, repoIssues, repoPulls, repoCommits,
repoBranches, repoReleases, repoTags, repoLanguages, repoContributors,
repoContents, searchRepositories, searchUsers, searchIssues, searchCommits
```

Examples:

```http
GET /github
GET /github?type=user&username=octocat
GET /github?type=repos&owner=octocat&repo=Hello-World
GET /github?type=searchRepositories&q=javascript
GET /github?type=repoIssues&owner=octocat&repo=Hello-World&state=open
```

Repository and user path values are URL-encoded. Query parameters are forwarded
to GitHub. Set `GITHUB_TOKEN` to authenticate requests and increase rate limits.

---

## Weather API

The `/weather` endpoint consumes data from Open-Meteo.

Required query parameters:

```text
latitude
longitude
```

Optional query parameters:

```text
current
hourly
daily
timezone
forecastDays
pastDays
temperatureUnit
windSpeedUnit
precipitationUnit
```

Example request:

```http
GET /weather?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&hourly=temperature_2m&daily=temperature_2m_max&forecastDays=3&timezone=auto
```

Example response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "latitude": 52.52,
    "longitude": 13.41,
    "timezone": "auto",
    "current": {
      "time": "2026-09-08T12:00",
      "temperature_2m": 21.4,
      "weather_code": 1
    },
    "hourly": {
      "time": ["2026-09-08T13:00"],
      "temperature_2m": [21.6]
    }
  }
}
```
```

---

## Open Food Facts API

The `/open-food-facts` endpoint consumes data from Open Food Facts.

Configured endpoint mappings:

```json
{
  "defaultTimeout": 15000,
  "endpoints": {
    "product": "/product/{barcode}",
    "products": "/search",
    "categories": "/categories",
    "brands": "/brands",
    "countries": "/countries",
    "ingredients": "/ingredients",
    "additives": "/additives",
    "allergens": "/allergens",
    "labels": "/labels",
    "packaging": "/packaging"
  }
}
```

The default type is `product`. The `product` type uses `value` as the barcode
path parameter. The remaining types map to their configured collection
endpoints, and query parameters are forwarded to Open Food Facts.

Examples:

```http
GET /open-food-facts
GET /open-food-facts?type=product&value=737628064502
GET /open-food-facts?type=products&search_terms=milk
GET /open-food-facts?type=categories
GET /open-food-facts?type=brands
GET /open-food-facts?type=countries
GET /open-food-facts?type=ingredients
GET /open-food-facts?type=additives
GET /open-food-facts?type=allergens
GET /open-food-facts?type=labels
GET /open-food-facts?type=packaging
```

The service applies a 15-second upstream timeout. Unsupported types and missing
required `value` for the `product` endpoint return `400`.

---

## BallDontLie API

The `/ball-dont-lie` endpoint consumes NBA data from BallDontLie. The upstream
base URL is `https://api.balldontlie.io/v1`, and the API key is read from
`jsons/ballDontLie.json`.

The `operation` parameter defaults to `games`. Supported operations are:

| Operation | Upstream path | Description |
| --- | --- | --- |
| `teams` | `/teams` | List teams |
| `team` | `/teams/{id}` | Get a team by ID |
| `players` | `/players` | List or search players |
| `player` | `/players/{id}` | Get a player by ID |
| `activePlayers` | `/players/active` | List active players |
| `games` | `/games` | List games |
| `game` | `/games/{id}` | Get a game by ID |
| `stats` | `/stats` | Get player game statistics |
| `seasonAverages` | `/season_averages` | Get season averages |
| `standings` | `/standings` | Get standings |
| `divisions` | `/divisions` | List divisions |
| `conferences` | `/conferences` | List conferences |
| `gameOdds` | `/odds` | Get game odds, subject to account access |
| `playerProps` | `/player_props` | Get player props, subject to account access |
| `plays` | `/plays` | Get play-by-play data, subject to account access |

Examples:

```http
GET /ball-dont-lie
GET /ball-dont-lie?operation=teams
GET /ball-dont-lie?operation=team&id=1
GET /ball-dont-lie?operation=players&search=LeBron
GET /ball-dont-lie?operation=activePlayers&per_page=25
GET /ball-dont-lie?operation=games&seasons[]=2025&per_page=25
GET /ball-dont-lie?operation=game&id=12345
GET /ball-dont-lie?operation=stats&seasons[]=2025&player_ids[]=115
GET /ball-dont-lie?operation=seasonAverages&season=2025&player_id=115
GET /ball-dont-lie?operation=standings&season=2025
```

`id` is required for the `team`, `player`, and `game` operations. Other query
parameters are forwarded to the selected upstream endpoint. Paginated
operations may return `meta.next_cursor`; pass it as `cursor` to request the
next page. Availability depends on the BallDontLie account tier.

---

## Open Library API

The `/open-library` endpoint provides book and library metadata. The default
type is `search`; supported types are `search`, `work`, `author`, `edition`,
`subject`, and `isbn`.

```http
GET /open-library
GET /open-library?type=search&q=harry%20potter
GET /open-library?type=work&value=OL45804W
GET /open-library?type=author&value=OL23919A
GET /open-library?type=isbn&value=9780140328721
```

## Gutendex API

The `/gutendex` endpoint provides public-domain book metadata. The default
type is `books`; supported types are `books` and `book`.

```http
GET /gutendex
GET /gutendex?type=books&search=frankenstein
GET /gutendex?type=books&page=2
GET /gutendex?type=book&value=84
```

## TheMealDB API

The `/meal-db` endpoint provides meals and recipes. The default type is
`random`; supported types are `random`, `randomSelection`, `lookup`, `search`,
`filter`, `categories`, `areas`, and `ingredients`.

```http
GET /meal-db
GET /meal-db?type=randomSelection
GET /meal-db?type=lookup&value=52772
GET /meal-db?type=search&value=Arrabiata
GET /meal-db?type=filter&category=Seafood
GET /meal-db?type=filter&area=Indian
GET /meal-db?type=filter&ingredient=Chicken
GET /meal-db?type=categories
GET /meal-db?type=areas
GET /meal-db?type=ingredients
```

## TheCocktailDB API

The `/cocktail-db` endpoint provides cocktail recipes and filters. The default
type is `random`; supported types are `random`, `randomMultiple`, `lookup`,
`search`, `filter`, `categories`, `glass`, `ingredients`, and `alcoholic`.

```http
GET /cocktail-db
GET /cocktail-db?type=randomMultiple
GET /cocktail-db?type=lookup&value=11007
GET /cocktail-db?type=search&value=margarita
GET /cocktail-db?type=filter&ingredient=Gin
GET /cocktail-db?type=filter&category=Cocktail
GET /cocktail-db?type=filter&alcoholic=Alcoholic
GET /cocktail-db?type=filter&glass=Cocktail_glass
GET /cocktail-db?type=categories
GET /cocktail-db?type=glass
GET /cocktail-db?type=ingredients
GET /cocktail-db?type=alcoholic
```

## JokeAPI

The `/joke-api` endpoint provides jokes. The default type is `random`;
supported types are `random`, `joke`, `category`, `categories`, and `filter`.
JokeAPI parameters such as `amount`, `blacklistFlags`, `safe`, and `lang` are
forwarded.

```http
GET /joke-api
GET /joke-api?type=random&value=Programming
GET /joke-api?type=category&value=Programming
GET /joke-api?type=categories&value=Programming,Misc
GET /joke-api?type=filter&value=Programming&blacklistFlags=nsfw,religious&safe=true
GET /joke-api?type=joke&value=123
```

## Official Joke API

The `/official-joke` endpoint provides jokes. The default type is `random`;
supported types are `random`, `randomTen`, `ten`, `randomMultiple`, `types`,
`byType`, and `joke`.

```http
GET /official-joke
GET /official-joke?type=randomTen
GET /official-joke?type=ten
GET /official-joke?type=randomMultiple&value=5
GET /official-joke?type=types
GET /official-joke?type=byType&value=programming&mode=ten
GET /official-joke?type=joke&value=1
```

## Random User API

The `/random-user` endpoint generates random profiles. The default type is
`random`; `results`, `gender`, `nat`, `seed`, `page`, `inc`, `exc`, `format`,
and `noinfo` are forwarded to the upstream API.

```http
GET /random-user
GET /random-user?results=10&nat=in
GET /random-user?gender=female
GET /random-user?results=10&inc=name,email,picture
GET /random-user?results=10&seed=foobar&page=2
```

## Bored API

The `/bored` endpoint provides activities. The local `operation` defaults to
`random`; supported operations are `random`, `filter`, and `activity`.

```http
GET /bored
GET /bored?operation=filter&type=education
GET /bored?operation=filter&participants=2
GET /bored?operation=activity&value=3943506
```

## Deck of Cards API

The `/deck-of-cards` endpoint manages card decks. The default operation is
`newShuffle`; supported operations are `new`, `newShuffle`, `draw`, `shuffle`,
`return`, `pileAdd`, `pileShuffle`, `pileList`, `pileDraw`, and `pileReturn`.

```http
GET /deck-of-cards
GET /deck-of-cards?operation=new
GET /deck-of-cards?operation=newShuffle&deckCount=2
GET /deck-of-cards?operation=draw&deckId=3p40paa87x90&count=2
GET /deck-of-cards?operation=shuffle&deckId=3p40paa87x90&remaining=true
GET /deck-of-cards?operation=pileAdd&deckId=3p40paa87x90&pileName=discard&cards=AS,2S
GET /deck-of-cards?operation=pileDraw&deckId=3p40paa87x90&pileName=discard&count=2
```

Existing-deck operations require `deckId`; pile operations require
`deckId` and `pileName`.

## Chess.com Public API

The `/chess` endpoint provides Chess.com player, club, country, puzzle,
leaderboard, titled-player, streamer, and game data. The default type is
`dailyPuzzle`.

Supported types are `dailyPuzzle`, `randomPuzzle`, `puzzle`, `player`,
`playerStats`, `playerArchives`, `playerGames`, `club`, `clubMembers`,
`clubMatches`, `country`, `countryPlayers`, `countryClubs`, `titled`,
`leaderboards`, and `streamers`.

```http
GET /chess
GET /chess?type=randomPuzzle
GET /chess?type=player&username=hikaru
GET /chess?type=playerStats&username=hikaru
GET /chess?type=playerGames&username=hikaru&year=2026&month=08
GET /chess?type=countryPlayers&country=IN
GET /chess?type=titled&title=GM
GET /chess?type=leaderboards
GET /chess?type=streamers
GET /chess?type=clubMembers&club=chess-com
```

## Digimon API

The `/digimon` endpoint provides Digimon data, attributes, fields, levels,
types, and skills. The default type is `digimon`; supported types are
`digimon`, `attribute`, `field`, `level`, `type`, and `skill`.

```http
GET /digimon
GET /digimon?type=digimon&value=Agumon
GET /digimon?type=digimon&name=Agumon&level=Rookie
GET /digimon?type=digimon&page=2&pageSize=20
GET /digimon?type=attribute
GET /digimon?type=skill&value=1
```

## Dragon Ball API

The `/dragon-ball` endpoint provides characters, planets, and transformations.
The default type is `characters`; supported types are `characters`, `character`,
`planets`, `planet`, `transformations`, and `transformation`.

```http
GET /dragon-ball
GET /dragon-ball?type=characters&page=2&limit=10
GET /dragon-ball?type=characters&name=Goku&race=Saiyan
GET /dragon-ball?type=character&value=1
GET /dragon-ball?type=planets&isDestroyed=true
GET /dragon-ball?type=planet&value=1
GET /dragon-ball?type=transformations
GET /dragon-ball?type=transformation&value=1
```

## Open Trivia DB API

The `/open-trivia` endpoint provides trivia questions and metadata. The local
`operation` defaults to `questions`; supported operations are `questions`,
`categories`, `categoryCount`, `globalCount`, and `token`.

```http
GET /open-trivia
GET /open-trivia?operation=questions&amount=10&difficulty=easy&type=multiple
GET /open-trivia?operation=questions&category=18&type=boolean
GET /open-trivia?operation=categories
GET /open-trivia?operation=categoryCount&value=18
GET /open-trivia?operation=globalCount
GET /open-trivia?operation=token
GET /open-trivia?operation=token&command=reset&token=YOUR_TOKEN
```

## TVmaze API

The `/tv-maze` endpoint provides shows, episodes, cast, crew, people, and
schedules. The default type is `searchShows`; supported types are
`searchShows`, `singleSearch`, `lookupShow`, `show`, `showEpisodes`,
`showCast`, `showCrew`, `showSeasons`, `episode`, `searchPeople`, `schedule`,
`webSchedule`, and `shows`.

```http
GET /tv-maze
GET /tv-maze?type=searchShows&q=breaking%20bad
GET /tv-maze?type=singleSearch&q=friends
GET /tv-maze?type=lookupShow&imdb=tt0944947
GET /tv-maze?type=show&value=82
GET /tv-maze?type=showEpisodes&value=82
GET /tv-maze?type=searchPeople&q=lauren
GET /tv-maze?type=schedule&country=US&date=2026-09-17
GET /tv-maze?type=shows&page=1
```

## Studio Ghibli API

The `/studio-ghibli` endpoint provides films, people, locations, species, and
vehicles. The default type is `films`; supported types are `films`, `film`,
`people`, `person`, `locations`, `location`, `species`, `specie`, `vehicles`,
and `vehicle`.

```http
GET /studio-ghibli
GET /studio-ghibli?type=film&value=FILM_ID
GET /studio-ghibli?type=people
GET /studio-ghibli?type=person&value=PERSON_ID
GET /studio-ghibli?type=locations
GET /studio-ghibli?type=species
GET /studio-ghibli?type=vehicle&value=VEHICLE_ID
```

## OpenF1 API

The `/open-f1` endpoint provides Formula 1 sessions, meetings, drivers, laps,
telemetry, intervals, locations, pit stops, positions, race control, starting
grids, stints, team radio, weather, results, and overtakes. The local
`operation` defaults to `sessions`; filters such as `session_key`,
`meeting_key`, `driver_number`, `year`, and `date` are forwarded.

Supported operations are `carData`, `drivers`, `intervals`, `laps`, `location`,
`meetings`, `overtakes`, `pit`, `position`, `raceControl`, `sessions`,
`startingGrid`, `stints`, `teamRadio`, `weather`, and `sessionResult`.

```http
GET /open-f1
GET /open-f1?operation=sessions&year=2025
GET /open-f1?operation=meetings&year=2025
GET /open-f1?operation=drivers&session_key=latest
GET /open-f1?operation=laps&session_key=latest&driver_number=1
GET /open-f1?operation=weather&session_key=latest
GET /open-f1?operation=position&session_key=latest
```

---

# Request Flow

A request follows this flow:

```text
Client
  │
  ▼
Express Router
  │
  ▼
Controller
  │
  ▼
Service
  │
  ├── Validate resource
  │
  ├── Build upstream URL
  │
  ├── Check cache
  │
  ├── Fetch external API
  │
  ├── Parse response
  │
  └── Construct response
  │
  ▼
Client
```

---

# Error Handling

Invalid resources return a `400` response.

Example:

```http
GET /fake/invalid
```

Response:

```json
{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "Invalid resource 'invalid'"
}
```

If an upstream API returns an error, the upstream HTTP status is propagated where possible.

---

# Response Types

The service supports:

* JSON
* text
* HTML
* XML
* binary data
* images
* PDFs
* other `application/octet-stream` responses

JSON responses are returned as JavaScript objects/arrays.

Binary responses are represented internally as Node.js `Buffer` objects.

---

# Performance

The service is designed to minimize unnecessary upstream requests.

Where enabled, responses are cached in memory:

```text
Request
   │
   ▼
Cache
 ┌─┴──────────────┐
 │                │
Hit              Miss
 │                │
 ▼                ▼
Response       External API
                  │
                  ▼
                Cache
```

Cache configuration is controlled by the service configuration.

---

# Security Considerations

This service is intended primarily for development, testing, learning, and API experimentation.

Before exposing it publicly, consider adding:

* authentication
* rate limiting
* request size limits
* CORS configuration
* upstream allowlists
* logging
* API keys where required
* cache size limits
* request validation

---

# Development

The project intentionally keeps controllers thin and moves API logic into service classes.

Recommended separation:

```text
Controller
    ↓
Service
    ↓
External API
```

Controllers should handle HTTP concerns.

Services should handle:

* validation
* URL construction
* HTTP requests
* response parsing
* caching
* error handling

---

# License

Use and modify this project according to the license included with the repository.
