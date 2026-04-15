const db = require("./db");

async function setupDatabase() {
  await db.query(`CREATE SCHEMA IF NOT EXISTS marmitas`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS marmitas.stores (
      id SERIAL PRIMARY KEY,
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
    CREATE TABLE IF NOT EXISTS marmitas.menu_items (
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

  const storeCheck = await db.query(`SELECT COUNT(*)::int AS total FROM marmitas.stores`);
  if (storeCheck.rows[0].total === 0) {
    await db.query(`
      INSERT INTO marmitas.stores
      (name, whatsapp, address, bairro, referencia, delivery_fee, is_open)
      VALUES
      (
        'Marmitas da Casa',
        '5563999999999',
        'Rua das Flores, 123',
        'Centro',
        'Perto da farmácia',
        5.00,
        true
      )
    `);
  }

  const menuCheck = await db.query(`SELECT COUNT(*)::int AS total FROM marmitas.menu_items`);
  if (menuCheck.rows[0].total === 0) {
    await db.query(`
      INSERT INTO marmitas.menu_items
      (code, name, price, base_items, feijoes, acompanhamentos_max, acompanhamentos, carne_modo, carne_texto, carnes_opcoes, carnes_qtd, detalhes, available)
      VALUES
      (
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

  console.log("Banco das marmitas verificado com sucesso.");
}

module.exports = setupDatabase;
