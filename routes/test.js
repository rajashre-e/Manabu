const { Router } = require("express");
const {
  testPage,
  vocabTest,
  getScore,
  showVocabResult,
  pronounceTest,
} = require("../controllers/test");

const router = Router();

router.get("/", testPage);
router.get("/vocab", vocabTest);
router.post("/vocab", getScore);
router.get("/vocab-result", showVocabResult);

router.get("/pronunciation", pronounceTest);

module.exports = router;
