const express = require('express');

const router = express.Router();

const sessions = require('../controller/sessionsController');
const member = require('../controller/memberController');
const user = require('../controller/userController');
const family = require('../controller/familyController');
const news = require('../controller/newsController');
const { upload } = require('../connection/multer-config');

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/get-user', user.getUser);
router.get('/find-user', user.findUser);
router.post('/user', user.insertUser);
router.put('/user', user.updateUser);
router.delete('/user/:id', user.deleteUser);

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

router.get('/get-news/:id', news.getNews);
router.get('/find-news', news.findNews);
router.post('/news', news.insertNews);
router.put('/news', news.updateNews);
router.delete('/news/:id', news.deleteNews);
router.post('/news/upload-file', upload.array('file[]'), news.uploadFile);

router.post('/sessions/login', sessions.login);

module.exports = router;
