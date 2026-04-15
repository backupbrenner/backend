const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const slug = req.query.slug || "marmitas";

    const result = await db.query(`
      SELECT
        mi.id,
        mi.store_id,
        mi.code,
        mi.name,
        mi.price,
        mi.base_items,
        mi.feijoes,
        mi.acompanhamentos_max,
        mi.acompanhamentos,
        mi.carne_modo,
        mi.carne_texto,
        mi.carnes_opcoes,
        mi.carnes_qtd,
        mi.detalhes,
        mi.available
      FROM delivery.menu_items mi
      JOIN delivery.stores s ON s.id = mi.store_id
      WHERE mi.available = true
        AND s.slug = $1
      ORDER BY mi.id
    `, [slug]);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar cardápio:", error);
    res.status(500).json({ error: "Erro interno ao buscar cardápio" });
  }
});

module.exports = router;
