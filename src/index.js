const express = require("express");
const app = express();

app.listen(3001, function () {
    console.log("Servidor rodando na porta 3001...");
});

app.use("/api", "./routes");

app.use((req, res) => {
    res.status(400).json({ error: ["URL Desconhecida"] });
});
