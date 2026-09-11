# API Documentation

## Base URL

```text
http://localhost:3000
```

Replace the host and port with the values configured in:

```text
jsons/app.json
```

---

# 1. Health Check

## `GET /`

Checks whether the server is running.

### Request

```http
GET /
```

### Response

```text
hello world!
```

### Status

```text
200 OK
```

---

# 2. Fake API

The Fake API provides access to resources from JSONPlaceholder.

Configured upstream API:

```text
https://jsonplaceholder.typicode.com
```

---

## Available Resources

```text
users
posts
comments
albums
todos
photos
```

---

## Get Collection

```http
GET /fake/:type
```

### Parameters

| Parameter | Location | Required | Description       |
| --------- | -------- | -------: | ----------------- |
| `type`    | path     |      Yes | Fake API resource |

### Example

```http
GET /fake/users
```

```http
GET /fake/posts
```

```http
GET /fake/comments
```

### Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "Leanne Graham"
    }
  ],
  "length": 10,
  "statusCode": 200,
  "status": true
}
```

---

## Get Resource by ID

```http
GET /fake/:type/:id
```

### Parameters

| Parameter | Location | Required | Description   |
| --------- | -------- | -------: | ------------- |
| `type`    | path     |      Yes | Resource type |
| `id`      | path     |      Yes | Resource ID   |

### Example

```http
GET /fake/users/1
```

```http
GET /fake/posts/1
```

### Response

```json
{
  "success": true,
  "statusCode": 200,
  "status": true,
  "data": {
    "id": 1,
    "name": "Leanne Graham"
  },
  "length": 1,
  "type": "object"
}
```

---

## Nested Resource

```http
GET /fake/:type/:id/:subtype
```

This endpoint supports JSONPlaceholder nested resources.

### Examples

```http
GET /fake/posts/1/comments
```

```http
GET /fake/users/1/posts
```

```http
GET /fake/albums/1/photos
```

### Request Structure

```text
/fake/{resource}/{id}/{nested-resource}
```

Example:

```text
/fake/posts/1/comments
```

means:

```text
posts
  └── post 1
       └── comments
```

---

## Fake API Query Parameters

Query parameters are forwarded to JSONPlaceholder.

### Example

```http
GET /fake/posts?userId=1
```

This allows filtering posts belonging to user `1`.

Another example:

```http
GET /fake/comments?postId=1
```

---

# 3. Mock API

The Mock API provides access to DummyJSON.

Configured upstream API:

```text
https://dummyjson.com
```

---

## Available Resources

The available resources are configured in:

```text
jsons/mockData.json
```

Example:

```json
{
  "params": [
    "products",
    "carts",
    "users",
    "posts",
    "comments",
    "quotes",
    "todos",
    "recipes",
    "ip",
    "image"
  ]
}
```

---

## Get Collection

```http
GET /mock/:type
```

### Example

```http
GET /mock/products
```

```http
GET /mock/users
```

```http
GET /mock/posts
```

---

## Get Resource by ID

```http
GET /mock/:type/:id
```

### Example

```http
GET /mock/products/1
```

```http
GET /mock/users/1
```

```http
GET /mock/posts/1
```

---

## Query Parameters

Query parameters are forwarded to the upstream API.

### Pagination

```http
GET /mock/products?limit=10
```

```http
GET /mock/products?skip=10&limit=10
```

### Selecting Fields

```http
GET /mock/products?select=title,price
```

### Sorting

```http
GET /mock/products?sortBy=price&order=asc
```

### Multiple Parameters

```http
GET /mock/products?limit=10&skip=20&sortBy=price&order=desc
```

---

# 4. Countries API

The Countries API provides access to country data from REST Countries.

Configured upstream API:

```text
https://restcountries.com
```

## Get Countries

```http
GET /countries
```

The default request uses the `all` lookup and returns all available countries.

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Lookup type: `all`, `name`, `code`, `currency`, `lang`, `capital`, `region`, or `subregion`; defaults to `all` |
| `value` | Conditional | Lookup value; required when `type` is not `all` |
| `fields` | No | Comma-separated list of fields to return |

### Examples

```http
GET /countries
```

```http
GET /countries?type=name&value=india
```

```http
GET /countries?type=code&value=IN&fields=name,capital,flags
```

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "contentType": "application/json",
  "url": "https://restcountries.com/v3.1/name/india",
  "data": [
    {
      "name": {
        "common": "India",
        "official": "Republic of India"
      },
      "capital": ["New Delhi"],
      "region": "Asia"
    }
  ]
}
```

An invalid lookup type or a missing required value returns `400`.

---

# 5. Pokémon API

The Pokémon API provides access to PokéAPI resources.

Configured upstream API:

```text
https://pokeapi.co/api/v2
```

## Get Pokémon Data

```http
GET /pokemon
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | PokéAPI resource type; defaults to `pokemon` |
| `value` | No | Resource name or ID |
| `limit` | No | Number of list results to return |
| `offset` | No | Number of list results to skip |

Supported resource types are `pokemon`, `ability`, `berry`, `characteristic`,
`eggGroup`, `gender`, `growthRate`, `item`, `itemAttribute`, `itemCategory`,
`itemFlingEffect`, `itemPocket`, `location`, `locationArea`, `machine`, `move`,
`nature`, `palParkArea`, `pokeathlonStat`, `pokedex`, `region`, `stat`, `type`,
`version`, and `versionGroup`.

### Examples

```http
GET /pokemon
```

```http
GET /pokemon?type=pokemon&value=charizard
```

```http
GET /pokemon?type=move&value=thunderbolt
```

```http
GET /pokemon?type=pokemon&limit=20&offset=20
```

The service returns the upstream response inside a standardized response
envelope. Invalid resource types return `400`; upstream errors and timeouts
are propagated as documented below.

---

# 6. Rick and Morty API

The Rick and Morty API provides access to characters, locations, and
episodes.

Configured upstream API:

```text
https://rickandmortyapi.com/api
```

## Get Rick and Morty Data

```http
GET /rick-and-morty
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `resource` | No | Resource type: `character`, `location`, or `episode`; defaults to `character` |
| `value` | No | Resource name or ID |
| `page` | No | Page number for list requests |
| `name` | No | Character name filter |
| `status` | No | Character status filter |
| `species` | No | Character species filter |
| `gender` | No | Character gender filter |
| `type` | No | Character type filter |
| `dimension` | No | Location dimension filter |
| `episode` | No | Episode code filter |

All query parameters other than `resource` and `value` are forwarded to the
upstream API.

### Examples

```http
GET /rick-and-morty
```

```http
GET /rick-and-morty?resource=character&value=2
```

```http
GET /rick-and-morty?resource=character&name=rick&status=alive
```

```http
GET /rick-and-morty?resource=episode&value=1
```

The default resource is `character`. Invalid resource types return `400`;
upstream errors and timeouts are propagated as documented below.

---

# 7. Cat Facts API

The Cat Facts API provides random cat facts and collections of cat facts.

Configured upstream API:

```text
https://catfact.ninja
```

## Get Cat Facts

```http
GET /cat-facts
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Response type: `fact` or `facts`; defaults to `fact` |
| `max_length` | No | Maximum length for a single fact |
| `limit` | No | Number of facts for the `facts` response |
| `page` | No | Page number for the `facts` response |

Additional query parameters are forwarded to the upstream API.

### Examples

```http
GET /cat-facts
```

```http
GET /cat-facts?type=facts&limit=10
```

```http
GET /cat-facts?type=fact&max_length=140
```

The default response type is `fact`. Invalid response types return `400`;
upstream errors and timeouts are propagated as documented below.

---

# 8. Dogs API

The Dogs API provides dog images and breed information through the Dog API.

Configured upstream API:

```text
https://dog.ceo/api
```

## Get Dog Data

```http
GET /dogs
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Operation type; defaults to `random` |
| `breed` | Conditional | Breed name for breed-specific operations |
| `subBreed` | Conditional | Sub-breed name when required |
| `limit` | No | Number of results for supported list operations |

Supported operation types are `random`, `randomMultiple`, `breedImage`,
`breedImages`, `breedList`, `subBreeds`, and `breedExists`.

### Examples

```http
GET /dogs
```

```http
GET /dogs?type=randomMultiple&limit=5
```

```http
GET /dogs?type=breedImage&breed=hound
```

```http
GET /dogs?type=breedImages&breed=bulldog
```

```http
GET /dogs?type=subBreeds&breed=hound
```

The default operation is `random`. Breed-specific operations require
`breed`; invalid operation types or missing required values return `400`.

---

# 9. Jikan API

The Jikan API provides access to MyAnimeList data for anime, manga,
characters, and people.

Configured upstream API:

```text
https://api.jikan.moe/v4
```

## Get Jikan Data

```http
GET /jikan
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Jikan resource or operation; defaults to `anime` |
| `value` | Conditional | Anime, manga, character, or person ID when required |
| `limit` | No | Number of list results |
| `page` | No | Page number for paginated results |

Supported types include `anime`, `manga`, `characters`, `people`, `producers`,
`magazines`, `genres`, `themes`, `demographics`, `animeGenres`, `mangaGenres`,
`animeThemes`, `mangaThemes`, `animeFull`, `animeCharacters`, `animeStaff`,
`animeEpisodes`, `animeNews`, `animeRecommendations`, `animeReviews`,
`animePictures`, `animeVideos`, `animeRelations`, `animeStreaming`, `mangaFull`,
`mangaCharacters`, `mangaNews`, `mangaRecommendations`, `mangaReviews`,
`mangaPictures`, `characterFull`, `characterPictures`, `personFull`, and
`personPictures`.

### Examples

```http
GET /jikan
```

```http
GET /jikan?type=anime&value=1
```

```http
GET /jikan?type=animeFull&value=1
```

```http
GET /jikan?type=anime&limit=10&page=2
```

```http
GET /jikan?type=animeCharacters&value=1
```

The default type is `anime`. Operations containing an ID placeholder require
`value`; invalid types or missing required values return `400`.

---

# 10. CoinGecko API

The CoinGecko API provides cryptocurrency prices, market data, and metadata.

Configured upstream API:

```text
https://api.coingecko.com/api/v3
```

## Get CoinGecko Data

```http
GET /coingecko
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | CoinGecko operation; defaults to `ping` |
| `value` | Conditional | Coin, exchange, or NFT ID when required |
| `ids` | No | Comma-separated coin IDs |
| `vs_currency` | No | Target fiat or crypto currency |
| `vs_currencies` | No | Target currencies for simple prices |
| `order` | No | Market sorting order |
| `per_page` | No | Results per page |
| `page` | No | Page number |
| `query` | No | Search term |

Supported operations include `ping`, `simplePrice`, `coins`, `coin`,
`coinMarkets`, `markets`, `trending`, `search`, `global`, `globalDefi`,
`categories`, `categoriesList`, `exchanges`, `exchange`, `exchangeTickers`,
`derivatives`, `derivativesExchanges`, `assetPlatforms`, `nfts`, and `nft`.

### Examples

```http
GET /coingecko
```

```http
GET /coingecko?type=simplePrice&ids=bitcoin&vs_currencies=usd
```

```http
GET /coingecko?type=coin&value=bitcoin
```

```http
GET /coingecko?type=markets&vs_currency=usd&order=market_cap_desc&per_page=10&page=1
```

```http
GET /coingecko?type=trending
```

The default type is `ping`. Operations containing an ID placeholder require
`value`; invalid types or missing required values return `400`.

---

# 11. IPify API

The IPify API returns the public IP address of the requesting client.

Configured upstream API:

```text
https://api.ipify.org
```

## Get Public IP

```http
GET /ipify
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Response operation; currently `ip`, defaults to `ip` |

### Examples

```http
GET /ipify
```

```http
GET /ipify?type=ip
```

The response is normalized into the standard service envelope. Depending on
the upstream content type, `data` contains either the IP text or a parsed JSON
value.

---

# 12. Agify API

The Agify API predicts the likely age of a person from their name.

Configured upstream API:

```text
https://api.agify.io
```

## Predict Age

```http
GET /agify
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Response operation; currently `age`, defaults to `age` |
| `name` | Yes | Name used for the age prediction |
| `country_id` | No | Two-letter country code used to improve the prediction |

Additional query parameters are forwarded to Agify.

### Examples

```http
GET /agify?name=michael
```

```http
GET /agify?type=age&name=emma&country_id=US
```

The default type is `age`. Invalid operation types return `400`; missing
`name` may result in an upstream validation error.

---

# 13. Genderize API

The Genderize API predicts the likely gender of a person from their name.

Configured upstream API:

```text
https://api.genderize.io
```

## Predict Gender

```http
GET /genderize
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Response operation; currently `gender`, defaults to `gender` |
| `name` | Yes | Name used for the gender prediction |
| `country_id` | No | Two-letter country code used to improve the prediction |

Additional query parameters are forwarded to Genderize.

### Examples

```http
GET /genderize?name=michael
```

```http
GET /genderize?type=gender&name=emma&country_id=US
```

The default type is `gender`. Invalid operation types return `400`; missing
`name` may result in an upstream validation error.

---

# 14. Nationalize API

The Nationalize API predicts the likely nationality of a person from their
name.

Configured upstream API:

```text
https://api.nationalize.io
```

## Predict Nationality

```http
GET /nationalize
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Response operation; currently `nationality`, defaults to `nationality` |
| `name` | Yes | Name used for the nationality prediction |
| `country_id` | No | Two-letter country code used to narrow the prediction |

Additional query parameters are forwarded to Nationalize.

### Examples

```http
GET /nationalize?name=michael
```

```http
GET /nationalize?type=nationality&name=emma&country_id=US
```

The default type is `nationality`. Invalid operation types return `400`;
missing `name` may result in an upstream validation error.

---

# 15. GitHub API

The GitHub API provides read-only access to users, repositories, searches, and
repository metadata.

Configured upstream API:

```text
https://api.github.com
```

## Supported Types

| Type | Required parameters | Description |
| ---- | ------------------- | ----------- |
| `user` | `username` or `value` | Get one user |
| `users` | None | List users |
| `repos` | `owner`, `repo` | Get repository details |
| `userRepos` | `username` or `value` | List a user's repositories |
| `repoIssues` | `owner`, `repo` | List repository issues |
| `repoPulls` | `owner`, `repo` | List pull requests |
| `repoCommits` | `owner`, `repo` | List commits |
| `repoBranches` | `owner`, `repo` | List branches |
| `repoReleases` | `owner`, `repo` | List releases |
| `repoTags` | `owner`, `repo` | List tags |
| `repoLanguages` | `owner`, `repo` | Get repository languages |
| `repoContributors` | `owner`, `repo` | List contributors |
| `repoContents` | `owner`, `repo` | Get repository contents |
| `searchRepositories` | Query `q` | Search repositories |
| `searchUsers` | Query `q` | Search users |
| `searchIssues` | Query `q` | Search issues |
| `searchCommits` | Query `q` | Search commits |

## Examples

```http
GET /github
GET /github?type=user&username=octocat
GET /github?type=repos&owner=octocat&repo=Hello-World
GET /github?type=searchRepositories&q=javascript
GET /github?type=repoIssues&owner=octocat&repo=Hello-World&state=open
```

The default type is `users`. Invalid types or missing path parameters return
`400`. Query parameters are forwarded to GitHub. Set the `GITHUB_TOKEN`
environment variable to authenticate requests and increase rate limits.
Requests use a 15-second timeout.

---

# 16. Open Library API

The Open Library API provides book, edition, author, subject, and ISBN metadata.

Configured upstream API:

```text
https://openlibrary.org
```

## Supported Types

| Type | Required parameters | Description |
| ---- | ------------------- | ----------- |
| `search` | Optional `q` or `title` | Search by query string |
| `work` | `value` | Get a work by Open Library ID |
| `edition` | `value` | Get an edition by Open Library ID |
| `author` | `value` | Get an author by Open Library ID |
| `subject` | `value` | Get a subject listing |
| `isbn` | `value` | Get ISBN metadata |

## Examples

```http
GET /open-library
GET /open-library?type=search&q=pride+and+prejudice
GET /open-library?type=work&value=OL45804W
GET /open-library?type=edition&value=OL7353617M
GET /open-library?type=author&value=OL23919A
GET /open-library?type=subject&value=science_fiction
GET /open-library?type=isbn&value=9780140328721
```

The default type is `search`. When a type requires an identifier, the service
validates that `value` is present and returns `400` if it is missing. Query
parameters are forwarded to Open Library, and a 15-second timeout is applied to
upstream requests.

---

# 17. Gutendex API

The Gutendex API provides public-domain book metadata and catalog search from
the Project Gutenberg collection.

Configured upstream API:

```text
https://gutendex.com
```

## Supported Types

| Type | Required parameters | Description |
| ---- | ------------------- | ----------- |
| `books` | None | List books with optional filters |
| `book` | `value` | Get a specific book by ID |

## Examples

```http
GET /gutendex
GET /gutendex?type=books&search=frankenstein
GET /gutendex?type=book&value=11
```

The default type is `books`. When a type requires an identifier, the service
validates that `value` is present and returns `400` if it is missing. Query
parameters are forwarded to Gutendex, and a 15-second timeout is applied to
upstream requests.

---

# 18. Open Food Facts API

The Open Food Facts API exposes product, product search, category, brand,
country, ingredient, additive, allergen, label, and packaging data.

Configured upstream API:

```text
https://world.openfoodfacts.org/api/v2
```

## Endpoint Configuration

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

## Supported Types

| Type | Upstream path | Required parameters | Description |
| ---- | ------------- | -------------------- | ----------- |
| `product` | `/product/{barcode}` | `value` | Get product details by barcode |
| `products` | `/search` | None | Search products |
| `categories` | `/categories` | None | List product categories |
| `brands` | `/brands` | None | List brands |
| `countries` | `/countries` | None | List countries |
| `ingredients` | `/ingredients` | None | List ingredients |
| `additives` | `/additives` | None | List additives |
| `allergens` | `/allergens` | None | List allergens |
| `labels` | `/labels` | None | List labels |
| `packaging` | `/packaging` | None | List packaging entries |

For `product`, the local `value` is used as the `{barcode}` path parameter.
All other endpoint-specific parameters are forwarded as query parameters.

## Examples

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

The default type is `product`. The `product` type requires `value` because it
maps to the `{barcode}` path parameter. Unsupported types or missing required
values return `400`. The service applies the configured 15-second timeout to
upstream requests.

---


# 19. TheMealDB API

The TheMealDB API provides meal, recipe, category, area, and ingredient data.

Configured upstream API:

```text
https://www.themealdb.com/api/json/v1/1
```

## Get Meal Data

```http
GET /meal-db
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Operation type; defaults to `random` |
| `value` | Conditional | Meal ID for `lookup`, or meal name for `search` |
| `category` | Conditional | Category filter for `filter` |
| `area` | Conditional | Area/cuisine filter for `filter` |
| `ingredient` | Conditional | Ingredient filter for `filter` |

### Supported Types

Supported operation types are `random`, `randomSelection`, `lookup`, `search`,
`filter`, `categories`, `areas`, and `ingredients`.

| Type | Description |
| ---- | ----------- |
| `random` | Get a random meal |
| `randomSelection` | Get a random selection of meals |
| `lookup` | Get a meal by ID |
| `search` | Search meals by name |
| `filter` | Filter meals by category, area, or ingredient |
| `categories` | List meal categories |
| `areas` | List meal areas/cuisines |
| `ingredients` | List meal ingredients |

### Examples

```http
GET /meal-db
```

```http
GET /meal-db?type=randomSelection
```

```http
GET /meal-db?type=lookup&value=52772
```

```http
GET /meal-db?type=search&value=Arrabiata
```

```http
GET /meal-db?type=filter&category=Seafood
```

```http
GET /meal-db?type=filter&area=Indian
```

```http
GET /meal-db?type=filter&ingredient=Chicken
```

```http
GET /meal-db?type=categories
```

```http
GET /meal-db?type=areas
```

```http
GET /meal-db?type=ingredients
```

The default type is `random`. The `lookup` type requires `value`. The `search`
type requires `value`. The `filter` type requires at least one of `category`,
`area`, or `ingredient`. Invalid operation types or missing required values
return `400`.

# 20. TheCocktailDB API

The TheCocktailDB API provides cocktail recipes, cocktail search, filters,
categories, glass types, ingredients, and alcoholic classifications.

Configured upstream API:

```text
https://www.thecocktaildb.com/api/json/v1/1
```

## Get Cocktail Data

```http
GET /cocktail-db
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Operation type; defaults to `random` |
| `value` | Conditional | Cocktail ID for `lookup`, or cocktail name for `search` |
| `ingredient` | Conditional | Ingredient filter for `filter` |
| `category` | Conditional | Category filter for `filter` |
| `alcoholic` | Conditional | Alcoholic classification filter for `filter` |
| `glass` | Conditional | Glass type filter for `filter` |

### Supported Types

Supported operation types are `random`, `randomMultiple`, `lookup`, `search`,
`filter`, `categories`, `glass`, `ingredients`, and `alcoholic`.

| Type | Description |
| ---- | ----------- |
| `random` | Get a random cocktail |
| `randomMultiple` | Get a random selection of cocktails |
| `lookup` | Get a cocktail by ID |
| `search` | Search cocktails by name |
| `filter` | Filter cocktails by ingredient, category, alcoholic type, or glass |
| `categories` | List cocktail categories |
| `glass` | List glass types |
| `ingredients` | List cocktail ingredients |
| `alcoholic` | List alcoholic classifications |

### Examples

```http
GET /cocktail-db
```

```http
GET /cocktail-db?type=randomMultiple
```

```http
GET /cocktail-db?type=lookup&value=11007
```

```http
GET /cocktail-db?type=search&value=margarita
```

```http
GET /cocktail-db?type=filter&ingredient=Gin
```

```http
GET /cocktail-db?type=filter&category=Cocktail
```

```http
GET /cocktail-db?type=filter&alcoholic=Alcoholic
```

```http
GET /cocktail-db?type=filter&glass=Cocktail_glass
```

```http
GET /cocktail-db?type=categories
```

```http
GET /cocktail-db?type=glass
```

```http
GET /cocktail-db?type=ingredients
```

```http
GET /cocktail-db?type=alcoholic
```

The default type is `random`. The `lookup` type requires `value`. The `search`
type requires `value`. The `filter` type requires at least one of `ingredient`,
`category`, `alcoholic`, or `glass`. Invalid operation types or missing required
values return `400`.

---


# 21. JokeAPI

The JokeAPI provides access to random jokes, category-specific jokes, and
filtered joke results.

Configured upstream API:

```text
https://v2.jokeapi.dev
```

## Get Joke Data

```http
GET /joke-api
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Operation type; defaults to `random` |
| `value` | Conditional | Joke category for `random`, `category`, or `filter`; joke ID for `joke` |
| `amount` | No | Number of jokes to return |
| `type` | No | Joke format such as `single` or `twopart` |
| `blacklistFlags` | No | Comma-separated flags to exclude |
| `safe` | No | Request safe-for-work jokes |
| `lang` | No | Joke language code |

### Supported Types

Supported operation types are `random`, `joke`, `category`, `categories`,
and `filter`.

| Type | Description |
| ---- | ----------- |
| `random` | Get a random joke |
| `joke` | Get a joke by ID |
| `category` | Get jokes from a specific category |
| `categories` | Get jokes from one or more categories |
| `filter` | Get jokes from a category with additional filters |

### Examples

```http
GET /joke-api
```

```http
GET /joke-api?type=random&value=Programming
```

```http
GET /joke-api?type=category&value=Programming
```

```http
GET /joke-api?type=categories&value=Programming,Misc
```

```http
GET /joke-api?type=filter&value=Programming&blacklistFlags=nsfw,religious,political&safe=true
```

```http
GET /joke-api?type=random&value=Programming&amount=5&type=single
```

```http
GET /joke-api?type=joke&value=123
```

The default type is `random`. Operations requiring a category or joke ID
validate `value` and return `400` when it is missing. Additional query
parameters are forwarded to JokeAPI.

---

# 22. Official Joke API

The Official Joke API provides random jokes, joke collections, joke types, type-specific jokes, and jokes by ID.

Configured upstream API:

```text
https://official-joke-api.appspot.com
```

## Get Joke Data

```http
GET /official-joke
```

### Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `type` | No | Operation type; defaults to `random` |
| `value` | Conditional | Joke ID for `joke`, joke type for `byType`, or count for `randomMultiple` |
| `mode` | Conditional | Mode for `byType`: `random` or `ten` |

### Supported Types

Supported operation types are `random`, `randomTen`, `ten`, `randomMultiple`, `types`, `byType`, and `joke`.

| Type | Upstream path | Description |
| ---- | ------------- | ----------- |
| `random` | `/random_joke` | Get one random joke |
| `randomTen` | `/random_ten` | Get ten random jokes |
| `ten` | `/jokes/ten` | Get ten jokes |
| `randomMultiple` | `/jokes/random/{count}` | Get a specified number of random jokes |
| `types` | `/types` | List available joke types |
| `byType` | `/jokes/{type}/random` | Get a random joke of a specific type |
| `joke` | `/jokes/{id}` | Get a joke by ID |

### Examples

```http
GET /official-joke
GET /official-joke?type=randomTen
GET /official-joke?type=ten
GET /official-joke?type=randomMultiple&value=5
GET /official-joke?type=types
GET /official-joke?type=byType&value=programming
GET /official-joke?type=byType&value=programming&mode=ten
GET /official-joke?type=joke&value=1
```

The default type is `random`. The `randomMultiple` type accepts a positive integer count. The `byType` type requires a joke type and supports `random` or `ten` modes. The `joke` type requires a joke ID. Invalid operation types or missing/invalid required values return `400`.

---

# 23. Weather API

The Weather API provides access to Open-Meteo forecast data.

Configured upstream API:

```text
https://api.open-meteo.com
```

---

## Get Weather Forecast

```http
GET /weather
```

### Required Query Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `latitude` | Yes | Latitude in decimal degrees (`-90` to `90`) |
| `longitude` | Yes | Longitude in decimal degrees (`-180` to `180`) |

### Optional Query Parameters

| Parameter | Description |
| --------- | ----------- |
| `current` | Current weather variables to return |
| `hourly` | Hourly weather variables to return |
| `daily` | Daily weather variables to return |
| `timezone` | Timezone for timestamps, default `auto` |
| `forecastDays` | Number of forecast days |
| `pastDays` | Number of past days to include |
| `temperatureUnit` | Temperature unit (`celsius`, `fahrenheit`) |
| `windSpeedUnit` | Wind speed unit (`kmh`, `mph`, `ms`, `kn`) |
| `precipitationUnit` | Precipitation unit (`mm`, `inch`) |

### Example

```http
GET /weather?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&hourly=temperature_2m&daily=temperature_2m_max&forecastDays=3&timezone=auto
```

### Response

```json
{
  "success": true,
  "statusCode": 200,
  "contentType": "application/json",
  "url": "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m%2Cweather_code&hourly=temperature_2m&daily=temperature_2m_max&forecast_days=3&timezone=auto",
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
    },
    "daily": {
      "time": ["2026-09-08"],
      "temperature_2m_max": [22.1]
    }
  }
}
```

---

# 24. HTTP Status Codes

| Status | Meaning                                 |
| -----: | --------------------------------------- |
|  `200` | Request successful                      |
|  `400` | Invalid request/resource                |
|  `404` | Resource not found                      |
|  `408` | Upstream request timeout                |
|  `500` | Internal server error                   |
|  `502` | Failed to communicate with upstream API |

---

# 25. Error Response

Example:

```json
{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "latitude is required"
}
```

---

# 26. Request Examples

## Fake users

```bash
curl http://localhost:3000/fake/users
```

## Fake user by ID

```bash
curl http://localhost:3000/fake/users/1
```

## Fake post comments

```bash
curl http://localhost:3000/fake/posts/1/comments
```

## Fake posts by user

```bash
curl "http://localhost:3000/fake/posts?userId=1"
```

## Mock products

```bash
curl http://localhost:3000/mock/products
```

## Mock product by ID

```bash
curl http://localhost:3000/mock/products/1
```

## Mock product pagination

```bash
curl "http://localhost:3000/mock/products?limit=10&skip=20"
```

## Mock product sorting

```bash
curl "http://localhost:3000/mock/products?sortBy=price&order=asc"
```

## Weather forecast

```bash
curl "http://localhost:3000/weather?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&hourly=temperature_2m&daily=temperature_2m_max&forecastDays=3"
```

## Countries by name

```bash
curl "http://localhost:3000/countries?type=name&value=india"
```

## Pokémon by name

```bash
curl "http://localhost:3000/pokemon?type=pokemon&value=charizard"
```

## Pokémon pagination

```bash
curl "http://localhost:3000/pokemon?type=pokemon&limit=20&offset=20"
```

## Rick and Morty character

```bash
curl "http://localhost:3000/rick-and-morty?resource=character&value=2"
```

## Rick and Morty character search

```bash
curl "http://localhost:3000/rick-and-morty?resource=character&name=rick&status=alive"
```

## Cat fact

```bash
curl http://localhost:3000/cat-facts
```

## Cat facts list

```bash
curl "http://localhost:3000/cat-facts?type=facts&limit=10"
```

## Random dog

```bash
curl http://localhost:3000/dogs
```

## Dog breed images

```bash
curl "http://localhost:3000/dogs?type=breedImages&breed=bulldog"
```

## Jikan anime

```bash
curl "http://localhost:3000/jikan?type=anime&value=1"
```

## Jikan anime characters

```bash
curl "http://localhost:3000/jikan?type=animeCharacters&value=1"
```

## CoinGecko price

```bash
curl "http://localhost:3000/coingecko?type=simplePrice&ids=bitcoin&vs_currencies=usd"
```

## CoinGecko markets

```bash
curl "http://localhost:3000/coingecko?type=markets&vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
```

## Public IP

```bash
curl http://localhost:3000/ipify
```

## Age prediction

```bash
curl "http://localhost:3000/agify?name=michael"
```

## Age prediction by country

```bash
curl "http://localhost:3000/agify?name=emma&country_id=US"
```

## Gender prediction

```bash
curl "http://localhost:3000/genderize?name=michael"
```

## Gender prediction by country

```bash
curl "http://localhost:3000/genderize?name=emma&country_id=US"
```

## Nationality prediction

```bash
curl "http://localhost:3000/nationalize?name=michael"
```

## Nationality prediction by country

```bash
curl "http://localhost:3000/nationalize?name=emma&country_id=US"
```

## GitHub user

```bash
curl "http://localhost:3000/github?type=user&username=octocat"
```

## GitHub repository

```bash
curl "http://localhost:3000/github?type=repos&owner=octocat&repo=Hello-World"
```

## GitHub repository search

```bash
curl "http://localhost:3000/github?type=searchRepositories&q=javascript"
```

## Open Library book search

```bash
curl "http://localhost:3000/open-library?type=search&q=pride+and+prejudice"
```

## Open Library work by ID

```bash
curl "http://localhost:3000/open-library?type=work&value=OL45804W"
```

## Gutenberg books search

```bash
curl "http://localhost:3000/gutendex?type=books&search=frankenstein"
```

## Gutenberg book by ID

```bash
curl "http://localhost:3000/gutendex?type=book&value=11"
```



## JokeAPI random joke

```bash
curl http://localhost:3000/joke-api
```

## JokeAPI programming joke

```bash
curl "http://localhost:3000/joke-api?type=random&value=Programming"
```

## JokeAPI filtered joke

```bash
curl "http://localhost:3000/joke-api?type=filter&value=Programming&blacklistFlags=nsfw,religious,political&safe=true"
```

## JokeAPI multiple jokes

```bash
curl "http://localhost:3000/joke-api?type=random&value=Programming&amount=5&type=single"
```

## JokeAPI joke by ID

```bash
curl "http://localhost:3000/joke-api?type=joke&value=123"
```

## Official Joke API random joke

```bash
curl http://localhost:3000/official-joke
```

## Official Joke API ten random jokes

```bash
curl "http://localhost:3000/official-joke?type=randomTen"
```

## Official Joke API multiple random jokes

```bash
curl "http://localhost:3000/official-joke?type=randomMultiple&value=5"
```

## Official Joke API joke types

```bash
curl "http://localhost:3000/official-joke?type=types"
```

## Official Joke API programming joke

```bash
curl "http://localhost:3000/official-joke?type=byType&value=programming"
```

## Official Joke API ten programming jokes

```bash
curl "http://localhost:3000/official-joke?type=byType&value=programming&mode=ten"
```

## Official Joke API joke by ID

```bash
curl "http://localhost:3000/official-joke?type=joke&value=1"
```

## TheMealDB random meal

```bash
curl http://localhost:3000/meal-db
```

## TheMealDB meal by ID

```bash
curl "http://localhost:3000/meal-db?type=lookup&value=52772"
```

## TheMealDB meal search

```bash
curl "http://localhost:3000/meal-db?type=search&value=Arrabiata"
```

## TheMealDB category filter

```bash
curl "http://localhost:3000/meal-db?type=filter&category=Seafood"
```

## TheMealDB area filter

```bash
curl "http://localhost:3000/meal-db?type=filter&area=Indian"
```

## TheMealDB ingredient filter

```bash
curl "http://localhost:3000/meal-db?type=filter&ingredient=Chicken"
```

## TheMealDB categories

```bash
curl "http://localhost:3000/meal-db?type=categories"
```

## TheMealDB areas

```bash
curl "http://localhost:3000/meal-db?type=areas"
```

## TheMealDB ingredients

```bash
curl "http://localhost:3000/meal-db?type=ingredients"
```


## TheCocktailDB random cocktail

```bash
curl http://localhost:3000/cocktail-db
```

## TheCocktailDB cocktail by ID

```bash
curl "http://localhost:3000/cocktail-db?type=lookup&value=11007"
```

## TheCocktailDB cocktail search

```bash
curl "http://localhost:3000/cocktail-db?type=search&value=margarita"
```

## TheCocktailDB ingredient filter

```bash
curl "http://localhost:3000/cocktail-db?type=filter&ingredient=Gin"
```

## TheCocktailDB category filter

```bash
curl "http://localhost:3000/cocktail-db?type=filter&category=Cocktail"
```

## TheCocktailDB alcoholic filter

```bash
curl "http://localhost:3000/cocktail-db?type=filter&alcoholic=Alcoholic"
```

## TheCocktailDB glass filter

```bash
curl "http://localhost:3000/cocktail-db?type=filter&glass=Cocktail_glass"
```

## TheCocktailDB categories

```bash
curl "http://localhost:3000/cocktail-db?type=categories"
```

## TheCocktailDB glass types

```bash
curl "http://localhost:3000/cocktail-db?type=glass"
```

## TheCocktailDB ingredients

```bash
curl "http://localhost:3000/cocktail-db?type=ingredients"
```

## TheCocktailDB alcoholic classifications

```bash
curl "http://localhost:3000/cocktail-db?type=alcoholic"
```

## Open Food Facts product lookup

```bash
curl "http://localhost:3000/open-food-facts?type=product&value=737628064502"
```

## Open Food Facts endpoint examples

```bash
curl "http://localhost:3000/open-food-facts?type=products&search_terms=milk"
curl "http://localhost:3000/open-food-facts?type=categories"
curl "http://localhost:3000/open-food-facts?type=brands"
curl "http://localhost:3000/open-food-facts?type=countries"
curl "http://localhost:3000/open-food-facts?type=ingredients"
curl "http://localhost:3000/open-food-facts?type=additives"
curl "http://localhost:3000/open-food-facts?type=allergens"
curl "http://localhost:3000/open-food-facts?type=labels"
curl "http://localhost:3000/open-food-facts?type=packaging"
```

---
# 27. Route Summary

| Method | Route                      | Purpose                     |
| ------ | -------------------------- | --------------------------- |
| `GET`  | `/`                        | Health check                |
| `GET`  | `/fake/:type`              | Fake API collection         |
| `GET`  | `/fake/:type/:id`          | Fake API resource           |
| `GET`  | `/fake/:type/:id/:subtype` | Fake API nested resource    |
| `GET`  | `/mock/:type`              | Mock API collection         |
| `GET`  | `/mock/:type/:id`          | Mock API resource           |
| `GET`  | `/weather`                 | Weather forecast            |
| `GET`  | `/countries`               | Country lookup              |
| `GET`  | `/pokemon`                 | Pokémon resource lookup     |
| `GET`  | `/rick-and-morty`          | Rick and Morty lookup       |
| `GET`  | `/cat-facts`               | Cat facts lookup            |
| `GET`  | `/dogs`                    | Dog images and breeds       |
| `GET`  | `/jikan`                   | Anime and manga lookup      |
| `GET`  | `/coingecko`               | Cryptocurrency data          |
| `GET`  | `/ipify`                   | Public IP lookup            |
| `GET`  | `/agify`                   | Age prediction              |
| `GET`  | `/genderize`               | Gender prediction           |
| `GET`  | `/nationalize`             | Nationality prediction      |
| `GET`  | `/github`                  | GitHub API lookup           |
| `GET`  | `/open-library`            | Open Library lookup         |
| `GET`  | `/gutendex`                | Gutenberg catalog lookup    |
| `GET`  | `/official-joke`         | Official Joke API lookup     |
| `GET`  | `/meal-db`                 | TheMealDB meal lookup       |
| `GET`  | `/joke-api`              | Joke lookup and filtering      |
| `GET`  | `/cocktail-db`             | TheCocktailDB cocktail lookup |
| `GET`  | `/open-food-facts`         | Open Food Facts lookup      |

All currently supported endpoints are read-only.

No `POST`, `PUT`, `PATCH`, or `DELETE` routes are exposed.
