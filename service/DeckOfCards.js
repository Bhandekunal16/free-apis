const routes = require("../jsons/routes.json");
const config = require("../jsons/deckOfCards.json");

class DeckOfCards {
  #baseUrl;
  #defaultTimeout;
  #endpoints;

  constructor() {
    this.#baseUrl = routes.deckOfCards;
    this.#defaultTimeout = config.defaultTimeout;
    this.#endpoints = config.endpoints;
  }

  async init(options = {}) {
    try {
      const {
        type = "newShuffle",
        deckId,
        pileName,
        value,
        query = {},
        timeout = this.#defaultTimeout,
      } = options;

      let endpoint;

      switch (type) {
        case "new":
          endpoint = this.#endpoints.new;
          break;

        case "newShuffle":
          endpoint = this.#endpoints.newShuffle;
          break;

        case "draw":
          if (!deckId) {
            return this.#error(400, "deckId is required for draw operation");
          }

          endpoint = `${this.#baseDeckPath(deckId)}${this.#endpoints.draw}`;
          break;

        case "shuffle":
          if (!deckId) {
            return this.#error(400, "deckId is required for shuffle operation");
          }

          endpoint = `${this.#baseDeckPath(deckId)}${this.#endpoints.shuffle}`;
          break;

        case "return":
          if (!deckId) {
            return this.#error(400, "deckId is required for return operation");
          }

          endpoint = `${this.#baseDeckPath(deckId)}${this.#endpoints.return}`;
          break;

        case "pileAdd":
          if (!deckId || !pileName) {
            return this.#error(
              400,
              "deckId and pileName are required for pileAdd operation",
            );
          }

          endpoint = `${this.#baseDeckPath(deckId)}${this.#endpoints.pileAdd}/${encodeURIComponent(pileName)}/add`;
          break;

        case "pileShuffle":
          if (!deckId || !pileName) {
            return this.#error(
              400,
              "deckId and pileName are required for pileShuffle operation",
            );
          }

          endpoint = `${this.#baseDeckPath(deckId)}${this.#endpoints.pileShuffle}/${encodeURIComponent(pileName)}/shuffle`;
          break;

        case "pileList":
          if (!deckId || !pileName) {
            return this.#error(
              400,
              "deckId and pileName are required for pileList operation",
            );
          }

          endpoint = `${this.#baseDeckPath(deckId)}${this.#endpoints.pileList}/${encodeURIComponent(pileName)}/list`;
          break;

        case "pileDraw":
          if (!deckId || !pileName) {
            return this.#error(
              400,
              "deckId and pileName are required for pileDraw operation",
            );
          }

          endpoint = `${this.#baseDeckPath(deckId)}${this.#endpoints.pileDraw}/${encodeURIComponent(pileName)}/draw`;

          if (value) {
            endpoint += `/${encodeURIComponent(value)}`;
          }

          break;

        case "pileReturn":
          if (!deckId || !pileName) {
            return this.#error(
              400,
              "deckId and pileName are required for pileReturn operation",
            );
          }

          endpoint = `${this.#baseDeckPath(deckId)}${this.#endpoints.pileReturn}/${encodeURIComponent(pileName)}/return`;
          break;

        default:
          return this.#error(400, `Invalid operation type: ${type}`);
      }

      const url = new URL(`${this.#baseUrl}${endpoint}`);

      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          url.searchParams.append(key, String(val));
        }
      });

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      let response;

      try {
        response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      const contentType =
        response.headers.get("content-type") || "application/json";

      const data = await this.#parseResponse(response, contentType);

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
          url: this.#baseUrl,
          data: {
            message: "Upstream request timed out",
          },
        };
      }

      return {
        success: false,
        statusCode: 502,
        statusText: "Bad Gateway",
        contentType: "application/json",
        url: this.#baseUrl,
        data: {
          message: error.message,
        },
      };
    }
  }

  #baseDeckPath(deckId) {
    return `/${encodeURIComponent(deckId)}`;
  }

  async #parseResponse(response, contentType) {
    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  }

  #error(statusCode, message) {
    return {
      success: false,
      statusCode,
      statusText: "Bad Request",
      contentType: "application/json",
      url: this.#baseUrl,
      data: {
        message,
      },
    };
  }
}

module.exports = DeckOfCards;
