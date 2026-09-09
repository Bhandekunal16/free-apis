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

# 8. Weather API

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

# 9. HTTP Status Codes

| Status | Meaning                                 |
| -----: | --------------------------------------- |
|  `200` | Request successful                      |
|  `400` | Invalid request/resource                |
|  `404` | Resource not found                      |
|  `408` | Upstream request timeout                |
|  `500` | Internal server error                   |
|  `502` | Failed to communicate with upstream API |

---

# 10. Error Response

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

# 11. Request Examples

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

---

# 12. Route Summary

| Method | Route                      | Purpose                  |
| ------ | -------------------------- | ------------------------ |
| `GET`  | `/`                        | Health check             |
| `GET`  | `/fake/:type`              | Fake API collection      |
| `GET`  | `/fake/:type/:id`          | Fake API resource        |
| `GET`  | `/fake/:type/:id/:subtype` | Fake API nested resource |
| `GET`  | `/mock/:type`              | Mock API collection      |
| `GET`  | `/mock/:type/:id`          | Mock API resource        |
| `GET`  | `/weather`                 | Weather forecast         |
| `GET`  | `/countries`               | Country lookup           |
| `GET`  | `/pokemon`                 | Pokémon resource lookup  |
| `GET`  | `/rick-and-morty`          | Rick and Morty lookup    |
| `GET`  | `/cat-facts`               | Cat facts lookup         |

All currently supported endpoints are read-only.

No `POST`, `PUT`, `PATCH`, or `DELETE` routes are exposed.
