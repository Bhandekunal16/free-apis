const routes = require("../jsons/routes.json");
const config = require("../jsons/openTrivia.json");

class OpenTrivia {
  #baseUrl;
  #endpoints;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = routes.openTrivia;
    this.#endpoints = config.endpoints;
    this.#defaultTimeout = config.defaultTimeout;
  }

  async init(options = {}) {
    const {
      operation = "questions",
      value,
      query = {},
      timeout = this.#defaultTimeout,
    } = options;

    try {
      let endpoint;

      switch (operation) {
        case "questions":
          endpoint = this.#endpoints.questions;
          break;

        case "categories":
          endpoint = this.#endpoints.categories;
          break;

        case "categoryCount":
          endpoint = this.#endpoints.categoryCount;
          break;

        case "globalCount":
          endpoint = this.#endpoints.globalCount;
          break;

        case "token":
          endpoint = this.#endpoints.token;
          break;

        default:
          return {
            success: false,
            statusCode: 400,
            statusText: "Bad Request",
            contentType: "application/json",
            url: this.#baseUrl,
            data: {
              message: `Unsupported operation: ${operation}`,
            },
          };
      }

      const params = { ...query };

      if (operation === "categoryCount") {
        if (!value && !params.category) {
          return {
            success: false,
            statusCode: 400,
            statusText: "Bad Request",
            contentType: "application/json",
            url: `${this.#baseUrl}${endpoint}`,
            data: {
              message: "A category ID is required",
            },
          };
        }

        params.category ??= value;
      }

      if (operation === "token") {
        params.command ??= "request";

        if (!["request", "reset"].includes(params.command)) {
          return {
            success: false,
            statusCode: 400,
            statusText: "Bad Request",
            contentType: "application/json",
            url: `${this.#baseUrl}${endpoint}`,
            data: {
              message: "Token command must be 'request' or 'reset'",
            },
          };
        }

        if (params.command === "reset" && !params.token) {
          return {
            success: false,
            statusCode: 400,
            statusText: "Bad Request",
            contentType: "application/json",
            url: `${this.#baseUrl}${endpoint}`,
            data: {
              message: "A token is required to reset a session",
            },
          };
        }
      }

      if (operation === "questions") {
        params.amount ??= 1;
      }

      return await this.#request(endpoint, params, timeout);
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        statusText: "Internal Server Error",
        contentType: "application/json",
        url: this.#baseUrl,
        data: {
          message: error.message,
        },
      };
    }
  }

  async #request(endpoint, query = {}, timeout) {
    const url = new URL(endpoint, this.#baseUrl);

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      const contentType =
        response.headers.get("content-type") || "application/json";

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        return {
          success: false,
          statusCode: response.status,
          statusText: response.statusText,
          contentType,
          url: url.toString(),
          data,
        };
      }

      // OpenTDB may return HTTP 200 with an API-level error code.
      if (
        typeof data === "object" &&
        data !== null &&
        data.response_code !== undefined &&
        data.response_code !== 0
      ) {
        return {
          success: false,
          statusCode: 200,
          statusText: "Open Trivia API Error",
          contentType,
          url: url.toString(),
          data,
        };
      }

      return {
        success: true,
        statusCode: response.status,
        contentType,
        url: url.toString(),
        data,
      };
    } catch (error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          statusCode: 408,
          statusText: "Request Timeout",
          contentType: "application/json",
          url: url.toString(),
          data: {
            message: `Request timed out after ${timeout}ms`,
          },
        };
      }

      return {
        success: false,
        statusCode: 502,
        statusText: "Bad Gateway",
        contentType: "application/json",
        url: url.toString(),
        data: {
          message: error.message,
        },
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

module.exports = OpenTrivia;
