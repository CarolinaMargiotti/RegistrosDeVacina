const { UsuarioModel } = require("../models");
const { Token } = require("../utils");
const { generateToken } = Token;
const { getToken } = require("../middlewares");
const { VacinaModel } = require("../models");

class UsuarioController {
    async create(req, res) {
        let { mail, senha, perfil } = req.body;
        mail = (mail || "").toString().trim();
        senha = (senha || "").toString().trim();
        if (mail === "") {
            return res
                .status(400)
                .json({ error: ["Forneça o seu e-mail para cadastro"] });
        }
        if (senha === "") {
            return res
                .status(400)
                .json({ error: ["Forneça a senha para cadastro"] });
        }
        if (senha.length < 6 || senha.length > 10) {
            return res
                .status(400)
                .json({ error: ["A senha deve ter entre 6 e 10 caracteres"] });
        }
        return await UsuarioModel.create({ mail, senha, perfil })
            .then(async (r) => {
                const { idusuario, mail, perfil } = r.get();
                return res
                    .status(200)
                    .json({ idusuario, mail, perfil: "user" });
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
    }

    async login(req, res) {
        let { mail, senha } = req.body;
        mail = (mail || "").toString().trim();
        senha = (senha || "").toString().trim();
        if (mail === "") {
            return res
                .status(400)
                .json({ error: ["Forneça o e-mail do seu cadastro"] });
        }
        if (senha === "") {
            return res
                .status(400)
                .json({ error: ["Forneça a sua senha de cadastro"] });
        }

        return await UsuarioModel.findOne({
            where: { mail },
        })
            .then(async (usuario) => {
                if (usuario) {
                    if (usuario.comparePassword(senha, usuario.senha)) {
                        const token = await generateToken({
                            idusuario: usuario.idusuario,
                            mail: usuario.mail,
                        });
                        return res.json({
                            token,
                            idusuario: usuario.idusuario,
                            mail: usuario.mail,
                        });
                    } else
                        return res
                            .status(400)
                            .json({ error: ["Dados de login não conferem"] });
                } else
                    return res
                        .status(400)
                        .json({ error: ["Usuário não identificado"] });
            })
            .catch((e) => {
                return res.status(400).json({ error: [e.message] });
            });
    }

    async updatemail(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { mail } = req.body;
        console.log(req.body);
        mail = (mail || "").toString().trim();

        if (mail === "") {
            return res
                .status(400)
                .json({ error: ["Forneça o seu novo e-mail"] });
        }
        if (mail === token.mail) {
            return res
                .status(400)
                .json({ error: ["O seu novo e-mail é igual ao atual"] });
        }

        return await UsuarioModel.findOne({
            where: { idusuario: token.idusuario },
        })
            .then(async (usuario) => {
                if (usuario) {
                    await usuario.update({ mail });
                    return res.status(200).json({
                        mail,
                    });
                }
                return res
                    .status(400)
                    .json({ error: ["Usuário não identificado"] });
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
    }

    async updatesenha(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { senha } = req.body;
        senha = (senha || "").toString().trim();
        if (senha === "") {
            return res.status(400).json({ error: ["Forneça a nova senha"] });
        }
        if (senha.length < 6 || senha.length > 10) {
            return res
                .status(400)
                .json({ error: ["A senha deve ter entre 6 e 10 caracteres"] });
        }

        return await UsuarioModel.findOne({
            where: { idusuario: token.idusuario },
        })
            .then(async (usuario) => {
                if (usuario) {
                    await usuario.update({ senha });
                    return res.status(200).json({
                        idusuario: token.idusuario,
                    });
                }
                return res
                    .status(400)
                    .json({ error: ["Usuário não identificado"] });
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
    }

    async updateProfile(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { perfil, idusuario } = req.body;
        perfil = (perfil || "").toString().trim();
        if (perfil === "") {
            return res.status(400).json({ error: ["Forneça o novo perfil"] });
        }

        idusuario = idusuario || "";
        if (idusuario === "") {
            return res.status(400).json({ error: ["Forneça o id do usuario"] });
        }

        return await UsuarioModel.findOne({
            where: { idusuario },
        })
            .then(async (usuario) => {
                if (usuario) {
                    await usuario.update({ perfil });
                    return res.status(200).json({
                        idusuario,
                        perfil,
                    });
                }
                return res
                    .status(400)
                    .json({ error: ["Usuário não identificado"] });
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
    }

    async finduser(req, res) {
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
                if (usuario) {
                    return res.status(200).json({
                        idusuario: token.idusuario,
                        mail: token.mail,
                        perfil: usuario.perfil,
                        registroVacinas: usuario.registroVacinas,
                    });
                }
                return res
                    .status(400)
                    .json({ error: ["Usuário não identificado"] });
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
    }

    async listAll(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { limit, offset } = req.body;

        return await UsuarioModel.findAndCountAll({
            attributes: [
                "idusuario",
                "mail",
                "perfil",
                "registroVacinas",
                "createdAt",
            ],
            order: [["idusuario", "DESC"]],
            offset,
            limit,
        })
            .then((usuarios) => {
                return res.status(200).json({
                    usuarios: usuarios.rows.map((item) => item.get()),
                    count: usuarios.count,
                });
            })
            .catch((e) => {
                return res.status(400).json({ error: [e.message] });
            });
    }

    async listVax(req, res) {
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
                if (usuario) {
                    let registros = usuario.registroVacinas;
                    registros = registros.sort(
                        (a, b) =>
                            new Date(a.datavacina).getTime() -
                            new Date(b.datavacina).getTime()
                    );

                    registros.reverse();

                    return res.status(200).json({ registros });
                }
                return res
                    .status(400)
                    .json({ error: ["Usuário não identificado"] });
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
    }

    async addVax(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { idvacina, datavacina } = req.body;

        idvacina = idvacina || "";
        datavacina = (datavacina || "").toString().trim();

        if (datavacina === "") {
            return res
                .status(400)
                .json({ error: ["Forneça a data da vacina"] });
        }

        if (
            !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(datavacina)
        ) {
            return res.status(400).json({
                error: [
                    "Data da vacina no formato incorreto. Formato: YYYY-MM-DD",
                ],
            });
        }

        if (idvacina === "")
            return res
                .status(400)
                .json({ error: ["Forneça a identificação da vacina"] });

        // só da para tomar uma vacina que foi cadastrada
        const isExist = await VacinaModel.findOne({
            where: { idvacina },
        })
            .then(async (vacina) => {
                if (vacina !== null) return true;
                return false;
            })
            .catch((err) => {
                return false;
            });

        if (!isExist)
            return res.status(400).json({ error: ["Vacina não identificada"] });

        return await UsuarioModel.findOne({
            where: { idusuario: token.idusuario },
        })
            .then(async (usuario) => {
                if (usuario) {
                    let registroVacinas;
                    if (usuario.registroVacinas === null) {
                        registroVacinas = [
                            {
                                idvacina,
                                datavacina,
                            },
                        ];
                    } else {
                        registroVacinas = [
                            ...usuario.registroVacinas,
                            {
                                idvacina,
                                datavacina,
                            },
                        ];
                    }

                    await usuario.update({ registroVacinas });
                    return res.status(200).json({
                        registroVacinas,
                    });
                }
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
    }
}

module.exports = UsuarioController;
