const route = require("../jsons/routes.json");
const config = require("../jsons/agify.json");

class Agify {
  #baseUrl;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = route.agify;
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
      type = "age",
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

    const url = `${this.#baseUrl}${endpoints[type]}`;

    const searchParams = new URLSearchParams();

    if (query && typeof query === "object") {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === "") {
          continue;
        }

        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","));
        } else {
          searchParams.set(key, String(value));
        }
      }
    }

    const requestUrl = searchParams.toString()
      ? `${url}?${searchParams.toString()}`
      : url;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    let response;

    try {
      response = await fetch(requestUrl, {
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
          url: requestUrl,
        };
      }

      return {
        success: false,
        statusCode: 502,
        message: "Failed to connect to Agify API",
        error: error.message,
        url: requestUrl,
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
        url: requestUrl,
        data,
      };
    }

    return {
      success: true,
      statusCode,
      contentType,
      url: requestUrl,
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

module.exports = Agify;
