const routes = require("../jsons/routes.json");
const config = require("../jsons/studioGhibli.json");

class StudioGhibli {
  #baseUrl;
  #endpoints;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = routes.studioGhibli;
    this.#endpoints = config.endpoints;
    this.#defaultTimeout = config.defaultTimeout;
  }

  async init(options = {}) {
    const {
      type = "films",
      value,
      query = {},
      timeout = this.#defaultTimeout,
    } = options;

    try {
      let endpoint = this.#endpoints[type];

      if (!endpoint) {
        return {
          success: false,
          statusCode: 400,
          statusText: "Bad Request",
          contentType: "application/json",
          url: this.#baseUrl,
          data: {
            message: `Unsupported type: ${type}`,
            availableTypes: Object.keys(this.#endpoints),
          },
        };
      }

      const idEndpoints = [
        "film",
        "person",
        "location",
        "specie",
        "vehicle",
      ];

      if (idEndpoints.includes(type)) {
        if (value === undefined || value === null || value === "") {
          return {
            success: false,
            statusCode: 400,
            statusText: "Bad Request",
            contentType: "application/json",
            url: `${this.#baseUrl}${endpoint}`,
            data: {
              message: "An ID is required for this operation",
            },
          };
        }

        endpoint = endpoint.replace(
          "{id}",
          encodeURIComponent(String(value))
        );
      }

      return await this.#request(endpoint, query, timeout);
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
          "User-Agent": "Free-API-Server",
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

module.exports = StudioGhibli;