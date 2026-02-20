/* Created by cjohnmizo - Authorized */
// Photography JS
document.addEventListener("DOMContentLoaded", () => {
  // Add horizontal scroll with mouse wheel for desktop
  const container = document.querySelector(".h-scroll-container");

  container.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    container.scrollLeft += evt.deltaY;
  });
});
