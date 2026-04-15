const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        code,
        name,
        price,
        base_items,
        feijoes,
        acompanhamentos_max,
        acompanhamentos,
        carne_modo,
        carne_texto,
        carnes_opcoes,
        carnes_qtd,
        detalhes,
        available
      FROM delivery.menu_items
      WHERE available = true
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar cardápio:", error);
    res.status(500).json({ error: "Erro interno ao buscar cardápio" });
  }
});

module.exports = router;
