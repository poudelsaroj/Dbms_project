const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');

router.use(auth.verifyToken);

// Room routes
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoom);
router.post('/', auth.isAdmin, roomController.createRoom);
router.put('/:id', auth.isAdmin, roomController.updateRoom);
router.delete('/:id', auth.isAdmin, roomController.deleteRoom);
router.get('/:id/schedule', roomController.getRoomSchedule);

module.exports = router; 