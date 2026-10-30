(function () {
  "use strict";

  // ============================================================
  // CONFIG
  // ============================================================

  const API_KEY = "REDACTED";
  const CURRENT_SCRIPT = document.currentScript;
  const FEED_NAME = (CURRENT_SCRIPT && CURRENT_SCRIPT.dataset.feed) || "space";
  const TARGET_ID = (CURRENT_SCRIPT && CURRENT_SCRIPT.dataset.targetId) || "recently-announced-shows";
  const LIMIT = 4;

  const FEED_CONFIGS = {
    space: {
      accentColor: "#993d00",
      hoverColor: "#bb794f",
      promoterIds: ["6085"],
      titleFontFamily: "inherit",
      venueIds: ["KovZpakJQe", "KovZ917At8O"]
    },
    thalia: {
      accentColor: "#5d071b",
      hoverColor: "#9e2d2d",
      promoterIds: [],
      source: "ticketweb",
      titleFontFamily: "BebasNeue, bebas-neue, bebas_neueregular, DINPro, Helvetica, sans-serif",
      venueIds: ["rZ7HnEZ17aJq7", "rZ7HnEZ17aJq0", "KovZpZAktlaA"]
    }
  };

  const FEED_CONFIG = FEED_CONFIGS[FEED_NAME] || FEED_CONFIGS.space;

  function buildApiUrl(parameterName, parameterValue) {
    const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
    url.searchParams.set("size", "200");
    url.searchParams.set("apikey", API_KEY);
    url.searchParams.set(parameterName, parameterValue);
    url.searchParams.set("sort", "onSaleStartDate,asc");

    if (FEED_CONFIG.source) {
      url.searchParams.set("source", FEED_CONFIG.source);
    }

    return url.toString();
  }

  const API_URLS = [];

  if (FEED_CONFIG.venueIds.length) {
    API_URLS.push(buildApiUrl("venueId", FEED_CONFIG.venueIds.join(",")));
  }

  FEED_CONFIG.promoterIds.forEach(function (promoterId) {
    API_URLS.push(buildApiUrl("promoterId", promoterId));
  });


  // ============================================================
  // CSS
  // ============================================================

  const styles = `

    /* ----------------------------------------
       Section headings
       ---------------------------------------- */

    .event-feed-section {
      width: 100%;
    }

    .event-feed-recent {
      margin-bottom: 3.5rem;
    }

    .event-feed-heading {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 0 0 1.25rem;
      width: 100%;
    }

    .event-feed-heading h2 {
      margin: 0;
      white-space: nowrap;
      color: ${FEED_CONFIG.accentColor};
      font-size: 1.5rem;
      line-height: 1;
      text-transform: uppercase;
    }

    .event-feed-heading::after {
      content: "";
      display: block;
      flex: 1;
      height: 1px;
      background: #8e8781;
      opacity: 0.4;
    }


    /* ----------------------------------------
       Recently announced grid
       ---------------------------------------- */

    #${TARGET_ID} {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
      width: 100%;
    }

    #${TARGET_ID} * {
      box-sizing: border-box;
    }

    #${TARGET_ID} .recent-show {
      display: flex;
      flex-direction: column;
      min-width: 0;
      background: #fff;
      border-radius: 2px;
      overflow: hidden;
      box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.49);
    }

    #${TARGET_ID} .recent-show__image {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: #eee;
    }

    #${TARGET_ID} .recent-show__image img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    #${TARGET_ID} .recent-show__details {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    #${TARGET_ID} .recent-show__date {
      padding: 10px 10px 0;
      color: #8e8781;
      text-transform: uppercase;
      font-size: 0.9rem;
    }

    #${TARGET_ID} .recent-show__title {
      margin: 10px;
      color: ${FEED_CONFIG.accentColor};
      font-family: ${FEED_CONFIG.titleFontFamily};
      font-size: 1.25rem;
      line-height: 1.2;
    }

    #${TARGET_ID} .recent-show__venue {
      margin: auto 10px 12px;
      color: #636363;
      font-size: 0.9rem;
    }

    #${TARGET_ID} .recent-show__tickets {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background: #231f20;
      color: #fff;
      text-align: center;
      text-decoration: none;
      text-transform: uppercase;
    }

    #${TARGET_ID} .recent-show__tickets:hover {
      background: ${FEED_CONFIG.hoverColor};
      color: #fff;
    }

    #${TARGET_ID} .recently-announced-status {
      grid-column: 1 / -1;
      padding: 1rem;
      text-align: center;
      color: #636363;
    }


    /* ----------------------------------------
       Responsive
       ---------------------------------------- */

    @media (max-width: 760px) {
      #${TARGET_ID} {
        grid-template-columns: 1fr;
      }

      .event-feed-heading {
        gap: 0.75rem;
      }

      .event-feed-heading h2 {
        font-size: 1.25rem;
      }

      .event-feed-recent {
        margin-bottom: 2.5rem;
      }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);


  // ============================================================
  // HELPERS
  // ============================================================

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function announcedAt(event) {
    const publicStart = event?.sales?.public?.startDateTime;

    if (publicStart) {
      return publicStart;
    }

    const presales = (event?.sales?.presales || [])
      .map(function (presale) {
        return presale.startDateTime;
      })
      .filter(Boolean)
      .sort();

    return presales[0] || null;
  }

  function getEventImage(event) {
    const images = event?.images || [];

    if (!images.length) {
      return "";
    }

    let preferred = null;

    // Match existing SPACE widget behavior:
    // Ticketweb events prefer Ticketweb-hosted artwork.
    if ((event.url || "").includes("ticketweb")) {
      preferred = images.find(function (image) {
        return (
          !image.fallback &&
          (image.url || "").includes("ticketweb")
        );
      });
    }

    // Otherwise prefer a non-fallback 16:9 / 640 image.
    if (!preferred) {
      preferred = images.find(function (image) {
        return (
          !image.fallback &&
          image.ratio === "16_9" &&
          image.width === 640
        );
      });
    }

    if (preferred) {
      return preferred.url;
    }

    // Largest non-fallback image.
    const nonFallback = images
      .filter(function (image) {
        return !image.fallback;
      })
      .sort(function (a, b) {
        return (b.width || 0) - (a.width || 0);
      });

    if (nonFallback.length) {
      return nonFallback[0].url;
    }

    return images[0]?.url || "";
  }

  function formatEventDate(event) {
    const localDate = event?.dates?.start?.localDate;

    if (!localDate) {
      return "Date TBA";
    }

    const parts = localDate.split("-");

    if (parts.length !== 3) {
      return localDate;
    }

    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric"
    });
  }

  function getVenueName(event) {
    return event?._embedded?.venues?.[0]?.name || "";
  }

  function isUpcoming(event) {
    const localDate = event?.dates?.start?.localDate;

    if (!localDate) {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = localDate.split("-");

    if (parts.length !== 3) {
      return true;
    }

    const eventDate = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    return eventDate >= today;
  }


  // ============================================================
  // API
  // ============================================================

  async function getJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        "Ticketmaster returned " +
        response.status +
        " " +
        response.statusText +
        (body ? " — " + body : "")
      );
    }

    return response.json();
  }


  // ============================================================
  // DATA PROCESSING
  // ============================================================

  function mergeAndDedupe(responses) {
    const byId = new Map();

    responses.forEach(function (response) {
      const events = response?._embedded?.events || [];

      events.forEach(function (event) {
        if (event?.id && !byId.has(event.id)) {
          byId.set(event.id, event);
        }
      });
    });

    return Array.from(byId.values());
  }

  function getRecentlyAnnounced(events) {
    return events
      .filter(function (event) {
        if (event?.dates?.status?.code === "cancelled") {
          return false;
        }

        if (!isUpcoming(event)) {
          return false;
        }

        if (!announcedAt(event)) {
          return false;
        }

        return true;
      })
      .sort(function (a, b) {
        return (
          new Date(announcedAt(b)).getTime() -
          new Date(announcedAt(a)).getTime()
        );
      })
      .slice(0, LIMIT);
  }


  // ============================================================
  // RENDERING
  // ============================================================

  function renderStatus(message) {
    const container = document.getElementById(TARGET_ID);

    if (!container) {
      return;
    }

    container.innerHTML =
      '<div class="recently-announced-status">' +
      escapeHtml(message) +
      "</div>";
  }

  function render(events) {
    const container = document.getElementById(TARGET_ID);

    if (!container) {
      console.warn(
        "Recently Announced: #" + TARGET_ID + " was not found."
      );
      return;
    }

    if (!events.length) {
      renderStatus("No recently announced shows found.");
      return;
    }

    container.innerHTML = events
      .map(function (event) {
        const name = escapeHtml(event.name);
        const url = escapeHtml(event.url);
        const image = escapeHtml(getEventImage(event));
        const date = escapeHtml(formatEventDate(event));
        const venue = escapeHtml(getVenueName(event));

        return `
          <article class="recent-show">

            ${
              image
                ? `
                  <a
                    class="recent-show__image"
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="${image}"
                      alt="${name}"
                      loading="lazy"
                    >
                  </a>
                `
                : ""
            }

            <div class="recent-show__details">

              <div class="recent-show__date">
                ${date}
              </div>

              <h3 class="recent-show__title">
                ${name}
              </h3>

              ${
                venue
                  ? `
                    <div class="recent-show__venue">
                      ${venue}
                    </div>
                  `
                  : ""
              }

              <a
                class="recent-show__tickets"
                href="${url}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tickets
              </a>

            </div>

          </article>
        `;
      })
      .join("");
  }


  // ============================================================
  // INIT
  // ============================================================

  async function init() {
    const container = document.getElementById(TARGET_ID);

    if (!container) {
      console.warn(
        "Recently Announced widget not initialized: #" +
        TARGET_ID +
        " does not exist."
      );
      return;
    }

    renderStatus("Loading shows...");

    try {
      const results = await Promise.allSettled(
        API_URLS.map(function (url) {
          return getJson(url);
        })
      );

      results.forEach(function (result, index) {
        if (result.status === "rejected") {
          console.warn(
            "Recently Announced source " +
            (index + 1) +
            " failed:",
            result.reason
          );
        }
      });

      const successfulResponses = results
        .filter(function (result) {
          return result.status === "fulfilled";
        })
        .map(function (result) {
          return result.value;
        });

      if (successfulResponses.length === 0) {
        throw new Error(
          "Both Ticketmaster requests failed."
        );
      }

      const allEvents = mergeAndDedupe(
        successfulResponses
      );

      const recentlyAnnounced =
        getRecentlyAnnounced(allEvents);

      render(recentlyAnnounced);

    } catch (error) {
      console.error(
        "Recently Announced widget failed:",
        error
      );

      renderStatus(
        "Unable to load shows."
      );
    }
  }


  // ============================================================
  // START
  // ============================================================

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
