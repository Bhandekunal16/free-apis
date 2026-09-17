const routes = require("../jsons/routes.json");
const config = require("../jsons/digimon.json");

class Digimon {
  #baseUrl;
  #endpoints;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = routes.digimon;
    this.#endpoints = config.endpoints;
    this.#defaultTimeout = config.defaultTimeout;
  }

  async init(options = {}) {
    try {
      const {
        type = "digimon",
        value,
        query = {},
        timeout = this.#defaultTimeout,
      } = options;

      let endpoint;

      switch (type) {
        case "digimon":
          endpoint = this.#buildResourceUrl(this.#endpoints.digimon, value);
          break;

        case "attribute":
          endpoint = this.#buildResourceUrl(this.#endpoints.attribute, value);
          break;

        case "field":
          endpoint = this.#buildResourceUrl(this.#endpoints.field, value);
          break;

        case "level":
          endpoint = this.#buildResourceUrl(this.#endpoints.level, value);
          break;

        case "type":
          endpoint = this.#buildResourceUrl(this.#endpoints.type, value);
          break;

        case "skill":
          endpoint = this.#buildResourceUrl(this.#endpoints.skill, value);
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

module.exports = Digimon;
