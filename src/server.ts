import express, { Request, Response, ErrorRequestHandler } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/routes";
import "./models/Associations"; // Certifique-se de que o caminho está correto

dotenv.config();

const app = express(); // Crie a instância do Express

app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

//AQUI EU DIGO O FORMATO QUE EU QUERO A REQUISIÇÃO
//app.use(express.urlencoded({ extended: true })); // USANDO URL ENCODED
app.use(express.json()); //USANDO JSON

app.get("/ping", (req: Request, res: Response) => res.json({ pong: true }));

app.use(apiRoutes);

app.use((req: Request, res: Response) => {
  res.status(404);
  res.json({ error: "Endpoint não encontrado." });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(400); // Bad Request
  console.log(err);
  res.json({ error: "Ocorreu algum erro." });
};
app.use(errorHandler);

// Exporta a instância do Express
export { app };

// Inicia o servidor somente se não estiver no ambiente de teste
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
