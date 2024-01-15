document.addEventListener("DOMContentLoaded", () => {
  const brushSizeInputElement = document.querySelector(".control__input");
  const canvas = document.querySelector(".canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = brushSizeInputElement.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";

  brushSizeInputElement.addEventListener(
    "input",
    () => (ctx.lineWidth = brushSizeInputElement.value)
  );
});
