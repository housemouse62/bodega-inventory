window.addEventListener("load", () => {
  const scroll = sessionStorage.getItem("scrollY");
  if (scroll) {
    window.scrollTo(0, parseInt(scroll));
    sessionStorage.removeItem("scrollY");
  }
});

document.querySelector("form")?.addEventListener("submit", () => {
  sessionStorage.setItem("scrollY", window.scrollY);
});

document.querySelectorAll('a[href*="?edit="]').forEach((link) => {
  link.addEventListener("click", () => {
    sessionStorage.setItem("scrollY", window.scrollY);
  });
});
