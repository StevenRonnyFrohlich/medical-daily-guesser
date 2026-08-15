(function () {
  function localApi() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return "http://localhost:8787";
    }
    return "";
  }

  window.CallApi = {
    base() {
      const local = localApi();
      if (local) return local;
      const cfg = window.GAME_CONFIG || {};
      if (cfg.catalogUrl) return String(cfg.catalogUrl).replace(/\/$/, "");
      return "";
    },
    async request(path, options) {
      const base = this.base();
      if (!base) throw new Error("API is not configured");
      const res = await fetch(`${base}${path}`, Object.assign({ credentials: "include" }, options || {}));
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    }
  };
})();
