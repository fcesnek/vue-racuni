const express = require('express');
const router = express.Router();

const BillController = require('../controllers/BillController');
const isAuthenticated = require('../policies/isAuthenticated');

router.get('/list', isAuthenticated, BillController.list);
router.post('/new', isAuthenticated, BillController.new);
// router.put('/edit', isAuthenticated, BillControllerPolicy.check, BillController.edit);
router.delete('/remove', isAuthenticated, BillController.remove);

module.exports = router;
