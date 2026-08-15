(function () {
  const params = new URLSearchParams(location.search);
  const status = document.getElementById("login-status");
  const loginPanel = document.getElementById("login-panel");
  const homePanel = document.getElementById("home-panel");

  if (params.get("error") === "expired") status.textContent = "That link expired. Request a new one.";
  if (params.get("error") === "missing") status.textContent = "Missing login token.";

  document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Sending…";
    try {
      const data = await window.CallApi.request("/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: document.getElementById("login-email").value })
      });
      if (data.devLink) {
        status.innerHTML = `Mail is not configured locally. <a href="${data.devLink}">Open the login link</a>.`;
      } else {
        status.textContent = data.sent ? "Check your inbox." : "Link created. Check server logs if mail did not arrive.";
      }
    } catch (error) {
      status.textContent = error.message;
    }
  });

  document.getElementById("btn-logout").addEventListener("click", async () => {
    try {
      await window.CallApi.request("/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    location.reload();
  });

  async function boot() {
    try {
      const data = await window.CallApi.request("/me");
      if (!data.user) return;
      loginPanel.hidden = true;
      homePanel.hidden = false;
      document.getElementById("user-email").textContent = data.user.email;
      document.getElementById("admin-link").hidden = !data.user.admin;
      const mine = await window.CallApi.request("/submissions");
      const list = document.getElementById("my-subs");
      list.innerHTML = "";
      (mine.submissions || []).forEach((row) => {
        const item = document.createElement("li");
        item.textContent = `${row.diagnosis} (${row.plain}) — ${row.status}`;
        list.appendChild(item);
      });
      if (!list.children.length) list.innerHTML = "<li>None yet.</li>";
    } catch (error) {
      if (!window.CallApi.base()) status.textContent = "The API is not configured on this copy of the site.";
      else if (!status.textContent) status.textContent = error.message;
    }
  }

  boot();
})();
