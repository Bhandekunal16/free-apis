const route = require("./jsons/routes.json");

class RestCountries {
  #baseUrl = route.restcountries;
  #defaultTimeout = 10000;
  #apiKey;

  constructor(config = {}) {
    this.#baseUrl = "https://api.restcountries.com";

    this.#defaultTimeout = config.timeout ?? this.#defaultTimeout;

    this.#apiKey = "rc_live_f925534e245b412fb67f08f892d732c0";
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
      type = "all",
      value,
      query = {},
      timeout = this.#defaultTimeout,
    } = options;

    const endpoints = {
      all: "/countries/v5",
      name: "/countries/v5/names.common",
      code: "/countries/v5/codes.alpha_2",
      currency: "/countries/v5/currencies",
      lang: "/countries/v5/languages",
      capital: "/countries/v5/capitals",
      region: "/countries/v5/region",
      subregion: "/countries/v5/subregion",
    };

    if (!endpoints[type]) {
      return {
        success: false,
        statusCode: 400,
        message: `Invalid type '${type}'`,
        availableTypes: Object.keys(endpoints),
      };
    }

    let url = `${this.#baseUrl}${endpoints[type]}`;

    if (type !== "all") {
      if (!value) {
        return {
          success: false,
          statusCode: 400,
          message: `value is required for type '${type}'`,
        };
      }

      url += `/${encodeURIComponent(value)}`;
    }

    const searchParams = new URLSearchParams();

    if (query && typeof query === "object") {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) {
          continue;
        }

        if (key === "fields") {
          searchParams.set(
            "response_fields",
            Array.isArray(value) ? value.join(",") : String(value),
          );

          continue;
        }

        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","));
        } else {
          searchParams.set(key, String(value));
        }
      }
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    let response;

    try {
      response = await fetch(
        `${url}${searchParams.toString() ? `?${searchParams}` : ""}`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.#apiKey}`,
          },

          signal: controller.signal,
        },
      );

      console.log(response, 0);
    } catch (error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          statusCode: 408,
          message: `Request timeout after ${timeout}ms`,
          url,
        };
      }

      return {
        success: false,
        statusCode: 502,
        message: "Failed to connect to REST Countries API",
        error: error.message,
        url,
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
        url,
        data,
      };
    }

    return {
      success: true,
      statusCode,
      contentType,
      url,
      data,
    };
  }

  async #parseResponse(response, contentType) {
    if (
      contentType.includes("application/json") ||
      contentType.includes("+json")
    ) {
      try {
        return await response.json();
      } catch {
        return {
          message: "Response was marked as JSON but could not be parsed",
        };
      }
    }

    if (
      contentType.startsWith("text/") ||
      contentType.includes("xml") ||
      contentType.includes("html")
    ) {
      return await response.text();
    }

    return Buffer.from(await response.arrayBuffer());
  }
}

module.exports = RestCountries;
