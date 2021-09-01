const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "postgres",
    storage:
        "postgres://dldwjezs:Kch8hoCO5rymNf4QkKMFcJfujceqvrSd@kesavan.db.elephantsql.com/dldwjezs",
});
