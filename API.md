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

# 4. HTTP Status Codes

| Status | Meaning                                 |
| -----: | --------------------------------------- |
|  `200` | Request successful                      |
|  `400` | Invalid request/resource                |
|  `404` | Resource not found                      |
|  `408` | Upstream request timeout                |
|  `500` | Internal server error                   |
|  `502` | Failed to communicate with upstream API |

---

# 5. Error Response

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

# 6. Request Examples

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

---

# 7. Route Summary

| Method | Route                      | Purpose                  |
| ------ | -------------------------- | ------------------------ |
| `GET`  | `/`                        | Health check             |
| `GET`  | `/fake/:type`              | Fake API collection      |
| `GET`  | `/fake/:type/:id`          | Fake API resource        |
| `GET`  | `/fake/:type/:id/:subtype` | Fake API nested resource |
| `GET`  | `/mock/:type`              | Mock API collection      |
| `GET`  | `/mock/:type/:id`          | Mock API resource        |

All currently supported endpoints are read-only.

No `POST`, `PUT`, `PATCH`, or `DELETE` routes are exposed.
