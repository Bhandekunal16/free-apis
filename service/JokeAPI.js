const route = require("../jsons/routes.json");
const config = require("../jsons/jokeAPI.json");

class JokeAPI {
  #baseUrl;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = route.jokeAPI;
    this.#defaultTimeout = config.defaultTimeout;
  }

  async init(options = {}) {
    try {
      return await this.#apiCall(options);
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.message,
      };
    }
  }

  async #apiCall(options) {
    const {
      type = "random",
      value,
      query = {},
      timeout = this.#defaultTimeout,
    } = options;

    const endpoints = config.endpoints;

    if (!Object.prototype.hasOwnProperty.call(endpoints, type)) {
      return {
        success: false,
        statusCode: 400,
        message: `Invalid type '${type}'`,
        availableTypes: Object.keys(endpoints),
      };
    }

    let endpoint = endpoints[type];

    const searchParams = new URLSearchParams();

    if (query && typeof query === "object") {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) {
          continue;
        }

        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","));
        } else {
          searchParams.set(key, String(value));
        }
      }
    }

    // Get random joke
    if (type === "random") {
      const category = value || "Any";

      endpoint = `${endpoints.random}/${encodeURIComponent(category)}`;
    }

    // Get joke by ID
    if (type === "joke") {
      if (!value) {
        return {
          success: false,
          statusCode: 400,
          message: "value is required for type 'joke'",
        };
      }

      endpoint = `${endpoints.joke}/${encodeURIComponent(value)}`;
    }

    // Get jokes by category
    if (type === "category") {
      if (!value) {
        return {
          success: false,
          statusCode: 400,
          message: "value is required for type 'category'",
        };
      }

      endpoint = `${endpoints.category}/${encodeURIComponent(value)}`;
    }

    // Get jokes from multiple categories
    if (type === "categories") {
      const categories = Array.isArray(value)
        ? value.join(",")
        : value || "Any";

      endpoint = `${endpoints.categories}/${encodeURIComponent(categories)}`;
    }

    // Get joke with custom filters
    if (type === "filter") {
      const category = value || "Any";

      endpoint = `${endpoints.filter}/${encodeURIComponent(category)}`;
    }

    const url = `${this.#baseUrl}${endpoint}`;

    const finalUrl = `${
      url
    }${searchParams.toString() ? `?${searchParams}` : ""}`;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    let response;

    try {
      response = await fetch(finalUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Free-API-Server/1.0",
        },
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          statusCode: 408,
          message: `Request timeout after ${timeout}ms`,
          url: finalUrl,
        };
      }

      return {
        success: false,
        statusCode: 502,
        message: "Failed to connect to JokeAPI",
        error: error.message,
        url: finalUrl,
      };
    } finally {
      clearTimeout(timer);
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    const statusCode = response.status;

    const data = await this.#parseResponse(response, contentType);

    if (!response.ok) {
      return {
        success: false,
        statusCode,
        statusText: response.statusText,
        contentType,
        url: finalUrl,
        data,
      };
    }

    return {
      success: true,
      statusCode,
      contentType,
      url: finalUrl,
      data,
    };
  }

  async #parseResponse(response, contentType) {
    const text = await response.text();

    if (
      contentType.includes("application/json") ||
      contentType.includes("+json")
    ) {
      try {
        return JSON.parse(text);
      } catch {
        return {
          message: "Response was marked as JSON but could not be parsed",
          raw: text,
        };
      }
    }

    if (
      contentType.startsWith("text/") ||
      contentType.includes("xml") ||
      contentType.includes("html")
    ) {
      return text;
    }

    return Buffer.from(text);
  }
}

module.exports = JokeAPI;
