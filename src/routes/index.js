const express = require('express');

const router = express.Router();
const user = require("../controller/userController");


router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});


router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get("/user",
//  authSrv.authenticateUser, 
 user.getUser,
);
router.post("/user",
//  authSrv.authenticateUser, 
 user.insertUser,
);
router.put("/user",
//  authSrv.authenticateUser, 
 user.updateUser,
);
router.delete("/user/:id",
//  authSrv.authenticateUser, 
 user.deleteUser,
);

module.exports = router;
