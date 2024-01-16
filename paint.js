document.addEventListener("DOMContentLoaded", () => {
  const brushSizeInputElement = document.querySelector(".control__input");
  const canvas = document.querySelector(".canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = brushSizeInputElement.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "black";
  let lastX = 0;
  let lastY = 0;
  const canvasSize = canvas.getBoundingClientRect();
  ctx.canvas.height = canvasSize.height;
  ctx.canvas.width = canvasSize.width;
  let isDrawing = false;

  function draw(e) {
    if (!isDrawing) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(lastX - canvas.offsetLeft, lastY - canvas.offsetTop);
    ctx.lineTo(e.offsetX - canvas.offsetLeft, e.offsetY - canvas.offsetTop);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.clientY];
  }

  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.clientY];
  });
  canvas.addEventListener("mouseup", () => (isDrawing = false));
  canvas.addEventListener("mouseout", () => (isDrawing = false));

  document.querySelectorAll(".color").forEach((colorElement) => {
    const color = colorElement.getAttribute("data-color");
    colorElement.style.backgroundColor = color;
    colorElement.addEventListener("click", () => (ctx.strokeStyle = color));
  });

  brushSizeInputElement.addEventListener(
    "input",
    () => (ctx.lineWidth = brushSizeInputElement.value)
  );
});
