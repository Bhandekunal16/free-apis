# Free APIs

A lightweight Node.js/Express service for consuming and exposing free public APIs through a unified local API.

The project currently provides six API groups:

* **Fake API** — consumes [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
* **Mock API** — consumes [DummyJSON](https://dummyjson.com/)
* **Weather API** — consumes [Open-Meteo](https://open-meteo.com/)
* **Countries API** — consumes [REST Countries](https://restcountries.com/)
* **Pokémon API** — consumes [PokéAPI](https://pokeapi.co/)
* **Rick and Morty API** — consumes [Rick and Morty API](https://rickandmortyapi.com/)

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
  "rickAndMorty": "https://rickandmortyapi.com/api"
}
```

---

## Project Structure

```text
free-apis/
│
├── jsons/
│   ├── app.json
│   ├── routes.json
│   ├── fakeData.json
│   ├── mockData.json
│   ├── openMeteo.json
│   ├── restCountries.json
│   ├── pokemon.json
│   └── rickAndMorty.json
│
├── fakeData.js
├── mockData.js
├── OpenMeteo.js
├── restCountries.js
├── pokemon.js
├── rickAndMorty.js
├── index.js
├── package.json
├── README.md
├── API.md
├── FUNCTION.md
└── .gitignore
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
