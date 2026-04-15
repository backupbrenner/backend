const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  try {
    const { cliente, itens, tipoEntrega, total } = req.body;

    const orderResult = await db.query(
      `INSERT INTO delivery.orders
      (cliente_nome, cliente_telefone, endereco, bairro, referencia, tipo_entrega, total)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id`,
      [
        cliente.nome,
        cliente.telefone,
        cliente.endereco,
        cliente.bairro,
        cliente.referencia,
        tipoEntrega,
        total
      ]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of itens) {
      await db.query(
        `INSERT INTO delivery.order_items
        (order_id, nome, quantidade, preco, observacao)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          orderId,
          item.nome,
          item.quantidade,
          item.preco,
          item.observacao || ""
        ]
      );
    }

    res.json({ success: true, orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar pedido" });
  }
});

router.get("/", async (req, res) => {
  try {
    const ordersResult = await db.query(`
      SELECT *
      FROM delivery.orders
      ORDER BY created_at DESC
    `);

    const itemsResult = await db.query(`
      SELECT *
      FROM delivery.order_items
      ORDER BY id ASC
    `);

    const itemsByOrder = {};
    for (const item of itemsResult.rows) {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = [];
      }
      itemsByOrder[item.order_id].push(item);
    }

    const orders = ordersResult.rows.map(order => ({
      ...order,
      itens: itemsByOrder[order.id] || []
    }));

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

module.exports = router;
