const config = require("../jsons/openF1.json");
const routes = require("../jsons/routes.json");

class OpenF1 {
  constructor() {
    this.baseUrl = routes.openF1;
    this.timeout = config.defaultTimeout || 15000;
    this.endpoints = config.endpoints;
  }

  async init({ operation = "sessions", ...query } = {}) {
    try {
      const endpoint = this.endpoints[operation];

      if (!endpoint) {
        return {
          success: false,
          statusCode: 400,
          statusText: `Invalid operation: ${operation}`,
          contentType: "application/json",
          url: null,
          data: null,
        };
      }

      const url = new URL(`${this.baseUrl}${endpoint}`);

      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      }

      return await this.#request(url.toString());
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        statusText: error.message || "Internal server error",
        contentType: "application/json",
        url: null,
        data: null,
      };
    }
  }

  async #request(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Free-API-Server",
        },
        signal: controller.signal,
      });

      const contentType =
        response.headers.get("content-type") || "application/json";

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      return {
        success: response.ok,
        statusCode: response.status,
        statusText: response.ok ? "OK" : response.statusText,
        contentType,
        url,
        data,
      };
    } catch (error) {
      const isTimeout = error.name === "AbortError";

      return {
        success: false,
        statusCode: isTimeout ? 408 : 502,
        statusText: isTimeout
          ? "Request timed out"
          : "Unable to connect to OpenF1 API",
        contentType: "application/json",
        url,
        data: null,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

module.exports = OpenF1;
