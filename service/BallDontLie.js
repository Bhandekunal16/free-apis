const routes = require("../jsons/routes.json");
const config = require("../jsons/ballDontLie.json");

class BallDontLie {
  constructor() {
    this.baseUrl = routes.balldontlie;
    this.apiKey = typeof config.key === "string" ? config.key.trim() : "";
    this.timeout = config.defaultTimeout || 15000;
  }

  async init({ operation = "games", id, ...query } = {}) {
    const endpoint = config.endpoints[operation];

    if (!endpoint) {
      return {
        success: false,
        statusCode: 400,
        statusText: "Bad Request",
        contentType: "application/json",
        url: null,
        data: {
          error: `Unsupported operation: ${operation}`,
          supportedOperations: Object.keys(config.endpoints),
        },
      };
    }

    if (!this.apiKey) {
      return {
        success: false,
        statusCode: 500,
        statusText: "Internal Server Error",
        contentType: "application/json",
        url: null,
        data: {
          error: "BALLDONTLIE_API_KEY is not configured",
        },
      };
    }

    if (endpoint.includes("{id}") && id === undefined) {
      return {
        success: false,
        statusCode: 400,
        statusText: "Bad Request",
        contentType: "application/json",
        url: null,
        data: {
          error: `The operation "${operation}" requires an id`,
        },
      };
    }

    const path = endpoint.replace("{id}", encodeURIComponent(String(id ?? "")));

    const baseUrl = this.baseUrl.replace(/\/+$/, "");
    const endpointPath = path.replace(/^\/+/, "");

    const url = new URL(`${baseUrl}/${endpointPath}`);

    // Forward query parameters, including array values.
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          url.searchParams.append(key, String(item));
        }
      } else {
        url.searchParams.append(key, String(value));
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: this.apiKey,
          Accept: "application/json",
          "User-Agent": "Free-API-Server",
        },
        signal: controller.signal,
      });

      const contentType =
        response.headers.get("content-type") || "application/json";

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      return {
        success: response.ok,
        statusCode: response.status,
        statusText: response.statusText,
        contentType,
        url: url.toString(),
        data,
      };
    } catch (error) {
      const isTimeout = error.name === "AbortError";

      return {
        success: false,
        statusCode: isTimeout ? 408 : 502,
        statusText: isTimeout ? "Request Timeout" : "Bad Gateway",
        contentType: "application/json",
        url: url.toString(),
        data: {
          error: isTimeout
            ? "Request timed out"
            : "Failed to connect to BallDontLie API",
          message: error.message,
        },
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

module.exports = BallDontLie;
