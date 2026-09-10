const config = require("../jsons/fakeData.json");
const routes = require("../jsons/routes.json");

class FakeData {
  #resources = new Set(config.resources ?? []);
  #baseUrl = routes.fakeData;
  #timeout = config.timeout ?? 8000;

  #cacheEnabled = config.cache?.enabled ?? false;
  #cacheTTL = config.cache?.ttl ?? 30000;

  #cache = new Map();

  async init(options = {}) {
    const {
      type,
      id,
      subtype,
      query = {},
    } = typeof options === "string" ? { type: options } : options;

    if (!type) {
      return this.#error(400, "type is required");
    }

    if (!this.#resources.has(type)) {
      return this.#error(400, `Invalid resource '${type}'`);
    }

    const url = this.#buildUrl({
      type,
      id,
      subtype,
      query,
    });

    if (this.#cacheEnabled) {
      const cached = this.#getCache(url);

      if (cached) {
        return {
          ...cached,
          cached: true,
        };
      }
    }

    const response = await this.#fetch(url);

    if (!response.ok) {
      return this.#error(
        response.status,
        `Fake API returned ${response.status}`,
        {
          url,
          statusText: response.statusText,
        },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    const data = await this.#parseResponse(response, contentType);

    const result = this.#success({
      data,
      url,
      contentType,
    });

    if (this.#cacheEnabled) {
      this.#setCache(url, result);
    }

    return result;
  }

  #buildUrl({ type, id, subtype, query }) {
    const parts = [this.#baseUrl, encodeURIComponent(type)];

    if (id !== undefined && id !== null) {
      parts.push(encodeURIComponent(id));
    }

    if (subtype) {
      parts.push(encodeURIComponent(subtype));
    }

    const url = parts.join("/");

    const searchParams = new URLSearchParams();

    if (query && typeof query === "object") {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === "") {
          continue;
        }

        if (Array.isArray(value)) {
          for (const item of value) {
            searchParams.append(key, String(item));
          }
        } else {
          searchParams.set(key, String(value));
        }
      }
    }

    const queryString = searchParams.toString();

    return queryString ? `${url}?${queryString}` : url;
  }

  async #fetch(url) {
    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), this.#timeout);

    try {
      return await fetch(url, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(`Request timeout after ${this.#timeout}ms`);
      }

      throw new Error(`Fake API request failed: ${error.message}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  async #parseResponse(response, contentType) {
    if (
      contentType.includes("application/json") ||
      contentType.includes("+json")
    ) {
      return response.json();
    }

    if (contentType.startsWith("text/")) {
      return response.text();
    }

    return Buffer.from(await response.arrayBuffer());
  }

  #success({ data, url, contentType }) {
    const isArray = Array.isArray(data);

    return {
      success: true,

      statusCode: 200,

      status: true,

      data,

      length: isArray ? data.length : 1,

      type: isArray ? "collection" : "object",

      contentType,

      url,
    };
  }

  #error(statusCode, message, extra = {}) {
    return {
      success: false,

      statusCode,

      status: false,

      message,

      ...extra,
    };
  }

  #getCache(key) {
    const item = this.#cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > this.#cacheTTL) {
      this.#cache.delete(key);

      return null;
    }

    return item.data;
  }

  #setCache(key, data) {
    this.#cache.set(key, {
      timestamp: Date.now(),
      data,
    });
  }

  clearCache() {
    this.#cache.clear();
  }

  getCacheSize() {
    return this.#cache.size;
  }
}

module.exports = FakeData;
