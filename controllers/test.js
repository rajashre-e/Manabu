const Flashcard = require("../models/flashcard");
const Sentences = require("../sentences.json");

const testPage = async (req, res) => {
  res.render("test", { user: req.user, error: null });
};

const vocabTest = async (req, res) => {
  try {
    const questionFlashcards = await Flashcard.aggregate([
      { $match: { createdBy: req.user._id } },
      { $sample: { size: 10 } },
    ]);
    const allFlashcards = await Flashcard.find({ createdBy: req.user._id });

    const questions = questionFlashcards.map((card) => {
      const correct = card.english;
      let wrong = allFlashcards
        .filter((c) => c.english !== correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      let choices = [correct, ...wrong.map((c) => c.english)].sort(
        () => Math.random() - 0.5
      );
      return { question: card.japanese, correct, choices };
    });

    res.render("vocabtest", {
      user: req.user,
      questions,
      userAnswers: {},
      result: false,
      score: 0,
      total: questions.length,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("vocabtest", {
      user: req.user,
      questions: [],
      error: "COULD NOT LOAD TEST",
    });
  }
};

const getScore = async (req, res) => {
  const userAnswers = req.body.answers || {};
  const correctAnswers = req.body.correctAnswers || {};

  let score = 0;
  const quizQuestions = Object.keys(correctAnswers).map((question) => {
    const correct = correctAnswers[question];
    const userAnswer = userAnswers[question];
    const isCorrect = correct === userAnswer;
    if (isCorrect) score++;
    return { question, userAnswer, correctAnswer: correct, isCorrect };
  });

  req.session.vocabResult = {
    questions: quizQuestions,
    score,
    total: quizQuestions.length,
  };
  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save test results." });
    }
    res.redirect("/test/vocab-result");
  });
};

const showVocabResult = async (req, res) => {
  const data = req.session.vocabResult;

  if (!data) {
    return res.redirect("/test/vocab");
  }
  res.render("vocabresult", {
    user: req.user,
    questions: data.questions,
    score: data.score,
    total: data.total,
    error: null,
  });
};

const pronounceTest = async (req, res) => {
  try {
    const index = Math.floor(Math.random() * Sentences.length);
    const targetSentence = Sentences[index];

    res.render("pronouncetest", {
      user: req.user,
      targetSentence,
      error: null,
    });
  } catch (error) {
    res.status(500).render("pronouncetest", {
      user: req.user,
      targetSentence: null,
      error: "COULD NOT LOAD PAGE",
    });
  }
};

module.exports = {
  testPage,
  vocabTest,
  getScore,
  showVocabResult,
  pronounceTest,
};
