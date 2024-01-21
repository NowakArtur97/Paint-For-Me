const API_GATEWAY = "API_GATEWAY_URL";
const API = `${API_GATEWAY}/paint-for-me`;

document.addEventListener("DOMContentLoaded", () => {
  const checkAnswerBtnElement = document.querySelector("#check_answer");
  const canvas = document.querySelector(".canvas");

  function sendPainting() {
    const image = canvas.toDataURL("image/png");
    const body = JSON.stringify({
      image,
    });
    console.log(body);
    console.log(API);
    fetch(API, {
      method: "POST",
      body,
    })
      .then((response) => response.json())
      .then((body) => console.log(body))
      .catch((error) => console.error(error.toString()));
  }

  checkAnswerBtnElement.addEventListener("click", sendPainting);
});
