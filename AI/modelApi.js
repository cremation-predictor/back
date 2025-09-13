const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');

/**
 * @swagger
 * /predict:
 *   post:
 *     summary: 특정 연도·월의 사망자 수 예측
 *     description: 연도(`year`)와 월(`month`)을 입력받아 Python 머신러닝 모델을 실행하고, 예측된 사망자 수를 반환합니다.
 *     tags:
 *       - Model
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - month
 *             properties:
 *               year:
 *                 type: integer
 *                 example: 2025
 *                 description: 예측할 연도
 *               month:
 *                 type: integer
 *                 example: 9
 *                 description: 예측할 월 (1~12)
 *     responses:
 *       200:
 *         description: 예측 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prediction:
 *                   type: number
 *                   example: 42.7
 *       500:
 *         description: 모델 실행 실패 또는 내부 오류
 *         content:
 *           application/json:
 *             example:
 *               error: "모델 실행 중 오류 발생"
 */
router.post('/', (req, res) => {
  const { year, month } = req.body;

  const options = {
    mode: 'json',
    pythonOptions: ['-u'],
    scriptPath: 'C:/moonlight_node/back/AI/model',
    args: [JSON.stringify({ year, month })],
  };

  PythonShell.run('predict.py', options, (err, results) => {
    if (err) {
      console.error('❌ Python 실행 오류:', err.message);
      return res.status(500).json({ error: '모델 실행 중 오류 발생' });
    }

    if (!results || !results[0]) {
      return res.status(500).json({ error: 'Python 응답 없음' });
    }

    res.json({ prediction: results[0].prediction });
  });
});

module.exports = router;
