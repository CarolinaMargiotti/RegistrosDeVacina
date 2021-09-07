const router = require("express").Router();

const usuarioRoute = require("./usuario");
const vacinaRoute = require("./vacina");

router.use("/usuario", usuarioRoute);
router.use("/vacina", vacinaRoute);

router.use((req, res) => {
    res.status(400).json({ error: ["Operação desconhecida"] });
});

module.exports = router;
