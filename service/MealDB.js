const route = require("../jsons/routes.json");
const config = require("../jsons/mealDB.json");

class MealDB {
  #baseUrl;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = route.mealDB;
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
      type = "random",
      value,
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

    let endpoint = endpoints[type];

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

    // Lookup meal by ID
    if (type === "lookup") {
      if (!value) {
        return {
          success: false,
          statusCode: 400,
          message: "value is required for type 'lookup'",
        };
      }

      searchParams.set("i", value);
    }

    // Search meals by name
    if (type === "search") {
      if (!value) {
        return {
          success: false,
          statusCode: 400,
          message: "value is required for type 'search'",
        };
      }

      searchParams.set("s", value);
    }

    // Filter by category, area, or ingredient
    if (type === "filter") {
      const { category, area, ingredient } = query;

      if (!category && !area && !ingredient) {
        return {
          success: false,
          statusCode: 400,
          message:
            "One of 'category', 'area', or 'ingredient' is required for type 'filter'",
        };
      }

      if (category) {
        searchParams.set("c", category);
      }

      if (area) {
        searchParams.set("a", area);
      }

      if (ingredient) {
        searchParams.set("i", ingredient);
      }

      searchParams.delete("category");
      searchParams.delete("area");
      searchParams.delete("ingredient");
    }

    // List categories, areas, or ingredients
    if (type === "categories" || type === "areas" || type === "ingredients") {
      const listType = {
        categories: "c",
        areas: "a",
        ingredients: "i",
      };

      searchParams.set("list", listType[type]);
    }

    if (type === "areas") {
      endpoint = endpoints.categoryList;
      searchParams.set("a", "list");
    }

    if (type === "ingredients") {
      endpoint = endpoints.categoryList;
      searchParams.set("i", "list");
    }

    const url = `${this.#baseUrl}${endpoint}`;

    const finalUrl = `${url}${searchParams.toString() ? `?${searchParams}` : ""}`;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    let response;

    try {
      response = await fetch(finalUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Free-API-Server/1.0",
        },
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          statusCode: 408,
          message: `Request timeout after ${timeout}ms`,
          url: finalUrl,
        };
      }

      return {
        success: false,
        statusCode: 502,
        message: "Failed to connect to TheMealDB API",
        error: error.message,
        url: finalUrl,
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
        url: finalUrl,
        data,
      };
    }

    return {
      success: true,
      statusCode,
      contentType,
      url: finalUrl,
      data,
    };
  }

  async #parseResponse(response, contentType) {
    const text = await response.text();

    if (
      contentType.includes("application/json") ||
      contentType.includes("+json")
    ) {
      try {
        return JSON.parse(text);
      } catch {
        return {
          message: "Response was marked as JSON but could not be parsed",
          raw: text,
        };
      }
    }

    if (
      contentType.startsWith("text/") ||
      contentType.includes("xml") ||
      contentType.includes("html")
    ) {
      return text;
    }

    return Buffer.from(text);
  }
}

module.exports = MealDB;
