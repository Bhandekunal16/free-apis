const routes = require("../jsons/routes.json");
const config = require("../jsons/dragonBall.json");

class DragonBall {
  #baseUrl;
  #endpoints;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = routes.dragonBall;
    this.#endpoints = config.endpoints;
    this.#defaultTimeout = config.defaultTimeout;
  }

  async init(options = {}) {
    try {
      const {
        type = "characters",
        value,
        query = {},
        timeout = this.#defaultTimeout,
      } = options;

      let endpoint;

      switch (type) {
        case "characters":
          endpoint = this.#buildResourceUrl(this.#endpoints.characters);
          break;

        case "character":
          endpoint = this.#buildResourceUrl(this.#endpoints.character, value);
          break;

        case "planets":
          endpoint = this.#buildResourceUrl(this.#endpoints.planets);
          break;

        case "planet":
          endpoint = this.#buildResourceUrl(this.#endpoints.planet, value);
          break;

        case "transformations":
          endpoint = this.#buildResourceUrl(this.#endpoints.transformations);
          break;

        case "transformation":
          endpoint = this.#buildResourceUrl(
            this.#endpoints.transformation,
            value,
          );
          break;

        default:
          return {
            success: false,
            statusCode: 400,
            statusText: "Bad Request",
            contentType: "application/json",
            url: this.#baseUrl,
            data: {
              message: `Unsupported type: ${type}`,
            },
          };
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

  #buildResourceUrl(endpoint, value) {
    if (!value) {
      return `${this.#baseUrl}${endpoint}`;
    }

    return `${this.#baseUrl}${endpoint}/${encodeURIComponent(value)}`;
  }

  async #request(endpoint, query = {}, timeout) {
    const url = new URL(endpoint);

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, value);
      }
    });

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

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

      const data = await this.#parseResponse(response, contentType);

      clearTimeout(timer);

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
      clearTimeout(timer);

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
    }
  }

  async #parseResponse(response, contentType) {
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    if (
      contentType.includes("text/") ||
      contentType.includes("application/xml")
    ) {
      return await response.text();
    }

    const buffer = await response.arrayBuffer();

    return Buffer.from(buffer);
  }
}

module.exports = DragonBall;
