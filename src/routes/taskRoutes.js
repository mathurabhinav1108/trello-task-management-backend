const router =  require("express").Router();

const {addtask, gettask, deletetask} = require("../controller/TaskController")


router.post("/add", addtask);

router.get("/get", gettask);

router.post("/delete", deletetask);

module.exports= router;