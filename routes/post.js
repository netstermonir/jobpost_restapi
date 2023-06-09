const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
const checkAuthMiddleware = require("../middleware/checkAuth");
router.post("/", checkAuthMiddleware.checkAuth, postsController.save);
router.get("/", checkAuthMiddleware.checkAuth, postsController.getAll);
router.get("/:id", checkAuthMiddleware.checkAuth, postsController.getOne);
router.put("/:id", checkAuthMiddleware.checkAuth, postsController.update);
router.delete("/:id", checkAuthMiddleware.checkAuth, postsController.remove);
module.exports = router;
