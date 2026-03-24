import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR ( 255 )
);

INSERT INTO categories (name)
VALUES
    ('Frozen Food'),
    ('Snacks'),
    ('Drinks'),
    ('Home Goods');

CREATE TABLE IF NOT EXISTS items (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR ( 255 ) NOT NULL,
size VARCHAR ( 255 ),
price DEC(10, 2) NOT NULL,
stock INTEGER DEFAULT 0,
SKU VARCHAR ( 255 ) GENERATED ALWAYS AS ('SKU-' || id::text) STORED,
CONSTRAINT chk_PriceStock CHECK (price >= 0 AND stock >= 0)
);

INSERT INTO items (name, size, price, stock)
VALUES 
    ('SuperFizz', '20 oz.', 2.00, 24),
    ('ChewyChops', '', 1.50, 14),
    ('Vanilla Pops', '6 bars', 3.25, 8),
    ('DuraSmell', '8 AAA', 4.10, 3),
    ('CottonWrecks', '12 Roll', 8.00, 48)
     
CREATE TABLE IF NOT EXISTS item_categories (
item_id INTEGER REFERENCES items(id),
category_id INTEGER REFERENCES categories(id)
);

INSERT INTO item_categories (item_id, category_id)
VALUES
    (1, 3),
    (2, 2),
    (3, 1),
    (3, 2),
    (4, 4),
    (5, 4)`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: __,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}
