/*
  GetScry Tracking Script
  ------------------------
  Ye script visitor ka behavior capture karta hai across pages, aur
  session khatam hone pe (ya har naye page pe) /track ko data bhejta hai.

  Kaise use karein: is file ko har store page mein include karein:
  <script src="/static/tracker.js"></script>
*/

(function () {
  const SESSION_KEY = "getscry_session_id";
  const STATE_KEY = "getscry_session_state";

  // Session ID generate/retrieve karein (browser tab ke sessionStorage mein)
  function getSessionId() {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }

  // Session state load/save karein (sessionStorage mein - taake page reload pe na khoye)
  function getState() {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
    return {
      total_pages: 0,
      total_duration: 0,
      product_pages: 0,
      administrative: 0,
      administrative_duration: 0,
      informational: 0,
      informational_duration: 0,
      page_values: 0,
      first_seen: Date.now(),
    };
  }

  function saveState(state) {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  const pageEnterTime = Date.now();
  const pageType = document.body.getAttribute("data-page-type") || "other"; // "product", "admin", "info", "other"
  const pageValue = parseFloat(document.body.getAttribute("data-page-value") || "0");

  const state = getState();
  state.total_pages += 1;

  if (pageType === "product") {
    state.product_pages += 1;
  } else if (pageType === "admin") {
    state.administrative += 1;
  } else if (pageType === "info") {
    state.informational += 1;
  }

  if (pageValue > state.page_values) {
    state.page_values = pageValue;
  }

  saveState(state);

  // Har baar jab visitor page chhode (ya tab band kare), duration update kar ke backend ko bhejein
  function sendTrackingData() {
    const apiUrl = window.GETSCRY_API_URL || "http://127.0.0.1:8000";
    const timeOnPage = (Date.now() - pageEnterTime) / 1000; // seconds
    const currentState = getState();
    currentState.total_duration += timeOnPage;

    if (pageType === "admin") {
      currentState.administrative_duration += timeOnPage;
    } else if (pageType === "info") {
      currentState.informational_duration += timeOnPage;
    }

    saveState(currentState);

    const payload = {
      session_id: getSessionId(),
      total_pages: currentState.total_pages,
      total_duration: currentState.total_duration,
      product_pages: currentState.product_pages,
      administrative: currentState.administrative,
      administrative_duration: currentState.administrative_duration,
      informational: currentState.informational,
      informational_duration: currentState.informational_duration,
      bounce_rates: currentState.total_pages <= 1 ? 0.2 : 0.02,
      exit_rates: currentState.total_pages <= 1 ? 0.25 : 0.03,
      page_values: currentState.page_values,
      special_day: 0.0,
      operating_systems: 2,
      browser: 2,
      region: 1,
      traffic_type: 2,
    };

    // sendBeacon use karte hain taake page unload ke waqt bhi reliably data chala jaye
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(apiUrl + "/track", blob);
    } else {
      fetch(apiUrl + "/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  }

  window.addEventListener("beforeunload", sendTrackingData);
  window.addEventListener("pagehide", sendTrackingData);
})();