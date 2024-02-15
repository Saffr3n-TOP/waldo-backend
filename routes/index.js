const controller = require('../controllers/index');
const router = require('express').Router();

router.get('/', controller.initialize);
router.get('/:id', controller.checkPolygon);

module.exports = router;
