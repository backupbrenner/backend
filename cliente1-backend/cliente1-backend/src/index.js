require("dotenv").config();
const express = require("express");
const cors = require("cors");

const storeRoutes = require("./routes/store.routes");
const menuRoutes = require("./routes/menu.routes");
const setupDatabase = require("./setup");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/store", storeRoutes);
app.use("/api/menu", menuRoutes);

const PORT = process.env.PORT || 3001;

setupDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log("Backend rodando na porta", PORT);
    });
  })
  .catch((error) => {
    console.error("Erro ao iniciar banco:", error);
    process.exit(1);
  });
