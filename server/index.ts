// server/index.ts
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
