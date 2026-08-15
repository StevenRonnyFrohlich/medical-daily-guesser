(function () {
  const form = document.getElementById("submit-form");
  const status = document.getElementById("submit-status");
  const track = document.getElementById("track");
  const proposed = document.getElementById("proposed-wrap");

  track.addEventListener("change", () => {
    proposed.hidden = track.value !== "new";
  });

  async function requireUser() {
    const data = await window.CallApi.request("/me");
    if (!data.user) {
      location.href = "account.html";
      return null;
    }
    return data.user;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Uploading…";
    const body = new FormData(form);
    const files = form.querySelector('input[type="file"]').files;
    if (!files.length || files.length > 3) {
      status.textContent = "Attach 1–3 images.";
      return;
    }
    try {
      await window.CallApi.request("/submissions", { method: "POST", body });
      status.textContent = "Received. It stays private until it is reviewed.";
      form.reset();
      proposed.hidden = true;
    } catch (error) {
      status.textContent = error.message;
    }
  });

  requireUser().catch(() => {
    location.href = "account.html";
  });
})();
