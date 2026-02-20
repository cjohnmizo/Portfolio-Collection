/* Created by cjohnmizo - Authorized */
// Agency Style JS
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled", "shadow-sm");
      navbar.classList.remove("bg-transparent");
    } else {
      navbar.classList.remove("scrolled", "shadow-sm");
      navbar.classList.add("bg-transparent");
    }
  });
});
