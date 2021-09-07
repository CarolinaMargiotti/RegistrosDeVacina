const router = require("express").Router();
const { UsuarioController } = require("../controllers");
const { authMiddleware, authAdmin } = require("../middlewares");
const {
    create,
    login,
    updatemail,
    updatesenha,
    updateProfile,
    finduser,
    listAll,
    addVax,
    listVax,
} = new UsuarioController();

// curl -X POST -d "mail=teste@teste.com&senha=123456" http://localhost:3100/api/usuario/create
router.post("/create", create);

// curl -X GET -d "mail=teste@teste.com&senha=123456" http://localhost:3100/api/usuario/login
router.get("/login", login);

router.use(authMiddleware);

// curl -X POST -d "datavacina=2021-08-22&idvacina=1" http://localhost:3100/api/usuario/addVax
router.post("/addVax", addVax);

// // curl -X PUT -d "mail=tester@teste.com" http://localhost:3100/api/usuario/update/mail
router.put("/update/mail", updatemail);

// // curl -X PUT -d "senha=123457" http://localhost:3100/api/usuario/update/senha
router.put("/update/senha", updatesenha);

// // curl -X GET -d "senha=123457" http://localhost:3100/api/usuario/find
router.get("/find", finduser);

// // curl -X GET -d http://localhost:3100/api/usuario/listVax
router.get("/listVax", listVax);

router.use(authAdmin);

// // curl -X GET -d "offset=0&limit=4" http://localhost:3100/api/usuario/listAll
router.get("/listAll", listAll);

// // curl -X PUT -d "idusuario=1&perfil=admin" http://localhost:3100/api/usuario/update/profile
router.put("/update/profile", updateProfile);

router.use((req, res) => {
    res.status(400).json({ error: ["Operação desconhecida com o usuário"] });
});

module.exports = router;
