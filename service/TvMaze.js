const routes = require("../jsons/routes.json");
const config = require("../jsons/tvMaze.json");

class TvMaze {
  #baseUrl;
  #endpoints;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = routes.tvMaze;
    this.#endpoints = config.endpoints;
    this.#defaultTimeout = config.defaultTimeout;
  }

  async init(options = {}) {
    const {
      type = "searchShows",
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
          },
        };
      }

      const idEndpoints = [
        "show",
        "showEpisodes",
        "showCast",
        "showCrew",
        "showSeasons",
        "episode",
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

        endpoint = endpoint.replace("{id}", encodeURIComponent(value));
      }

      const params = { ...query };

      if (
        type === "searchShows" ||
        type === "singleSearch" ||
        type === "searchPeople"
      ) {
        if (!params.q && value) {
          params.q = value;
        }

        if (!params.q) {
          return {
            success: false,
            statusCode: 400,
            statusText: "Bad Request",
            contentType: "application/json",
            url: `${this.#baseUrl}${endpoint}`,
            data: {
              message: "A search query is required",
            },
          };
        }
      }

      if (
        type === "lookupShow" &&
        !params.thetvdb &&
        !params.imdb &&
        !params.tvrage
      ) {
        return {
          success: false,
          statusCode: 400,
          statusText: "Bad Request",
          contentType: "application/json",
          url: `${this.#baseUrl}${endpoint}`,
          data: {
            message: "Provide a thetvdb, imdb, or tvrage ID",
          },
        };
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

module.exports = TvMaze;
