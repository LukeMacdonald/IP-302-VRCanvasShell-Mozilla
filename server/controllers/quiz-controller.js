const axios = require("axios");
const { JSDOM } = require("jsdom");

const { createRoom, createBot } = require("./hubs-controller");

const parseHTML = (tag, htmlString) => {
  var dom = new JSDOM(htmlString);
  return dom.window.document.querySelector(tag).textContent;
};

const quizData = async (course, quiz, token) => {
  try {
    const response = await axios.get(
      "https://rmit.instructure.com/api/v1/courses/134515/quizzes/618432/questions",
      {
        headers: {
          Authorization: token,
        },
      },
    );

    const questions = response.data.map((question) => {
      var questionText = parseHTML("p", question.question_text);
      return { question: questionText, options: question.answers };
    });

    return questions;
  } catch (error) {
    throw new Error("Error fetching quiz data: " + error.message);
  }
};

const startQuiz = async (quiz, token) => {
  try {
    const data = { preview: true };

    const response = await axios.post(
      "https://rmit.instructure.com/api/v1/courses/134515/quizzes/618432/submissions",
      data,
      {
        headers: {
          Authorization: token,
        },
      },
    );
  } catch (error) {
    throw new Error("Error starting quiz: " + error.message);
  }
};

const uploadQuiz = async (quiz, page) => {
  const questions = [];
  const options = [];

  quiz.forEach((question) => {
    const option = [];

    questions.push(question.question);

    // Check if question.options is an array with elements
    if (Array.isArray(question.options) && question.options.length > 0) {
      question.options.forEach((currentOption) => {
        option.push(currentOption.text);
      });
    }
    options.push(option);
  });

  try {
    const entity = await page.evaluate(
      (questions, options) => {
        const entity = document.createElement("a-entity");
        AFRAME.scenes[0].append(entity);
        entity.setAttribute("quiz", {
          questions: questions,
          qOptions: options,
        });
        return entity;
      },
      questions,
      options,
    );

    console.log("Entity:", entity);
  } catch (error) {
    throw new Error("Error adding quiz to room: " + error.message);
  }
};

exports.init = async (req, res) => {
  try {
    const roomData = await createRoom("Quiz");
    console.log(roomData);
    const data = await quizData(0, 0, req.headers.authorization);
    const botName = "Bot-Quiz";
    const page = await createBot(roomData.data.createRoom.id, botName);
    await uploadQuiz(data, page);

    await startQuiz(0, req.headers.authorization);
    res.status(200).json({ quiz: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.submit = async (req, res) => {};
