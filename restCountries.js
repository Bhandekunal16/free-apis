const route = require("./jsons/routes.json");

class RestCountries {
  #baseUrl = route.restcountries;
  #defaultTimeout = 10000;

  constructor(config = {}) {
    this.#baseUrl = config.baseUrl ?? this.#baseUrl;
    this.#defaultTimeout = config.timeout ?? this.#defaultTimeout;
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
      type = "all",
      value,
      query = {},
      timeout = this.#defaultTimeout,
    } = options;

    // -----------------------------------
    // Build endpoint
    // -----------------------------------

    const endpoints = {
      all: "/v3.1/all",
      name: "/v3.1/name",
      code: "/v3.1/alpha",
      currency: "/v3.1/currency",
      lang: "/v3.1/lang",
      capital: "/v3.1/capital",
      region: "/v3.1/region",
      subregion: "/v3.1/subregion",
    };

    if (!endpoints[type]) {
      return {
        success: false,
        statusCode: 400,
        message: `Invalid type '${type}'`,
        availableTypes: Object.keys(endpoints),
      };
    }

    let url = `${this.#baseUrl}${endpoints[type]}`;

    // -----------------------------------
    // Path value
    // -----------------------------------

    if (type !== "all") {
      if (!value) {
        return {
          success: false,
          statusCode: 400,
          message: `value is required for type '${type}'`,
        };
      }

      url += `/${encodeURIComponent(value)}`;
    }

    // -----------------------------------
    // Query parameters
    // -----------------------------------

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

    const queryString = searchParams.toString();

    if (queryString) {
      url += `?${queryString}`;
    }

    // -----------------------------------
    // Request timeout
    // -----------------------------------

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    let response;

    try {
      response = await fetch(url, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          statusCode: 408,
          message: `Request timeout after ${timeout}ms`,
          url,
        };
      }

      return {
        success: false,
        statusCode: 502,
        message: "Failed to connect to Rest Countries API",
        error: error.message,
        url,
      };
    } finally {
      clearTimeout(timer);
    }

    // -----------------------------------
    // Response
    // -----------------------------------

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    const statusCode = response.status;

    const data = await this.#parseResponse(response, contentType);

    // -----------------------------------
    // Error
    // -----------------------------------

    if (!response.ok) {
      return {
        success: false,
        statusCode,
        statusText: response.statusText,
        contentType,
        url,
        data,
      };
    }

    // -----------------------------------
    // Success
    // -----------------------------------

    return {
      success: true,
      statusCode,
      contentType,
      url,
      data,
    };
  }

  async #parseResponse(response, contentType) {
    if (
      contentType.includes("application/json") ||
      contentType.includes("+json")
    ) {
      try {
        return await response.json();
      } catch {
        return {
          message: "Response was marked as JSON but could not be parsed",
        };
      }
    }

    if (
      contentType.startsWith("text/") ||
      contentType.includes("xml") ||
      contentType.includes("html")
    ) {
      return await response.text();
    }

    return Buffer.from(await response.arrayBuffer());
  }
}

module.exports = RestCountries;
