const UsuarioModel = require("./usuario");
const VacinaModel = require("./vacina");

//importa o arquivo database/index.js
const database = require("../database");

UsuarioModel.hasOne(VacinaModel, {
    foreignKey: {
        name: "idusuario",
        allowNull: false,
    },
    sourceKey: "idusuario",
    onDelete: "cascade",
    onUpdate: "cascade",
    hooks: true, //usado para forçar o cascade no onDelete
});
VacinaModel.belongsTo(UsuarioModel, {
    foreignKey: "idusuario",
    targetKey: "idusuario",
});

//cria as tabelas no SGBD se elas não existirem
database.sync();

module.exports = {
    UsuarioModel,
    VacinaModel,
};
