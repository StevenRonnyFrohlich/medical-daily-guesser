(function () {
  const links = document.querySelectorAll("[data-account]");
  const lobby = document.getElementById("lobby-account");
  if (!window.CallApi || !window.CallApi.base()) return;

  window.CallApi.request("/me")
    .then((data) => {
      if (!data.user) return;
      links.forEach((el) => {
        el.textContent = "Account";
        el.setAttribute("title", data.user.email);
      });
      if (lobby) {
        lobby.innerHTML = `Signed in. <a href="account.html" data-account>Account</a> · play still works if you log out.`;
        lobby.querySelector("[data-account]").setAttribute("title", data.user.email);
      }
    })
    .catch(() => {
      /* anonymous play is the default */
    });
})();
