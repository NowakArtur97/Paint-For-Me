document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".color")
    .forEach(
      (color) =>
        (color.style.backgroundColor = color.getAttribute("data-color"))
    );
});
