const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const database = require("../database");

const Usuario = database.define(
    "usuario",
    {
        idusuario: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        mail: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "O e-mail já existe no cadastro",
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: "Forneça um e-mail válido",
                },
            },
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: function (senha, next) {
                    if (senha.length < 6)
                        return next("A senha deve ter pelo menos 6 caracteres");
                    return next();
                },
            },
        },
        perfil: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: ["admin", "user"],
            validate: {
                isIn: {
                    args: [["admin", "user"]],
                    msg: "Perfil desconhecido",
                },
            },
        },
        registroVacinas: {
            type: Sequelize.ARRAY(Sequelize.DataTypes.JSON),
            allowNull: true,
        },
    },
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        hooks: {
            // hooks (also known as lifecycle events), are functions which are called before and after calls in sequelize are executed
            beforeCreate: (usuario) => {
                usuario.senha = bcrypt.hashSync(
                    usuario.senha,
                    bcrypt.genSaltSync(10)
                );
            },
            beforeUpdate: (usuario, options) => {
                // beforeUpdate é chamado sempre ao atualizar, então é preciso saber se é para atualizar a senha
                if (usuario.senha)
                    usuario.senha = bcrypt.hashSync(
                        usuario.senha,
                        bcrypt.genSaltSync(10)
                    );
            },
        },
    }
);

Usuario.prototype.comparePassword = (senha, hash) => {
    return bcrypt.compareSync(senha, hash);
};

module.exports = Usuario;
