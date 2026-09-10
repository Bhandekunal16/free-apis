class MockData {
  #api = require("../jsons/routes.json");
  #config = require("../jsons/mockData.json");

  #params;
  #filters;
  #defaultTimeout = 10000;

  constructor() {
    this.#params = this.#config.params ?? [];
    this.#filters = this.#config.filters ?? [];
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
      type,
      id,
      subtype,
      paramKey,
      paramValue,
      query = {},
      page,
      limit,
      skip,
      sortBy,
      order,
      timeout = this.#defaultTimeout,
    } = options;

    if (!type) {
      return {
        success: false,
        statusCode: 400,
        message: "type is required",
      };
    }

    if (!this.#params.includes(type)) {
      return {
        success: false,
        statusCode: 400,
        message: `Invalid type '${type}'`,
      };
    }

    const baseUrl = this.#api.mockData;

    let url = `${baseUrl}/${encodeURIComponent(type)}`;

    if (id !== undefined && id !== null) {
      url += `/${encodeURIComponent(id)}`;
    } else if (subtype) {
      url += `/${encodeURIComponent(subtype)}`;
    }

    const searchParams = new URLSearchParams();

    if (paramKey && paramValue !== undefined) {
      if (!this.#filters.includes(paramKey)) {
        return {
          success: false,
          statusCode: 400,
          message: `Invalid filter '${paramKey}'`,
        };
      }

      searchParams.set(paramKey, paramValue);
    }

    if (query && typeof query === "object") {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","));
        } else {
          searchParams.set(key, String(value));
        }
      }
    }

    if (page !== undefined) {
      searchParams.set("page", page);
    }

    if (limit !== undefined) {
      searchParams.set("limit", limit);
    }

    if (skip !== undefined) {
      searchParams.set("skip", skip);
    }

    // Sorting
    if (sortBy) {
      searchParams.set("sortBy", sortBy);
    }

    if (order) {
      searchParams.set("order", order);
    }

    const queryString = searchParams.toString();

    if (queryString) {
      url += `?${queryString}`;
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    let response;

    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
        signal: controller.signal,
      });
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
        message: "Failed to connect to API",
        error: error.message,
        url,
      };
    } finally {
      clearTimeout(timer);
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    const statusCode = response.status;

    if (!response.ok) {
      return {
        success: false,
        statusCode,
        statusText: response.statusText,
        contentType,
        url,
        data: await this.#parseResponse(response, contentType),
      };
    }

    const data = await this.#parseResponse(response, contentType);

    return {
      success: true,
      statusCode,
      contentType,
      url,
      data,
    };
  }

  async #parseResponse(response, contentType) {
    // JSON
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

module.exports = MockData;
