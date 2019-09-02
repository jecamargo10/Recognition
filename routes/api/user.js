const UserController = require("../../controllers/user_controller");

module.exports = function (router) {
    router.post("/user", UserController.create);
    router.get("/user", UserController.getAll);
    router.get("/user/admins", UserController.getAdmin);
    router.get("/status", UserController.getStatus);
    router.post("/changeStatus", UserController.changeStatus);
    router.get("/revert", UserController.revert);
    router.post("/changeFormula", UserController.changeFormula);
    router.get("/getFormula", UserController.getFormula);






    router.get("/user/users", UserController.getUser);
    router.get("/user/:id", UserController.get);
    router.get("/user/grouping/:id", UserController.getByGrouping);
    router.get("/user/grouping/:groupingId/not-voted/:ballotId", UserController.getByGroupingBallotNoVote);
    router.get("/user/email/:email", UserController.getByEmail);
    router.put("/user/:id", UserController.update);
    router.put("/user/addGrouping/:id", UserController.addGrouping);
    router.delete("/user/:id", UserController.delete);
};
