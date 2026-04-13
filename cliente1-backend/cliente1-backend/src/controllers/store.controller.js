const pool = require("../db");

async function getStoreByDomain(req, res) {
  try {
    const host = req.headers.host?.split(":")[0];

    const result = await pool.query(
      "SELECT * FROM lojas WHERE dominio = $1 LIMIT 1",
      [host]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Loja não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = { getStoreByDomain };
