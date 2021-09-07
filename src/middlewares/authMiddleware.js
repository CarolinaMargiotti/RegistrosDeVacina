const { Token } = require("../utils");
const { validateToken, decodeToken } = Token;
const { UsuarioModel } = require("../models");

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return res
            .status(401)
            .json({ error: ["É necessário efetuar o login"] });

    const [, token] = authorization.split(" ");

    try {
        await validateToken(token);
        return next();
    } catch (error) {
        return res.status(401).json({ error: [error.message] });
    }
};

const authAdmin = async (req, res, next) => {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
        return res
            .status(401)
            .json({ error: ["Efetue o login para continuar"] });
    }

    await UsuarioModel.findOne({
        where: { idusuario: token.idusuario },
    })
        .then(async (usuario) => {
            if (usuario.perfil === "admin") {
                return next();
            }
            return res
                .status(401)
                .json({ error: ["Usuario não possui permissões o bastante"] });
        })
        .catch((err) => {
            try {
                return res.status(400).json({
                    error: err.errors.map((item) => item.message),
                    type: "validation",
                });
            } catch (e) {
                return res.status(400).json({ error: [e.message] });
            }
        });
};

const getToken = async (req) => {
    const { authorization } = req.headers;
    try {
        const [, token] = authorization.split(" ");
        return await decodeToken(token);
    } catch (error) {
        return null;
    }
};

module.exports = { authMiddleware, getToken, authAdmin };
