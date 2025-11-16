const express = require('express');

const router = express.Router();

//Auth
const auth = require('../controller/auth-controller');
const authSrv = require('../services/auth-services');

// Master Data
const user = require('../controller/master-user-controller');
const role = require('../controller/master-role-controller');
const lookup = require('../controller/master-lookup-controller');
const family = require('../controller/master-family-controller');
const member = require('../controller/master-member-controller');
const vehicle = require('../controller/master-vehicle-controller');
const news = require('../controller/master-news-controller');
const {upload} = require('../connection/multer-config');

router.get('/', (req, res) => {
    res.send({message: 'Hello world'});
});

router.get('/', (req, res) => {
    res.send({message: 'Hello world'});
});

// Auth
router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);


// Master Data
router.post('/user/get-data', authSrv.authenticateUser, user.getUser);
router.post('/user/find-data', authSrv.authenticateUser, user.findUser);
router.post('/user/insert-data', user.insertUser);
router.post('/user/update-data', authSrv.authenticateUser, user.updateUser);
router.post('/user/delete-data', authSrv.authenticateUser, user.deleteUser);

router.post('/lookup/get-data', authSrv.authenticateUser, lookup.getLookup);
router.post('/lookup/find-data', authSrv.authenticateUser, lookup.findLookup);
router.post('/lookup/insert-data', authSrv.authenticateUser, lookup.insertLookup);
router.post('/lookup/update-data', authSrv.authenticateUser, lookup.updateLookup);
router.post('/lookup/delete-data', authSrv.authenticateUser, lookup.deleteLookup);


router.post('/role/get-data', authSrv.authenticateUser, role.getRole);
router.post('/role/find-data', authSrv.authenticateUser, role.findRole);
router.post('/role/insert-data', authSrv.authenticateUser, role.insertRole);
router.post('/role/update-data', authSrv.authenticateUser, role.updateRole);
router.post('/role/delete-data', authSrv.authenticateUser, role.deleteRole);

router.post('/family/get-data', authSrv.authenticateUser, family.getFamily);
router.post('/family/find-data', authSrv.authenticateUser, family.findFamily);
router.post('/family/insert-data', authSrv.authenticateUser, family.insertFamily);
router.post('/family/update-data', authSrv.authenticateUser, family.updateFamily);
router.post('/family/delete-data', authSrv.authenticateUser, family.deleteFamily);

router.post('/member/get-data', authSrv.authenticateUser, member.getMember);
router.post('/member/find-data', authSrv.authenticateUser, member.findMember);
router.post('/member/insert-data', authSrv.authenticateUser, member.insertMember);
router.post('/member/update-data', authSrv.authenticateUser, member.updateMember);
router.post('/member/delete-data', authSrv.authenticateUser, member.deleteMember);

router.post('/vehicle/get-data', authSrv.authenticateUser, vehicle.getVehicle);
router.post('/vehicle/find-data', authSrv.authenticateUser, vehicle.findVehicle);
router.post('/vehicle/insert-data', authSrv.authenticateUser, vehicle.insertVehicle);
router.post('/vehicle/update-data', authSrv.authenticateUser, vehicle.updateVehicle);
router.post('/vehicle/delete-data', authSrv.authenticateUser, vehicle.deleteVehicle);

router.post('/news/get-data', authSrv.authenticateUser, news.getNews);
router.post('/news/find-data', authSrv.authenticateUser, news.findNews);
router.post('/news/insert-data', authSrv.authenticateUser, news.insertNews);
router.post('/news/update-data', authSrv.authenticateUser, news.updateNews);
router.post('/news/upload-data', authSrv.authenticateUser, news.uploadNews);
router.post('/news/delete-data', authSrv.authenticateUser, news.deleteNews);


module.exports = router;
