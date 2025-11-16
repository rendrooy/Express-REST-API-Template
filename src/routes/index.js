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
router.post('/get-user', authSrv.authenticateUser, user.getUser);
router.post('/find-user', authSrv.authenticateUser, user.findUser);
router.post('/insert-user', user.insertUser);
router.post('/update-user', authSrv.authenticateUser, user.updateUser);
router.post('/delete-user', authSrv.authenticateUser, user.deleteUser);

router.post('/get-lookup', authSrv.authenticateUser, lookup.getLookup);
router.post('/find-lookup', authSrv.authenticateUser, lookup.findLookup);
router.post('/insert-lookup', authSrv.authenticateUser, lookup.insertLookup);
router.post('/update-lookup', authSrv.authenticateUser, lookup.updateLookup);
router.post('/delete-lookup', authSrv.authenticateUser, lookup.deleteLookup);


router.post('/get-role', authSrv.authenticateUser, role.getRole);
router.post('/find-role', authSrv.authenticateUser, role.findRole);
router.post('/insert-role', authSrv.authenticateUser, role.insertRole);
router.post('/update-role', authSrv.authenticateUser, role.updateRole);
router.post('/delete-role', authSrv.authenticateUser, role.deleteRole);

router.post('/get-family', authSrv.authenticateUser, family.getFamily);
router.post('/find-family', authSrv.authenticateUser, family.findFamily);
router.post('/insert-family', authSrv.authenticateUser, family.insertFamily);
router.post('/update-family', authSrv.authenticateUser, family.updateFamily);
router.post('/delete-family', authSrv.authenticateUser, family.deleteFamily);

router.post('/get-member', authSrv.authenticateUser, member.getMember);
router.post('/find-member', authSrv.authenticateUser, member.findMember);
router.post('/insert-member', authSrv.authenticateUser, member.insertMember);
router.post('/update-member', authSrv.authenticateUser, member.updateMember);
router.post('/delete-member', authSrv.authenticateUser, member.deleteMember);

router.post('/get-vehicle', authSrv.authenticateUser, vehicle.getVehicle);
router.post('/find-vehicle', authSrv.authenticateUser, vehicle.findVehicle);
router.post('/insert-vehicle', authSrv.authenticateUser, vehicle.insertVehicle);
router.post('/update-vehicle', authSrv.authenticateUser, vehicle.updateVehicle);
router.post('/delete-vehicle', authSrv.authenticateUser, vehicle.deleteVehicle);



module.exports = router;
