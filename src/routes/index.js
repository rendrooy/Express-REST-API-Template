const express = require('express');

const router = express.Router();

const user = require('../controller/master-user-controller');
const role = require('../controller/master-role-controller');

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.post('/get-user', user.getUser);
router.post('/find-user', user.findUser);
router.post('/insert-user', user.insertUser);
router.post('/update-user', user.updateUser);
router.post('/delete-user', user.deleteUser);

router.post('/get-role', role.getRole);
router.post('/find-role', role.findRole);
router.post('/insert-role', role.insertRole);
router.post('/update-role', role.updateRole);
router.post('/delete-role', role.deleteRole);

module.exports = router;
