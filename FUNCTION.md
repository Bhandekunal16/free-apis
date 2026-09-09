# Function Documentation

This document describes the internal functions and responsibilities of the API services.

---

# Architecture

```text
Express
   │
   ├── /fake/*
   │       │
   │       ▼
   │    FakeData
   │       │
   │       ▼
   │    JSONPlaceholder
   │
   ├── /mock/*
   │       │
   │       ▼
   │    MockData
   │       │
   │       ▼
   │    DummyJSON
   │
   └── /weather
           │
           ▼
        OpenMeteo
           │
           ▼
        Open-Meteo API

   /countries
           │
           ▼
     RestCountries
           │
           ▼
     REST Countries API
```

The application follows a simple controller/service architecture.

---

# Application

## `index.js`

The main application entry point.

Responsibilities:

* Create Express application
* Load application configuration
* Initialize services
* Register middleware
* Register routes
* Handle unknown routes
* Start HTTP server

---

## Express Configuration

```js
const app = express();

app.use(express.json());
```

`express.json()` enables JSON request-body parsing.

Although the current API is read-only and primarily uses `GET`, this middleware allows the application to support JSON requests in the future.

---

# FakeData Service

File:

```text
fakeData.js
```

Class:

```js
FakeData
```

The service is responsible for consuming JSONPlaceholder.

---

## Constructor

```js
constructor()
```

Initializes:

* allowed resources
* upstream API URL
* timeout configuration
* cache configuration
* in-memory cache

Example:

```js
const fakeData = new FakeData();
```

The service should normally be instantiated once when the application starts.

---

# `init()`

```js
async init(options)
```

Primary public function of the FakeData service.

It accepts either:

```js
fakeData.init("users");
```

or:

```js
fakeData.init({
  type: "users",
  id: 1,
  query: {
    _page: 1,
    _limit: 10
  }
});
```

---

## Input

### String input

```js
"users"
```

This represents:

```text
GET /users
```

### Object input

```js
{
  type: "users",
  id: 1,
  subtype: "posts",
  query: {}
}
```

---

# `#buildUrl()`

```js
#buildUrl(options)
```

Constructs the upstream API URL.

Example input:

```js
{
  type: "posts",
  id: 1,
  subtype: "comments",
  query: {
    postId: 1
  }
}
```

Produces:

```text
https://jsonplaceholder.typicode.com/posts/1/comments?postId=1
```

Responsibilities:

* Encode path parameters
* Build resource paths
* Build nested resource paths
* Convert query objects to query strings

---

# `#fetch()`

```js
async #fetch(url)
```

Performs the external HTTP request.

Configuration:

```text
GET
Accept: application/json
```

A timeout is applied using:

```js
AbortController
```

This prevents an external API from keeping a request open indefinitely.

---

# `#parseResponse()`

```js
async #parseResponse(response, contentType)
```

Determines how the upstream response should be parsed.

### JSON

```text
application/json
```

uses:

```js
response.json()
```

### Text

```text
text/*
```

uses:

```js
response.text()
```

### Binary

Other content types use:

```js
response.arrayBuffer()
```

and are converted to:

```js
Buffer
```

This allows the service to support APIs returning more than JSON.

---

# `#success()`

```js
#success(data)
```

Creates a standardized successful response.

Example:

```json
{
  "success": true,
  "statusCode": 200,
  "status": true,
  "data": [],
  "length": 0,
  "type": "collection"
}
```

For an object:

```json
{
  "success": true,
  "statusCode": 200,
  "status": true,
  "data": {},
  "length": 1,
  "type": "object"
}
```

---

# `#error()`

```js
#error(statusCode, message, extra)
```

Creates a standardized error response.

Example:

```json
{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "Invalid resource 'customers'"
}
```

---

# Cache Functions

The FakeData service can optionally cache upstream responses.

---

## `#getCache()`

```js
#getCache(key)
```

Retrieves an item from the in-memory cache.

The cache key is normally the complete upstream URL.

Example:

```text
https://jsonplaceholder.typicode.com/users
```

---

## `#setCache()`

```js
#setCache(key, data)
```

Stores a response in memory.

Each cache entry contains:

```js
{
  timestamp,
  data
}
```

---

## `clearCache()`

```js
clearCache()
```

Clears the entire in-memory cache.

Example:

```js
fakeData.clearCache();
```

---

## `getCacheSize()`

```js
getCacheSize()
```

Returns the number of cached requests.

Example:

```js
console.log(
  fakeData.getCacheSize()
);
```

---

# RestCountries Service

File:

```text
restCountries.js
```

Class:

```js
RestCountries
```

The RestCountries service consumes REST Countries and supports the following
lookup types:

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

## `init()`

```js
async init(options)
```

Builds the REST Countries endpoint, validates the lookup type and required
value, forwards query parameters, and returns a standardized response.

Example:

```js
await restCountries.init({
  type: "name",
  value: "india",
  query: {
    fields: "name,capital,flags"
  }
});
```

The public controller maps this service to:

```http
GET /countries?type=name&value=india&fields=name,capital,flags
```

`all` is the default type and does not require a value. Every other type
requires `value`; unsupported types return `400`.

The service uses `AbortController` for the default 10-second timeout and
parses JSON, text, and binary upstream responses.

---

# MockData Service

File:

```text
mockData.js
```

Class:

```js
MockData
```

The MockData service is responsible for consuming DummyJSON.

---

## `init()`

```js
async init(options)
```

Main public entry point.

Example:

```js
await mockData.init({
  type: "products"
});
```

With ID:

```js
await mockData.init({
  type: "products",
  id: 1
});
```

With query parameters:

```js
await mockData.init({
  type: "products",

  query: {
    limit: 10,
    skip: 20,
    sortBy: "price",
    order: "asc"
  }
});
```

---

# Resource Validation

Resources are validated against the configured list.

Example configuration:

```json
{
  "resources": [
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

Invalid:

```text
/customers
```

returns an error instead of making an external request.

This prevents arbitrary resources from being requested through the service.

---

# Query Handling

Both FakeData and MockData support query objects.

Example:

```js
{
  type: "products",

  query: {
    limit: 10,
    skip: 20,
    sortBy: "price",
    order: "asc"
  }
}
```

The query object is converted using:

```js
URLSearchParams
```

Result:

```text
/products?limit=10&skip=20&sortBy=price&order=asc
```

---

# Controller Functions

Controllers are intentionally thin.

Their responsibility is:

1. Read route parameters.
2. Read query parameters.
3. Call the appropriate service.
4. Return the service response.

They should not contain upstream API logic.

---

# Fake Collection Controller

```js
app.get("/fake/:type", async (req, res) => {
  const data = await fakeData.init(
    req.params.type
  );

  res
    .status(data?.length ? 200 : 404)
    .json({
      ...data,
      statusCode: data?.length ? 200 : 404,
      status: data?.length ? true : false
    });
});
```

### Recommended version

The controller should not determine success from `length`.

Instead:

```js
app.get("/fake/:type", async (req, res) => {
  const data = await fakeData.init({
    type: req.params.type,
    query: req.query
  });

  res
    .status(data.statusCode)
    .json(data);
});
```

This correctly treats:

```json
[]
```

as a successful response when the upstream API returned HTTP `200`.

---

# Fake Resource Controller

```js
app.get(
  "/fake/:type/:id",
  async (req, res) => {
    const data =
      await fakeData.init({
        type: req.params.type,
        id: req.params.id,
        query: req.query
      });

    res
      .status(data.statusCode)
      .json(data);
  }
);
```

---

# Fake Nested Resource Controller

```js
app.get(
  "/fake/:type/:id/:subtype",
  async (req, res) => {
    const data =
      await fakeData.init({
        type: req.params.type,
        id: req.params.id,
        subtype: req.params.subtype,
        query: req.query
      });

    res
      .status(data.statusCode)
      .json(data);
  }
);
```

---

# Mock Collection Controller

```js
app.get(
  "/mock/:type",
  async (req, res) => {
    const data =
      await mockData.init({
        type: req.params.type,
        query: req.query
      });

    res
      .status(data.statusCode ?? 200)
      .json(data);
  }
);
```

---

# Mock Resource Controller

```js
app.get(
  "/mock/:type/:id",
  async (req, res) => {
    const data =
      await mockData.init({
        type: req.params.type,
        id: req.params.id,
        query: req.query
      });

    res
      .status(data.statusCode ?? 200)
      .json(data);
  }
);
```

---

# Unknown Routes

The final Express middleware handles unknown endpoints:

```js
app.use((_, res) => {
  res
    .status(404)
    .send("not found");
});
```

Example:

```http
GET /unknown
```

Response:

```text
not found
```

Status:

```text
404
```

---

# Design Principles

## Controllers

Controllers should be responsible for HTTP only.

```text
Request
  ↓
Controller
  ↓
Service
```

---

## Services

Services should be responsible for application/API logic.

```text
Validation
URL construction
HTTP request
Response parsing
Caching
Error handling
```

---

## Configuration

External URLs and resource lists should not be hardcoded into business logic.

Use:

```text
jsons/routes.json
jsons/fakeData.json
jsons/mockData.json
jsons/app.json
```

This makes changing an upstream API possible without changing service code.

---

# Performance Guidelines

### Reuse service instances

Prefer:

```js
const fakeData = new FakeData();
const mockData = new MockData();
```

once during application startup.

Avoid:

```js
new FakeData()
```

for every request.

This allows state such as an in-memory cache to be reused.

---

### Use caching

Caching prevents repeated requests for identical resources.

Cache key:

```text
HTTP method + complete URL
```

For this read-only service, `GET` responses are safe candidates for caching when freshness requirements permit.

---

### Use request timeouts

Every external request should have a timeout.

Without a timeout, an unavailable upstream API can consume server resources for an unnecessarily long period.

---

### Forward query parameters generically

Avoid maintaining a hardcoded list of every possible query parameter.

Instead of:

```js
if (paramKey === "limit") {}
if (paramKey === "skip") {}
if (paramKey === "sortBy") {}
```

use:

```js
URLSearchParams
```

to forward the query object.

This makes the service compatible with additional upstream query parameters without code changes.

---

# Future Improvements

Potential improvements include:

* LRU cache
* Cache size limits
* Request deduplication
* Rate limiting
* Retry with exponential backoff
* Structured logging
* Metrics
* Request IDs
* API documentation with OpenAPI/Swagger
* Automated tests
* Environment-variable configuration
* Graceful shutdown
* Concurrent request control
* Circuit breaker for failed upstream APIs

The highest-value performance improvement after basic caching is **request deduplication**.

If multiple clients request the same uncached URL simultaneously, the service can share one upstream Promise rather than sending multiple identical requests.

---

# Read-Only Contract

The current service intentionally exposes only:

```text
GET
```

No mutation endpoints are currently implemented:

```text
POST
PUT
PATCH
DELETE
```

This keeps the project focused on API consumption, testing, and development.
