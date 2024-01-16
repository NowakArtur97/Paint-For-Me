document.addEventListener("DOMContentLoaded", () => {
  const brushSizeInputElement = document.querySelector(".control__input");
  const canvas = document.querySelector(".canvas");
  const clearCanvasBtnElement = document.querySelector("#clean_canvas");
  const canvasSize = canvas.getBoundingClientRect();
  const ctx = setupCanvas(canvas, brushSizeInputElement);
  let isDrawing = false;

  function setupCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.canvas.height = canvasSize.height;
    ctx.canvas.width = canvasSize.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = brushSizeInputElement.value;
    return ctx;
  }

  function startDrawing(e) {
    isDrawing = true;
    const mousePosition = {
      x: e.clientX - canvasSize.left,
      y: e.clientY - canvasSize.top,
    };
    ctx.beginPath();
    ctx.moveTo(mousePosition.x, mousePosition.y);
  }

  function draw(e) {
    if (!isDrawing) {
      return;
    }
    ctx.lineTo(e.clientX - canvasSize.left, e.clientY - canvasSize.top);
    ctx.stroke();
  }

  function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", () => (isDrawing = false));
  canvas.addEventListener("mouseout", () => (isDrawing = false));
  clearCanvasBtnElement.addEventListener("click", clearCanvas);
  brushSizeInputElement.addEventListener(
    "input",
    () => (ctx.lineWidth = brushSizeInputElement.value)
  );
  document.querySelectorAll(".color").forEach((colorElement) => {
    const color = colorElement.getAttribute("data-color");
    colorElement.style.backgroundColor = color;
    colorElement.addEventListener("click", () => (ctx.strokeStyle = color));
  });
});
