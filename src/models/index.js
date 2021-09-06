const UsuarioModel = require("./usuario");
// const GastoModel = require("./gasto");

//importa o arquivo database/index.js
const database = require("../database");

// UsuarioModel.hasMany(GastoModel, {
//     foreignKey: {
//         name: "idusuario",
//         allowNull: false,
//     },
//     sourceKey: "idusuario",
//     onDelete: "cascade",
//     onUpdate: "cascade",
//     hooks: true, //usado para forçar o cascade no onDelete
// });
// GastoModel.belongsTo(UsuarioModel, {
//     foreignKey: "idusuario",
//     targetKey: "idusuario",
// });

//cria as tabelas no SGBD se elas não existirem
database.sync();

module.exports = {
    UsuarioModel,
    // GastoModel,
};
