const router =  require("express").Router();

const {addtask, gettask, deletetask, movetask} = require("../controller/TaskController")


router.post("/add", addtask);

router.get("/get", gettask);

router.post("/delete", deletetask);

router.post("/move", movetask);

module.exports= router;