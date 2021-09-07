const { VacinaModel } = require("../models");
const { getToken } = require("../middlewares");

class VacinaController {
    async create(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { nome, doenca, origem, tipo, intervalo, doses } = req.body;
        nome = (nome || "").toString().trim();
        doenca = (doenca || "").toString().trim();
        origem = (origem || "").toString().trim();
        tipo = (tipo || "").toString().trim();
        intervalo = intervalo || "";
        doses = doses || "";

        if (nome === "")
            return res
                .status(400)
                .json({ error: ["Forneça o nome da vacina"] });

        if (doenca === "")
            return res.status(400).json({
                error: ["Forneça a doenca que a vacina foi feita para"],
            });

        if (origem === "")
            return res
                .status(400)
                .json({ error: ["Forneça a origem da vacina"] });

        if (tipo === "")
            return res
                .status(400)
                .json({ error: ["Forneça o tipo da vacina"] });

        if (intervalo === "")
            return res.status(400).json({
                error: [
                    "Forneça o intervalo de cada dose da vacina [em numero de dias]",
                ],
            });

        if (doses === "")
            return res
                .status(400)
                .json({ error: ["Forneça a quantidade de doses da vacina"] });

        return await VacinaModel.create({
            nome,
            doenca,
            origem,
            tipo,
            intervalo,
            doses,
            idusuario: token.idusuario,
        })
            .then(async (vacina) => {
                const {
                    nome,
                    doenca,
                    origem,
                    tipo,
                    intervalo,
                    doses,
                    createdAt,
                } = vacina.get();
                return res.status(200).json({
                    nome,
                    doenca,
                    origem,
                    tipo,
                    intervalo,
                    doses,
                    createdAt,
                });
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

    async update(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { idvacina, nome, doenca, origem, tipo, intervalo, doses } =
            req.body;

        idvacina = idvacina || "";
        nome = (nome || "").toString().trim();
        doenca = (doenca || "").toString().trim();
        origem = (origem || "").toString().trim();
        tipo = (tipo || "").toString().trim();
        intervalo = intervalo || "";
        doses = doses || "";

        if (idvacina === "") {
            return res.status(400).json({ error: ["Forneça o id da vacina"] });
        }

        if (nome === "")
            return res
                .status(400)
                .json({ error: ["Forneça o nome da vacina"] });

        if (doenca === "")
            return res.status(400).json({
                error: ["Forneça a doenca que a vacina foi feita para"],
            });

        if (origem === "")
            return res
                .status(400)
                .json({ error: ["Forneça a origem da vacina"] });

        if (tipo === "")
            return res
                .status(400)
                .json({ error: ["Forneça o tipo da vacina"] });

        if (intervalo === "")
            return res.status(400).json({
                error: [
                    "Forneça o intervalo de cada dose da vacina [em numero de dias]",
                ],
            });

        if (doses === "")
            return res
                .status(400)
                .json({ error: ["Forneça a quantidade de doses da vacina"] });

        return await VacinaModel.findOne({
            where: { idvacina, idusuario: token.idusuario },
        })
            .then(async (vacina) => {
                if (vacina) {
                    await vacina.update({
                        nome,
                        doenca,
                        origem,
                        tipo,
                        intervalo,
                        doses,
                    });
                    return res.status(200).json({
                        nome,
                        doenca,
                        origem,
                        tipo,
                        intervalo,
                        doses,
                    });
                }
                return res
                    .status(400)
                    .json({ error: ["Vacina não encontrada"] });
            })
            .catch((err) => {
                try {
                    return res.status(400).json({
                        error: err.errors.map((item) => item.message),
                        type: validation,
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

        return await VacinaModel.findAndCountAll({
            attributes: [
                "idvacina",
                "nome",
                "doenca",
                "origem",
                "tipo",
                "intervalo",
                "doses",
                "createdAt",
            ],
            order: [["idvacina", "DESC"]],
            offset,
            limit,
        })
            .then((vacinas) => {
                return res.status(200).json({
                    vacinas: vacinas.rows.map((item) => item.get()),
                    count: vacinas.count,
                });
            })
            .catch((e) => {
                return res.status(400).json({ error: [e.message] });
            });
    }

    async listAllByUser(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { limit, offset } = req.body;

        return await VacinaModel.findAndCountAll({
            where: { idusuario: token.idusuario },
            attributes: [
                "idvacina",
                "nome",
                "doenca",
                "origem",
                "tipo",
                "intervalo",
                "doses",
                "createdAt",
            ],
            order: [["idvacina", "DESC"]],
            offset,
            limit,
        })
            .then((vacinas) => {
                return res.status(200).json({
                    vacinas: vacinas.rows.map((item) => item.get()),
                    count: vacinas.count,
                });
            })
            .catch((e) => {
                return res.status(400).json({ error: [e.message] });
            });
    }

    async remove(req, res) {
        const token = await getToken(req);
        if (!token || !token.idusuario) {
            return res
                .status(401)
                .json({ error: ["Efetue o login para continuar"] });
        }

        let { idvacina } = req.body;

        idvacina = idvacina || "";
        if (idvacina === "") {
            return res
                .status(400)
                .json({ error: ["Forneça a identificação da vacina"] });
        }

        return await VacinaModel.findOne({
            where: { idvacina, idusuario: token.idusuario },
        })
            .then(async (vacina) => {
                if (vacina !== null) {
                    await vacina.destroy();
                    return res.status(200).json({ idvacina });
                } else {
                    return res
                        .status(400)
                        .json({ error: ["Registro inexistente"] });
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

module.exports = VacinaController;
