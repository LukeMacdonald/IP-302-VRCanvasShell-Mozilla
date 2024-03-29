const axios = require("axios");
const { v4: uuid } = require("uuid");
const { JSDOM } = require("jsdom");
const { HUBS_PUBLIC_URL, CANVAS_BASE_URL } = require("../config/config");

const db = require("../config/db");

const { createRoom } = require("./hubs-controller");

const parseHTML = (tag, htmlString) => {
  var dom = new JSDOM(htmlString);
  return dom.window.document.querySelector(tag).textContent;
};

const getQuiz = async (course, quiz, token) => {
  try {
    const quizData = await axios.get(
      `${CANVAS_BASE_URL}courses/${course}/quizzes/${quiz}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const response = await axios.get(
      `${CANVAS_BASE_URL}courses/${course}/quizzes/${quiz}/questions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const questions = response.data.map((question) => {
      var questionText = parseHTML("p", question.question_text);
      return { question: questionText, options: question.answers };
    });

    return { time_limit: quizData.data.time_limit, questions: questions };
  } catch (error) {
    throw new Error("Error fetching quiz data: " + error.message);
  }
};

const startQuiz = async (quiz, token) => {
  try {
    const data = { preview: true };

    const response = await axios.post(
      `${CANVAS_BASE_URL}courses/134515/quizzes/${quiz}/submissions`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    throw new Error("Error starting quiz: " + error.message);
  }
};

const formatQuiz = async (quiz) => {
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

  return { questions, options };
};

const submitQuiz = async (quizData, answers) => {
  const submission_answers = [];

  answers.map((answer, index) => {
    submission_answers.push({
      id: index + 1,
      answer: answer,
    });
  });

  const submission = {
    attempt: 1,
    validation_token: quizData.validation_token,
    access_code: null,
    quiz_questions: submission_answers,
  };

  const response = await axios.post(
    `${CANVAS_BASE_URL}quiz_submissions/${quizData.submission}/questions`,
    submission,
    {
      headers: {
        Authorization: `Bearer ${quizData.key}`,
      },
    },
  );

  response = await axios.get(
    `${CANVAS_BASE_URL}courses/${quizData.course}/quizzes/${quizData.quiz}/submissions/${quizData.submission}/complete`,
    {
      headers: {
        Authorization: `Bearer ${quizData.key}`,
      },
    },
  );
};

exports.spawn = async (req, res) => {
  const key = req.body.token;

  const courseID = req.params.courseID;

  const quizID = req.params.quizID;

  const token = uuid();
  await db.quizzes.create({
    token: token,
    quizId: quizID,
    courseId: courseID,
    key: key,
  });

  // const room = await createRoom("Quiz");

  const url = `https://localhost:8080/hub.html?hub_id=Ep6crWj&quiz=${quizID}&token=${token}`;

  res.status(200).json({ token, url });
};

exports.init = async (req, res) => {
  try {
    const token = req.params.token;
    const submission = await db.quizzes.findByPk(token);

    if (!submission) {
      res.status(204).json({ message: "request not found" });
    } else {
      const data = await getQuiz(
        submission.course,
        submission.quiz,
        submission.key,
      );

      const quiz = await formatQuiz(data);

      const response = await startQuiz(submission.quiz, submission.key);

      const currentSubmission = response.data.quiz_submissions[0];

      const quizSubmission = await db.quizzes.findByPk(token);

      quizSubmission.submissionId = currentSubmission.id;
      quizSubmission.validationToken = currentSubmission.validationToken;

      quizSubmission.save();

      res.status(200).json({
        questions: quiz.questions,
        options: quiz.options,
        time_limit: data.time_limit,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.submit = async (req, res) => {
  const token = req.params.token;
  const answers = req.body;
  const submission = await db.quizzes.findByPk(token);
  // await submitQuiz(submission, answers.answers);
  await db.quizzes.destroy({ where: { token: token } });

  res.status(200).json({ message: "quiz submitted" });
};
