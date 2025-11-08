const express = require('express');

const router = express.Router();

//Auth
const auth = require('../controller/auth-controller');

// Master Data
const user = require('../controller/master-user-controller');
const role = require('../controller/master-role-controller');
const member = require('../controller/master-member-controller');
const family = require('../controller/master-family-controller');

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

// Auth
router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);



// Master Data
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

router.post('/get-member', member.getMember);
router.post('/find-member', member.findMember);
router.post('/insert-member', member.insertMember);
router.post('/update-member', member.updateMember);
router.post('/delete-member', member.deleteMember);

router.post('/get-family', family.getFamily);
router.post('/find-family', family.findFamily);
router.post('/insert-family', family.insertFamily);
router.post('/update-family', family.updateFamily);
router.post('/delete-family', family.deleteFamily);

module.exports = router;
