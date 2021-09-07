const router = require("express").Router();
const { VacinaController } = require("../controllers");
const { authMiddleware, authAdmin } = require("../middlewares");
const { create, update, listAll, listAllByUser, remove } =
    new VacinaController();

router.use(authMiddleware);

// curl -X GET -d "offset=0&limit=4" http://localhost:3100/api/vacina/listAll
router.get("/listAll", listAll);

router.use(authAdmin);

// curl -X POST -d "nome=Pfizer&doenca=coronavirus&origem=Alemanha&tipo=rna mensageiro&intervalo=21&doses=2" http://localhost:3100/api/vacina/create
router.post("/create", create);

// curl -X PUT -d "nome=Pfizer&doenca=coronavirus&origem=Alemanha&tipo=rna mensageiro&intervalo=21&doses=2" http://localhost:3100/api/vacina/update
router.put("/update", update);

// curl -X DELETE -d "idvacina=1" http://localhost:3100/api/vacina/remove
router.delete("/remove", remove);

// curl -X GET -d "offset=0&limit=4" http://localhost:3100/api/vacina/listAllByUser
router.get("/listAllByUser", listAllByUser);

module.exports = router;
