const router = require("express").Router();

const usuarioRoute = require("./usuario");
// const gastoRoute = require("./gasto");

router.use("/usuario", usuarioRoute);
// router.use("/gasto", gastoRoute);

router.use((req, res) => {
    res.status(400).json({ error: ["Operação desconhecida"] });
});

module.exports = router;
