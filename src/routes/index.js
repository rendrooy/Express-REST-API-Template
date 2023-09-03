const express = require('express');

const router = express.Router();
const member = require('../controller/memberController');
const family = require('../controller/familyController');

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/get-member', member.getMember);
router.get('/find-member', member.findMember);
router.post('/member', member.insertMember);
router.put('/member', member.updateMember);
router.delete('/member/:id', member.deleteMember);

router.get('/get-family', family.getFamily);
router.get('/find-family', family.findFamily);
router.post('/family', family.insertFamily);
router.put('/family', family.updateFamily);
router.delete('/family/:id', family.deleteFamily);

module.exports = router;
