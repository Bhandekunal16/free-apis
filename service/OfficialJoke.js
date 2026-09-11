const route = require("../jsons/routes.json");
const config = require("../jsons/officialJoke.json");

class OfficialJoke {
  #baseUrl;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = route.officialJoke;
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
      for (const [key, queryValue] of Object.entries(query)) {
        if (queryValue === undefined || queryValue === null) {
          continue;
        }

        if (Array.isArray(queryValue)) {
          searchParams.set(key, queryValue.join(","));
        } else {
          searchParams.set(key, String(queryValue));
        }
      }
    }

    // Random joke
    if (type === "random") {
      endpoint = endpoints.random;
    }

    // Ten random jokes
    if (type === "randomTen" || type === "ten") {
      endpoint = type === "randomTen" ? endpoints.randomTen : endpoints.ten;
    }

    // Multiple random jokes
    if (type === "randomMultiple") {
      const count = value || query.count;

      if (count === undefined || count === null) {
        endpoint = endpoints.randomMultiple;
      } else {
        const parsedCount = Number(count);

        if (!Number.isInteger(parsedCount) || parsedCount < 1) {
          return {
            success: false,
            statusCode: 400,
            message: "count must be a positive integer",
          };
        }

        endpoint = `${endpoints.randomMultiple}/${parsedCount}`;

        searchParams.delete("count");
      }
    }

    // Get joke types
    if (type === "types") {
      endpoint = endpoints.types;
    }

    // Get random joke by type
    if (type === "byType") {
      if (!value) {
        return {
          success: false,
          statusCode: 400,
          message: "value is required for type 'byType'",
        };
      }

      const jokeType = encodeURIComponent(value);

      const mode = query.mode || "random";

      if (mode !== "random" && mode !== "ten") {
        return {
          success: false,
          statusCode: 400,
          message: "mode must be either 'random' or 'ten'",
        };
      }

      endpoint = `${endpoints.byType}/${jokeType}/${mode}`;

      searchParams.delete("mode");
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

      const id = Number(value);

      if (!Number.isInteger(id) || id < 1) {
        return {
          success: false,
          statusCode: 400,
          message: "value must be a positive integer joke ID",
        };
      }

      endpoint = `${endpoints.joke}/${id}`;
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
        message: "Failed to connect to Official Joke API",
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

module.exports = OfficialJoke;
