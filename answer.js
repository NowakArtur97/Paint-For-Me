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
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body,
      mode: "no-cors", // TODO: CHECK
    })
      .then((response) => console.log(response))
      .catch((error) => console.error(error.toString()));
  }

  checkAnswerBtnElement.addEventListener("click", sendPainting);
});
