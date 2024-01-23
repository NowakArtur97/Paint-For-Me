const API_GATEWAY = "API_GATEWAY_URL";
const API = `${API_GATEWAY}/paint-for-me`;

document.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.querySelector(".canvas");
  const answersContainerElement = document.querySelector(".answers__container");
  const answersBoxElement = document.querySelector(".answers__box");

  function sendPainting() {
    const image = canvasElement.toDataURL("image/png");
    const body = JSON.stringify({
      image,
    });
    console.log(API);
    fetch(API, {
      method: "POST",
      body,
    })
      .then((response) => response.json())
      .then((body) => handleRekognitionResponse(body))
      .catch((error) => console.error(error.toString()));
  }

  function handleRekognitionResponse(response) {
    const rekognitionAnswers = mapToAnswers(response);
    console.table(rekognitionAnswers);

    const answerElements = rekognitionAnswers.map((answer) => {
      const answerElement = createAnswerElement();
      createAnswerPropertyElement(
        answerElement,
        answer,
        "answer__name",
        "name"
      );
      createAnswerPropertyElement(
        answerElement,
        answer,
        "answer__confidence",
        "confidence"
      );

      return answerElement;
    });

    answersContainerElement.style.display = "flex";
    compareAnswers(answerElements);

    function mapToAnswers(response) {
      const labels = response["Labels"];
      return labels.map((answer) => {
        const [name, confidence] = [answer["Name"], answer["Confidence"]];
        return {
          name,
          confidence,
        };
      });
    }

    function createAnswerElement() {
      const answerElement = document.createElement("div");
      answerElement.classList.add("answer");
      answersBoxElement.appendChild(answerElement);
      return answerElement;
    }

    function createAnswerPropertyElement(
      answerElement,
      answer,
      cssClass,
      answerProperty
    ) {
      const answerPropertyElement = document.createElement("span");
      answerPropertyElement.classList.add(cssClass);
      answerPropertyElement.textContent = answer[answerProperty];
      answerElement.appendChild(answerPropertyElement);
    }

    function compareAnswers(answerElements) {
      const topic = document
        .querySelector(".paint__topic")
        .textContent.toLowerCase();
      answerElements.forEach((answerElement) => {
        const answerName = answerElement
          .querySelector(".answer__name")
          .textContent.toLowerCase();

        const doesTopicIncludeAnswer = topic.includes(answerName);
        const doesAnswerIncludeTopic = answerName.includes(topic);

        if (doesTopicIncludeAnswer || doesAnswerIncludeTopic) {
          answerElement.classList.add("answer--correct");
        }
      });
    }
  }

  function hideAnswers() {
    const previousAnswers = answersBoxElement.getElementsByClassName("answer");
    while (previousAnswers[0]) {
      previousAnswers[0].parentNode.removeChild(previousAnswers[0]);
    }
    answersContainerElement.style.display = "none";
  }

  document
    .querySelector("#check_answer")
    .addEventListener("click", sendPainting);
  answersContainerElement.addEventListener("click", hideAnswers);
});
