const express = require('express');

const router = express.Router();

const member = require('../controller/memberController');
const family = require('../controller/familyController');
const news = require('../controller/newsController');
const { upload } = require('../connection/multer-config');

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

router.get('/get-news', news.getNews);
router.get('/find-news', news.findNews);
router.post('/news', news.insertNews);
router.put('/news', news.updateNews);
router.delete('/news/:id', news.deleteNews);
router.post('/news/upload-file', upload.single('file'), news.uploadFile);

router.delete('/news/:id', news.deleteNews);

module.exports = router;
