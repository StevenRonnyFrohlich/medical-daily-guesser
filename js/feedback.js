(function () {
  const endpoint = (window.GAME_CONFIG && window.GAME_CONFIG.feedbackForm) || "";

  function $(id) {
    return document.getElementById(id);
  }

  function ensure() {
    if ($("feedback")) return;
    const wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.id = "feedback";
    wrap.innerHTML = `
      <div class="sheet">
        <h2>Feedback</h2>
        <p>A note, a wrong field, a better name — send it. Your message is forwarded privately. No public inbox on this page.</p>
        <form id="feedback-form" class="feedback-form">
          <label class="hp" aria-hidden="true">Leave blank <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
          <label>Message
            <textarea name="message" id="feedback-message" required rows="6" maxlength="4000" placeholder="What should change?"></textarea>
          </label>
          <label>Reply to <span>(optional)</span>
            <input type="text" name="reply" id="feedback-reply" maxlength="200" placeholder="Email or handle, only if you want a reply">
          </label>
          <div class="actions">
            <button class="btn" id="btn-feedback-send" type="submit">Send</button>
            <button class="btn" id="btn-close-feedback" type="button">Close</button>
          </div>
          <p class="feedback-status" id="feedback-status" role="status"></p>
        </form>
      </div>`;
    document.body.appendChild(wrap);

    wrap.addEventListener("click", (event) => {
      if (event.target.id === "feedback") close();
    });
    $("btn-close-feedback").addEventListener("click", close);
    $("feedback-form").addEventListener("submit", send);
  }

  function open() {
    ensure();
    $("feedback-status").textContent = "";
    $("feedback").classList.add("is-open");
    $("feedback-message").focus();
  }

  function close() {
    const modal = $("feedback");
    if (modal) modal.classList.remove("is-open");
  }

  async function send(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.website && form.website.value) return;
    const message = $("feedback-message").value.trim();
    const reply = $("feedback-reply").value.trim();
    const status = $("feedback-status");
    const button = $("btn-feedback-send");
    if (!message) return;
    if (!endpoint) {
      status.textContent = "Feedback is not connected on this copy of the site yet.";
      return;
    }
    button.disabled = true;
    status.textContent = "Sending…";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          reply: reply || "(no reply address)",
          _subject: "The Call feedback"
        })
      });
      if (!res.ok) throw new Error("send failed");
      status.textContent = "Received. Thank you.";
      $("feedback-message").value = "";
      $("feedback-reply").value = "";
    } catch {
      status.textContent = "Could not send. Try again in a moment.";
    } finally {
      button.disabled = false;
    }
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-feedback]")) {
      event.preventDefault();
      open();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  window.openFeedback = open;

  try {
    if (new URLSearchParams(location.search).has("feedback")) open();
  } catch {
    /* ignore */
  }
})();
