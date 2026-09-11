const routes = require("../jsons/routes.json");
const config = require("../jsons/chess.json");

class Chess {
  #baseUrl;
  #defaultTimeout;
  #endpoints;

  constructor() {
    this.#baseUrl = routes.chess;
    this.#defaultTimeout = config.defaultTimeout;
    this.#endpoints = config.endpoints;
  }

  async init(options = {}) {
    try {
      const {
        type = "dailyPuzzle",
        username,
        club,
        country,
        year,
        month,
        title,
        value,
        query = {},
        timeout = this.#defaultTimeout,
      } = options;

      let endpoint;

      switch (type) {
        case "player":
          if (!username) {
            return this.#error(400, "username is required");
          }

          endpoint = `${this.#endpoints.player}/${encodeURIComponent(username)}`;
          break;

        case "playerStats":
          if (!username) {
            return this.#error(400, "username is required");
          }

          endpoint = `${this.#endpoints.playerStats}/${encodeURIComponent(username)}/stats`;
          break;

        case "playerGames":
          if (!username) {
            return this.#error(400, "username is required");
          }

          if (!year || !month) {
            return this.#error(
              400,
              "year and month are required for playerGames",
            );
          }

          endpoint =
            `${this.#endpoints.playerGames}/${encodeURIComponent(username)}` +
            `/games/${encodeURIComponent(year)}/${encodeURIComponent(month)}/pgn`;

          break;

        case "playerArchives":
          if (!username) {
            return this.#error(400, "username is required");
          }

          endpoint =
            `${this.#endpoints.playerArchives}/${encodeURIComponent(username)}` +
            "/games/archives";

          break;

        case "club":
          if (!club) {
            return this.#error(400, "club is required");
          }

          endpoint = `${this.#endpoints.club}/${encodeURIComponent(club)}`;

          break;

        case "clubMembers":
          if (!club) {
            return this.#error(400, "club is required");
          }

          endpoint = `${this.#endpoints.club}/${encodeURIComponent(club)}/members`;

          break;

        case "clubMatches":
          if (!club) {
            return this.#error(400, "club is required");
          }

          endpoint = `${this.#endpoints.club}/${encodeURIComponent(club)}/matches`;

          break;

        case "country":
          if (!country) {
            return this.#error(400, "country is required");
          }

          endpoint = `${this.#endpoints.country}/${encodeURIComponent(country)}`;

          break;

        case "countryPlayers":
          if (!country) {
            return this.#error(400, "country is required");
          }

          endpoint =
            `${this.#endpoints.countryPlayers}/${encodeURIComponent(country)}` +
            "/players";

          break;

        case "countryClubs":
          if (!country) {
            return this.#error(400, "country is required");
          }

          endpoint =
            `${this.#endpoints.countryClubs}/${encodeURIComponent(country)}` +
            "/clubs";

          break;

        case "titled":
          endpoint = this.#endpoints.titled;

          if (title) {
            query.title = title;
          }

          break;

        case "leaderboards":
          endpoint = this.#endpoints.leaderboards;
          break;

        case "streamers":
          endpoint = this.#endpoints.streamers;
          break;

        case "dailyPuzzle":
          endpoint = this.#endpoints.dailyPuzzle;
          break;

        case "randomPuzzle":
          endpoint = `${this.#endpoints.randomPuzzle}/random`;
          break;

        case "puzzle":
          if (!value) {
            return this.#error(400, "value is required for puzzle");
          }

          endpoint = `${this.#endpoints.puzzle}/${encodeURIComponent(value)}`;

          break;

        case "game":
          if (!value) {
            return this.#error(400, "value is required for game");
          }

          endpoint = `${this.#endpoints.game}/${encodeURIComponent(value)}`;

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

      const timer = setTimeout(() => {
        controller.abort();
      }, timeout);

      let response;

      try {
        response = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": "Free-API-Server/1.0",
          },
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

module.exports = Chess;
