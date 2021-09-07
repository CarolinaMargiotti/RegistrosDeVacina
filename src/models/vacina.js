const Sequelize = require("sequelize");
const database = require("../database");

const Vacina = database.define(
    "vacina",
    {
        idvacina: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Essa vacina ja foi cadastrada",
            },
        },
        doenca: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        origem: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        tipo: {
            type: Sequelize.STRING,
            allowNull: false,
            values: ["atenuada", "inativada", "conjugada", "rna mensageiro"],
            isIn: {
                args: [
                    ["atenuada", "inativada", "conjugada", "rna mensageiro"],
                ],
                msg: "Tipo de vacina desconhecida. Tipos válidos: atenuada, inativada, conjugada, rna mensageiro",
            },
        },
        intervalo: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        doses: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true, // Model tableName will be the same as the model name
    }
);

module.exports = Vacina;
