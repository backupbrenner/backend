const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const slug = req.query.slug || "marmitas";

    const result = await db.query(`
      SELECT id, slug, name, whatsapp, address, bairro, referencia, delivery_fee, is_open
      FROM delivery.stores
      WHERE slug = $1
      LIMIT 1
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Loja não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar loja:", error);
    res.status(500).json({ error: "Erro interno ao buscar loja" });
  }
});

module.exports = router;
