(function () {
  const root = document.getElementById("queue");
  const usersRoot = document.getElementById("users-list");
  const usersPanel = document.getElementById("users-panel");
  const status = document.getElementById("admin-status");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  async function boot() {
    try {
      const me = await window.CallApi.request("/me");
      if (!me.user) {
        location.href = "account.html";
        return;
      }
      if (!me.user.admin) {
        status.textContent = "This queue is for the site admin.";
        return;
      }
      const data = await window.CallApi.request("/admin/queue");
      root.innerHTML = "";
      if (usersPanel) usersPanel.hidden = false;
      await renderUsers();
      if (!(data.items || []).length) {
        root.innerHTML = "<p>Nothing waiting.</p>";
        return;
      }
      const trayOptions = (data.trays || [])
        .map((tray) => `<option value="${escapeHtml(tray.id)}">${escapeHtml(tray.label)}</option>`)
        .join("");
      data.items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "queue-card";
        const images = (item.images || [])
          .map((src) => `<img src="${escapeHtml(src)}" alt="">`)
          .join("");
        card.innerHTML = `
          <p class="credit">From ${escapeHtml(item.email)} · ${escapeHtml(item.track)}${item.proposed_label ? ` (${escapeHtml(item.proposed_label)})` : ""}</p>
          <div class="queue-images">${images}</div>
          <p><strong>${escapeHtml(item.diagnosis)}</strong> (${escapeHtml(item.plain)})</p>
          <p>${escapeHtml(item.scientific)}</p>
          <p>${escapeHtml(item.blurb)}</p>
          <p>${escapeHtml((item.lookalikes || []).join(" · "))}</p>
          <label>Tray
            <select data-track>${trayOptions}<option value="${escapeHtml(item.track)}">${escapeHtml(item.track)}</option></select>
          </label>
          <div class="actions">
            <button class="btn" type="button" data-approve="${escapeHtml(item.id)}">Approve</button>
            <button class="btn" type="button" data-reject="${escapeHtml(item.id)}">Reject</button>
          </div>`;
        const select = card.querySelector("[data-track]");
        select.value = item.track;
        root.appendChild(card);
      });
    } catch (error) {
      status.textContent = error.message;
    }
  }

  function formatWhen(ms) {
    const date = new Date(Number(ms));
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  }

  async function renderUsers() {
    if (!usersRoot) return;
    const data = await window.CallApi.request("/admin/users");
    const rows = data.users || [];
    if (!rows.length) {
      usersRoot.innerHTML = "<p>No signups yet.</p>";
      return;
    }
    usersRoot.innerHTML = `<table class="users-table"><thead><tr><th>Email</th><th>Signed up</th></tr></thead><tbody>${rows
      .map(
        (row) =>
          `<tr><td>${escapeHtml(row.email)}</td><td>${escapeHtml(formatWhen(row.created_at))}</td></tr>`
      )
      .join("")}</tbody></table>`;
  }

  root.addEventListener("click", async (event) => {
    const approve = event.target.closest("[data-approve]");
    const reject = event.target.closest("[data-reject]");
    const card = event.target.closest(".queue-card");
    try {
      if (approve) {
        const track = card.querySelector("[data-track]").value;
        await window.CallApi.request(`/admin/submissions/${approve.getAttribute("data-approve")}/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ track })
        });
        status.textContent = "Approved.";
        boot();
      }
      if (reject) {
        await window.CallApi.request(`/admin/submissions/${reject.getAttribute("data-reject")}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}"
        });
        status.textContent = "Rejected.";
        boot();
      }
    } catch (error) {
      status.textContent = error.message;
    }
  });

  boot();
})();
