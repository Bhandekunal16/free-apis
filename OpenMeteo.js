const route = require("./jsons/routes.json");
const config = require("./jsons/openMeteo.json");

class OpenMeteo {
  #baseUrl = route.openMeteo;
  #defaultTimeout = config.defaultTimeout;
  #hourlyParams = config.hourlyParams;
  #dailyParams = config.dailyParams;

  constructor(config = {}) {
    this.#baseUrl = config.baseUrl ?? this.#baseUrl;
    this.#defaultTimeout = config.timeout ?? this.#defaultTimeout;
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
      latitude,
      longitude,

      hourly,
      daily,
      current,

      timezone = "auto",

      forecastDays,
      pastDays,

      temperatureUnit,
      windSpeedUnit,
      precipitationUnit,

      query = {},

      timeout = this.#defaultTimeout,
    } = options;

    if (latitude === undefined || latitude === null) {
      return {
        success: false,
        statusCode: 400,
        message: "latitude is required",
      };
    }

    if (longitude === undefined || longitude === null) {
      return {
        success: false,
        statusCode: 400,
        message: "longitude is required",
      };
    }

    if (Number(latitude) < -90 || Number(latitude) > 90) {
      return {
        success: false,
        statusCode: 400,
        message: "latitude must be between -90 and 90",
      };
    }

    if (Number(longitude) < -180 || Number(longitude) > 180) {
      return {
        success: false,
        statusCode: 400,
        message: "longitude must be between -180 and 180",
      };
    }

    const searchParams = new URLSearchParams();

    searchParams.set("latitude", latitude);
    searchParams.set("longitude", longitude);

    if (current) {
      const currentParams = this.#normalizeParams(current);

      if (currentParams.length) {
        searchParams.set("current", currentParams.join(","));
      }
    }

    if (hourly) {
      const hourlyParams = this.#normalizeParams(hourly);

      const invalidParams = hourlyParams.filter(
        (param) => !this.#hourlyParams.includes(param),
      );

      if (invalidParams.length) {
        return {
          success: false,
          statusCode: 400,
          message: `Invalid hourly parameter(s): ${invalidParams.join(", ")}`,
        };
      }

      if (hourlyParams.length) {
        searchParams.set("hourly", hourlyParams.join(","));
      }
    }

    if (daily) {
      const dailyParams = this.#normalizeParams(daily);

      const invalidParams = dailyParams.filter(
        (param) => !this.#dailyParams.includes(param),
      );

      if (invalidParams.length) {
        return {
          success: false,
          statusCode: 400,
          message: `Invalid daily parameter(s): ${invalidParams.join(", ")}`,
        };
      }

      if (dailyParams.length) {
        searchParams.set("daily", dailyParams.join(","));
      }
    }

    if (timezone) {
      searchParams.set("timezone", timezone);
    }

    if (forecastDays !== undefined) {
      searchParams.set("forecast_days", forecastDays);
    }

    if (pastDays !== undefined) {
      searchParams.set("past_days", pastDays);
    }

    if (temperatureUnit) {
      searchParams.set("temperature_unit", temperatureUnit);
    }

    if (windSpeedUnit) {
      searchParams.set("wind_speed_unit", windSpeedUnit);
    }

    if (precipitationUnit) {
      searchParams.set("precipitation_unit", precipitationUnit);
    }

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

    const url = `${this.#baseUrl}/v1/forecast?` + searchParams.toString();

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    let response;

    try {
      response = await fetch(url, {
        method: "GET",

        headers: {
          Accept: "application/json",
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
        message: "Failed to connect to Open-Meteo API",
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

  #normalizeParams(params) {
    if (!params) {
      return [];
    }

    if (Array.isArray(params)) {
      return params;
    }

    if (typeof params === "string") {
      return params
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
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

module.exports = OpenMeteo;
