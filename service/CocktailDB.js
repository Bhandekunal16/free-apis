const route = require("../jsons/routes.json");
const config = require("../jsons/cocktailDB.json");

class CocktailDB {
  #baseUrl;
  #defaultTimeout;

  constructor() {
    this.#baseUrl = route.cocktailDB;
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
      for (const [key, queryValue] of Object.entries(query)) {
        if (queryValue === undefined || queryValue === null) continue;

        if (Array.isArray(queryValue)) {
          searchParams.set(key, queryValue.join(","));
        } else {
          searchParams.set(key, String(queryValue));
        }
      }
    }

    /*
     * Lookup cocktail by ID
     * /lookup.php?i=11007
     */
    if (type === "lookup") {
      if (value === undefined || value === null || value === "") {
        return {
          success: false,
          statusCode: 400,
          message: "value is required for type 'lookup'",
        };
      }

      searchParams.set("i", String(value));
    }

    /*
     * Search cocktails
     * /search.php?s=margarita
     */
    if (type === "search") {
      if (value === undefined || value === null || value === "") {
        return {
          success: false,
          statusCode: 400,
          message: "value is required for type 'search'",
        };
      }

      searchParams.set("s", String(value));
    }

    /*
     * Filter cocktails
     *
     * ingredient -> /filter.php?i=Gin
     * category   -> /filter.php?c=Cocktail
     * alcoholic  -> /filter.php?a=Alcoholic
     * glass      -> /filter.php?g=Cocktail_glass
     */
    if (type === "filter") {
      const filterMap = {
        ingredient: "i",
        category: "c",
        alcoholic: "a",
        glass: "g",
      };

      const filterKey = Object.keys(filterMap).find(
        (key) =>
          query[key] !== undefined && query[key] !== null && query[key] !== "",
      );

      if (!filterKey) {
        return {
          success: false,
          statusCode: 400,
          message:
            "One of 'ingredient', 'category', 'alcoholic', or 'glass' is required for type 'filter'",
        };
      }

      searchParams.delete("ingredient");
      searchParams.delete("category");
      searchParams.delete("alcoholic");
      searchParams.delete("glass");

      searchParams.set(filterMap[filterKey], String(query[filterKey]));
    }

    /*
     * List endpoints
     *
     * categories -> /list.php?c=list
     * glass      -> /list.php?g=list
     * ingredients -> /list.php?i=list
     * alcoholic  -> /list.php?a=list
     */
    if (type === "categories") {
      searchParams.set("c", "list");
    }

    if (type === "glass") {
      searchParams.set("g", "list");
    }

    if (type === "ingredients") {
      searchParams.set("i", "list");
    }

    if (type === "alcoholic") {
      searchParams.set("a", "list");
    }

    /*
     * Replace {id} if an endpoint needs it.
     */
    if (endpoint.includes("{id}")) {
      if (value === undefined || value === null || value === "") {
        return {
          success: false,
          statusCode: 400,
          message: `value is required for type '${type}'`,
        };
      }

      endpoint = endpoint.replace("{id}", encodeURIComponent(value));
    }

    const url = `${this.#baseUrl}${endpoint}`;

    const finalUrl = `${url}${searchParams.toString() ? `?${searchParams}` : ""}`;

    const controller = new AbortController();

    const timer = setTimeout(() => controller.abort(), timeout);

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
        message: "Failed to connect to CocktailDB API",
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

module.exports = CocktailDB;
