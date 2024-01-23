const API_GATEWAY = "API_GATEWAY_URL";
const API = `${API_GATEWAY}/paint-for-me`;

const EXAMPLE_RESPONSE = {
  Labels: [
    {
      Name: "Bonfire",
      Confidence: 90.44812774658203,
      Instances: [
        {
          BoundingBox: {
            Width: 0.6853520274162292,
            Height: 0.8128940463066101,
            Left: 0.26424214243888855,
            Top: 0.1860104650259018,
          },
          Confidence: 90.44812774658203,
        },
      ],
      Parents: [{ Name: "Fire" }, { Name: "Flame" }],
      Aliases: [],
      Categories: [{ Name: "Travel and Adventure" }],
    },
    {
      Name: "Anime",
      Confidence: 89.88842010498047,
      Instances: [],
      Parents: [],
      Aliases: [],
      Categories: [{ Name: "Colors and Visual Composition" }],
    },
    {
      Name: "Person",
      Confidence: 84.12760925292969,
      Instances: [
        {
          BoundingBox: {
            Width: 0.2309209555387497,
            Height: 0.8155634999275208,
            Left: 0.4485149681568146,
            Top: 0.18332011997699738,
          },
          Confidence: 84.12760925292969,
        },
      ],
      Parents: [],
      Aliases: [{ Name: "Human" }],
      Categories: [{ Name: "Person Description" }],
    },
  ],
  LabelModelVersion: "3.0",
  ResponseMetadata: {
    RequestId: "098165a0-e80e-47e1-8f53-812dacf82039",
    HTTPStatusCode: 200,
    HTTPHeaders: {
      "x-amzn-requestid": "098165a0-e80e-47e1-8f53-812dacf82039",
      "content-type": "application/x-amz-json-1.1",
      "content-length": "814",
      date: "Sat, 20 Jan 2024 15:31:51 GMT",
    },
    RetryAttempts: 0,
  },
};

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
      .catch((error) => handleRekognitionResponse(error));
    // .catch((error) => console.error(error.toString()));
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
      const labels = EXAMPLE_RESPONSE["Labels"];
      // const labels = response["Labels"];
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
