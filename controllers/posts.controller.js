const validator = require("fastest-validator");
const models = require("../models");
function save(req, res) {
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        userId: req.userData.userId,
    };

    //******************** validation   *********************//
    const schema = {
        title: { type: "string", optional: false, max: "100" },
        content: { type: "string", optional: false, max: "500" },
        imageUrl: { type: "string", optional: true, max: "255" },
        categoryId: { type: "number", optional: false },
    };
    const v = new validator();
    const validationResponse = v.validate(post, schema);
    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse,
        });
    }
    //******************** end validation   *********************//
    models.Category.findByPk(req.body.categoryId).then((result) => {
        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        } else {
            models.Post.create(post)
                .then((result) => {
                    res.status(201).json({
                        message: "Post created successfully",
                        post: result,
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        message: "Something went wrong",
                        error: error,
                    });
                });
        }
    });
}

function getAll(req, res) {
    models.Post.findAll()
        .then((result) => {
            res.status(200).json({
                status: "success",
                posts: result,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

function getOne(req, res) {
    const id = req.params.id;
    models.Post.findByPk(id)
        .then((result) => {
            res.status(200).json({
                status: "success",
                post: result,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

function update(req, res) {
    const id = req.params.id;
    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
    };
    const userId = req.userData.userId;

    //******************** validation   *********************//
    const schema = {
        title: { type: "string", optional: false, max: "100" },
        content: { type: "string", optional: false, max: "500" },
        imageUrl: { type: "string", optional: true, max: "255" },
        categoryId: { type: "number", optional: false },
    };
    const v = new validator();
    const validationResponse = v.validate(updatedPost, schema);
    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse,
        });
    }
    //******************** end validation   *********************//

    models.Category.findByPk(req.body.categoryId).then((result) => {
        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        } else {
            models.Post.update(updatedPost, {
                where: { id: id, userId: userId },
            })
                .then((result) => {
                    res.status(200).json({
                        status: "success",
                        result: result,
                        message: "Post updated successfully",
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        message: "Something went wrong",
                        error: error,
                    });
                });
        }
    });
}

function remove(req, res) {
    const id = req.params.id;
    const userId = req.userData.userId;
    models.Post.destroy({ where: { id: id, userId: userId } })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "Post deleted successfully",
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

module.exports = {
    save: save,
    getAll: getAll,
    getOne: getOne,
    update: update,
    remove: remove,
};
