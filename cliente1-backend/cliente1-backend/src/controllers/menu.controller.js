const pool = require("../db");

async function getMenu(req, res) {
  try {
    const host = req.headers.host?.split(":")[0];

    const loja = await pool.query(
      "SELECT * FROM lojas WHERE dominio = $1 LIMIT 1",
      [host]
    );

    if (!loja.rows.length) {
      return res.status(404).json({ message: "Loja não encontrada" });
    }

    const produtos = await pool.query(
      "SELECT * FROM produtos WHERE loja_id = $1 ORDER BY ordem ASC",
      [loja.rows[0].id]
    );

    res.json({
      loja: loja.rows[0],
      produtos: produtos.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = { getMenu };
