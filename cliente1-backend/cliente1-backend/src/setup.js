const db = require("./db");

async function setupDatabase() {
  await db.query(`CREATE SCHEMA IF NOT EXISTS delivery`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS delivery.stores (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(80) UNIQUE,
      name VARCHAR(150) NOT NULL,
      whatsapp VARCHAR(30),
      address TEXT,
      bairro VARCHAR(100),
      referencia TEXT,
      delivery_fee NUMERIC(10,2) DEFAULT 0,
      is_open BOOLEAN DEFAULT true
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS delivery.menu_items (
      id SERIAL PRIMARY KEY,
      code VARCHAR(60) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      base_items TEXT[],
      feijoes TEXT[],
      acompanhamentos_max INTEGER NOT NULL DEFAULT 2,
      acompanhamentos TEXT[],
      carne_modo VARCHAR(30) NOT NULL,
      carne_texto TEXT,
      carnes_opcoes TEXT[],
      carnes_qtd INTEGER,
      detalhes TEXT,
      available BOOLEAN DEFAULT true
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS delivery.orders (
      id SERIAL PRIMARY KEY,
      cliente_nome TEXT,
      cliente_telefone TEXT,
      endereco TEXT,
      bairro TEXT,
      referencia TEXT,
      tipo_entrega TEXT,
      total NUMERIC(10,2),
      status TEXT DEFAULT 'PENDENTE',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS delivery.order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES delivery.orders(id) ON DELETE CASCADE,
      nome TEXT,
      quantidade INTEGER,
      preco NUMERIC(10,2),
      observacao TEXT
    )
  `);

  // =========================
  // MIGRAÇÕES AUTOMÁTICAS
  // =========================

  await db.query(`
    ALTER TABLE delivery.stores
    ADD COLUMN IF NOT EXISTS slug VARCHAR(80)
  `);

  await db.query(`
    ALTER TABLE delivery.menu_items
    ADD COLUMN IF NOT EXISTS store_id INTEGER
  `);

  await db.query(`
    ALTER TABLE delivery.orders
    ADD COLUMN IF NOT EXISTS store_id INTEGER
  `);

  // =========================
  // GARANTIR LOJAS
  // =========================

  const storeCheck = await db.query(`
    SELECT COUNT(*)::int AS total
    FROM delivery.stores
  `);

  if (storeCheck.rows[0].total === 0) {
    await db.query(`
      INSERT INTO delivery.stores
      (slug, name, whatsapp, address, bairro, referencia, delivery_fee, is_open)
      VALUES
      (
        'marmitas',
        'Marmitas da Casa',
        '5563999999999',
        'Rua das Flores, 123',
        'Centro',
        'Perto da farmácia',
        5.00,
        true
      ),
      (
        'sorvetes',
        'Sorvetes Carmelo',
        '5563999999999',
        'Rua Gelada, 456',
        'Centro',
        'Em frente à praça',
        3.00,
        true
      )
    `);
  }

  await db.query(`
    UPDATE delivery.stores
    SET slug = 'marmitas'
    WHERE id = 1 AND (slug IS NULL OR slug = '')
  `);

  const sorvetesCheck = await db.query(`
    SELECT COUNT(*)::int AS total
    FROM delivery.stores
    WHERE slug = 'sorvetes'
  `);

  if (sorvetesCheck.rows[0].total === 0) {
    await db.query(`
      INSERT INTO delivery.stores
      (slug, name, whatsapp, address, bairro, referencia, delivery_fee, is_open)
      VALUES
      (
        'sorvetes',
        'Sorvetes Carmelo',
        '5563999999999',
        'Rua Gelada, 456',
        'Centro',
        'Em frente à praça',
        3.00,
        true
      )
    `);
  }

  // =========================
  // GARANTIR CARDÁPIO DAS MARMITAS
  // =========================

  const menuCheck = await db.query(`
    SELECT COUNT(*)::int AS total
    FROM delivery.menu_items
  `);

  if (menuCheck.rows[0].total === 0) {
    await db.query(`
      INSERT INTO delivery.menu_items
      (store_id, code, name, price, base_items, feijoes, acompanhamentos_max, acompanhamentos, carne_modo, carne_texto, carnes_opcoes, carnes_qtd, detalhes, available)
      VALUES
      (
        1,
        'casa-mista',
        'Marmita da Casa Mista',
        20.00,
        ARRAY['Arroz Branco','Farofa'],
        ARRAY['Tropeiro','Caldo'],
        2,
        ARRAY['Batata Frita','Macarrão','Mandioca Coz','Legumes','Banana à Milanesa'],
        'fixa',
        'Carnes assadas mista (Carne, Frango e Linguiça)',
        NULL,
        NULL,
        'Marmita completa com arroz branco, farofa, feijão à escolha, até 2 acompanhamentos e carnes mistas.',
        true
      ),
      (
        1,
        'carne-assada',
        'Marmita Carne Assada',
        22.00,
        ARRAY['Arroz Branco','Farofa'],
        ARRAY['Tropeiro','Caldo'],
        2,
        ARRAY['Batata Frita','Macarrão','Mandioca Coz','Legumes','Banana à Milanesa'],
        'fixa',
        'Carne assada',
        NULL,
        NULL,
        'Marmita com arroz branco, farofa, feijão à escolha, até 2 acompanhamentos e carne assada fixa.',
        true
      ),
      (
        1,
        'carreteiro-mista',
        'Arroz Carreteiro (Mista)',
        23.00,
        ARRAY['Arroz Carreteiro'],
        ARRAY['Tropeiro','Caldo'],
        2,
        ARRAY['Batata Frita','Macarrão','Mandioca Coz','Legumes','Banana à Milanesa'],
        'fixa',
        'Mista',
        NULL,
        NULL,
        'Arroz carreteiro, feijão à escolha e até 2 acompanhamentos. Versão mista.',
        true
      ),
      (
        1,
        'carreteiro-so-carne',
        'Arroz Carreteiro (Só Carne)',
        25.00,
        ARRAY['Arroz Carreteiro'],
        ARRAY['Tropeiro','Caldo'],
        2,
        ARRAY['Batata Frita','Macarrão','Mandioca Coz','Legumes','Banana à Milanesa'],
        'fixa',
        'Só carne',
        NULL,
        NULL,
        'Arroz carreteiro, feijão à escolha e até 2 acompanhamentos. Versão só carne.',
        true
      ),
      (
        1,
        'especial',
        'Marmita Especial',
        30.00,
        ARRAY['Arroz Branco','Farofa'],
        ARRAY['Tropeiro','Caldo'],
        2,
        ARRAY['Batata Frita','Macarrão','Mandioca Coz','Legumes','Banana à Milanesa'],
        'selecionar',
        NULL,
        ARRAY['Carne','Frango','Linguiça'],
        3,
        'Marmita especial com arroz branco, farofa, feijão à escolha, até 2 acompanhamentos e escolha de 3 tipos de carne.',
        true
      )
    `);
  }

  await db.query(`
    UPDATE delivery.menu_items
    SET store_id = 1
    WHERE store_id IS NULL
  `);
  const sorveteMenuCheck = await db.query(`
    SELECT COUNT(*)::int AS total
    FROM delivery.menu_items
    WHERE store_id = 2
  `);

  if (sorveteMenuCheck.rows[0].total === 0) {
    await db.query(`
      INSERT INTO delivery.menu_items
      (store_id, code, name, price, base_items, feijoes, acompanhamentos_max, acompanhamentos, carne_modo, carne_texto, carnes_opcoes, carnes_qtd, detalhes, available)
      VALUES
      (
        2,
        'sorvete-1l-morango',
        'Sorvete 1L Morango',
        25.00,
        ARRAY[]::TEXT[],
        ARRAY[]::TEXT[],
        0,
        ARRAY[]::TEXT[],
        'fixa',
        'Morango',
        NULL,
        NULL,
        'Sorvete de morango 1 litro',
        true
      ),
      (
        2,
        'sorvete-1l-chocolate',
        'Sorvete 1L Chocolate',
        25.00,
        ARRAY[]::TEXT[],
        ARRAY[]::TEXT[],
        0,
        ARRAY[]::TEXT[],
        'fixa',
        'Chocolate',
        NULL,
        NULL,
        'Sorvete de chocolate 1 litro',
        true
      ),
      (
        2,
        'sorvete-2l-misto',
        'Sorvete 2L Misto',
        40.00,
        ARRAY[]::TEXT[],
        ARRAY[]::TEXT[],
        0,
        ARRAY[]::TEXT[],
        'fixa',
        'Sabores mistos',
        NULL,
        NULL,
        'Sorvete 2 litros com sabores mistos',
        true
      ),
      (
        2,
        'picole-morango',
        'Picolé Morango',
        6.00,
        ARRAY[]::TEXT[],
        ARRAY[]::TEXT[],
        0,
        ARRAY[]::TEXT[],
        'fixa',
        'Morango',
        NULL,
        NULL,
        'Picolé sabor morango',
        true
      )
    `);
  }
  console.log("Banco delivery verificado com sucesso.");
}

module.exports = setupDatabase;
