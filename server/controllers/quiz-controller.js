const axios = require("axios");
const { JSDOM } = require("jsdom");
const { HUBS_PUBLIC_URL } = require("../config/config");

const db = require("../database")

const { createRoom, createBot } = require("./hubs-controller");

const parseHTML = (tag, htmlString) => {
  var dom = new JSDOM(htmlString);
  return dom.window.document.querySelector(tag).textContent;
};

const quizData = async (course, quiz, token) => {
  try {

    const quizData = await axios.get(
      "https://rmit.instructure.com/api/v1/courses/134515/quizzes/618432",
      {
        headers: {
          Authorization: token,
        },
      },
    );

    console.log(quizData.data.time_limit);
   
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

    return {time_limit: quizData.data.time_limit, questions: questions};
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

const uploadQuiz = async (quiz) => {
  const questions = [];
  const options = [];

  quiz.questions.forEach((question) => {
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

  return {questions, options}

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

const generateRandomToken = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
}

exports.spawn = async (req, res) => {
  const key = req.body.token;
  const courseID = req.params.courseID;
  const quizID = req.params.quizID;

  const token = generateRandomToken(10);

  db.createQuizSubmission(token, quizID, courseID, key);

  const room = await createRoom("Quiz");

  const url = `${HUBS_PUBLIC_URL}${room.data.createRoom.id}?quiz=${quizID}&token=${token}`


  // db.updateQuiz(token, 10);

  // db.deleteQuizSubmission(token);

  // 
  
  res.status(200).json({token, url})
}

exports.init = async (req, res) => {
  try {
    //const roomData = await createRoom("Quiz");
    // console.log(roomData);
    const token = req.params.token;

    // todo: Add call to check token in database


    const data = await quizData(0, 0, req.headers.authorization);
    // const botName = "Bot-Quiz";
    // const page = await createBot(roomData.data.createRoom.id, botName);
    const quiz = await uploadQuiz(data);

    console.log

    // await startQuiz(0, req.headers.authorization);
    res.status(200).json({ questions: quiz.questions, options: quiz.options, time_limit: data.time_limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.submit = async (req, res) => {
  const quizID = req.params.quizID;
  const answers = req.body
  console.log(quizID);
  console.log(answers);

  res.status(200).json({message:'quiz submitted'})
};
