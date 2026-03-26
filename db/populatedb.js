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
    ('Home Goods'),
    ('Uncategorized');

CREATE TABLE IF NOT EXISTS items (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR ( 255 ) NOT NULL,
size VARCHAR ( 255 ),
price DEC(10, 2) NOT NULL,
stock INTEGER DEFAULT 0,
image_url VARCHAR ( 255 ),
SKU VARCHAR ( 255 ) GENERATED ALWAYS AS ('SKU-' || id::text) STORED,
CONSTRAINT chk_PriceStock CHECK (price >= 0 AND stock >= 0)
);

INSERT INTO items (name, size, price, stock, image_url)
VALUES 
    -- Frozen Food
    ('Everybody''s Frost Pops', '12 pack', 3.99, 45, 'Frost_Pops.jpeg'),
    ('Arctic Bliss Ice Cream', '1 pint', 4.50, 22, 'Arctic_Bliss.jpeg'),
    ('QuickMeal Frozen Pizza', '16 oz', 5.99, 18, 'QuickMeal.jpeg'),
    ('Everybody''s Bites Fish Sticks', '24 oz', 6.75, 12, 'Everybody_Bites.jpeg'),
    ('Everybody''s Veggie Medley', '16 oz', 3.25, 30, 'Everybody_Veggie.jpeg'),
    ('Cozy Morning Waffles', '10 count', 4.25, 28, 'Cozy_Morning.jpeg'),
    ('IcyFruit Smoothie Packs', '6 pack', 7.50, 15, 'IcyFruit.jpeg'),
    ('Freezer Fresh Burritos', '8 pack', 8.99, 20, 'Freezer_Fresh.jpeg'),
    ('Polar Treat Ice Cream Goodies', '6 pack', 5.25, 35, 'Polar_Treat.jpeg'),
    ('Everybody''s Frozen Fries', '32 oz', 3.75, 40, 'Frozen_Fries.jpeg'),
    
    -- Snacks
    ('CrunchTime Potato Chips', '8 oz', 2.99, 55, 'CrunchTime.jpeg'),
    ('Everybody''s Trail Mix', '12 oz', 4.50, 32, 'Trail_Mix.jpeg'),
    ('SnackWave Cheese Crackers', '10 oz', 3.25, 48, 'SnackWave.jpeg'),
    ('Choco Delight Cookies', '14 oz', 3.99, 38, 'Choco_Delight.jpeg'),
    ('Munch Masters Pretzels', '16 oz', 2.75, 50, 'Munch_Master.jpeg'),
    ('Not Your Pop''s Corn!', '6 pack', 4.99, 25, 'Not_Your_Pops.jpeg'),
    ('Not Cho Cheese Tortilla Chips', '13 oz', 3.50, 42, 'Not_Cho.jpeg'),
    ('Sweet Tooth Candy Bar', '2.1 oz', 1.50, 85, 'Sweet_Tooth.jpeg'),
    ('Nuts 4 Buds Peanuts', '16 oz', 5.25, 28, 'Nuts_Buds.jpeg'),
    ('Crispy Crunch Rice Cakes', '5 oz', 2.99, 36, 'Crispy_Crunch.jpeg'),
    
    -- Drinks
    ('Everybody''s Cola', '2 liter', 2.25, 60, 'Cola.jpeg'),
    ('FizzPop Orange Soda', '12 pack cans', 5.99, 35, 'FizzPop.jpeg'),
    ('Pure Spring Water', '24 pack bottles', 4.99, 48, 'Pure_Spring.jpeg'),
    ('Dark & Drippy Hot Coffee', '12 oz', 1.99, 22, 'Drippy.jpeg'),
    ('Everybody''s Energy Drink', '16 oz', 2.75, 52, 'Everybody_Energy.jpeg'),
    ('Tropical Splash Juice', '64 oz', 3.99, 30, 'Tropical_Splash.jpeg'),
    ('PuckerUp LemonCup Lemonade', '20 oz', 1.99, 70, 'LemonCup.jpeg'),
    ('ChillTime Iced Tea', '1 gallon', 3.50, 25, 'ChillTime.jpeg'),
    ('Fan Fuel Sports Drink', '6 pack', 6.50, 28, 'Fan_Fuel.jpeg'),
    ('Everybody''s Chocolate Milk', '1 quart', 3.25, 40, 'Everybody_Choc_Milk.jpeg'),
    
    -- Home Goods
    ('Everybody''s Paper Towels', '6 rolls', 8.99, 45, 'Paper_Towels.jpeg'),
    ('CleanSweep Trash Bags', '30 count', 6.75, 38, 'CleanSweep.jpeg'),
    ('FreshScent Dish Soap', '24 oz', 3.25, 50, 'FreshScent.jpeg'),
    ('PowerCell Batteries', '8 pack AA', 7.50, 25, 'PowerCell.jpeg'),
    ('Everybody''s Toilet Paper', '12 rolls', 9.99, 55, 'TP.jpeg'),
    ('BrightLight LED Bulbs', '4 pack', 11.99, 18, 'BrightLight.jpeg'),
    ('QuickClean Sponges', '6 pack', 4.25, 42, 'QuickClean.jpeg'),
    ('Everybody''s PowerClean Pods', '40 count', 10.50, 28, 'PowerClean.jpeg'),
    ('AllPurpose Cleaner Spray', '32 oz', 4.99, 35, 'AllPurpose.jpeg'),
    ('FreshAir Room Spray', '9 oz', 5.75, 30, 'FreshAir.jpeg'),
     
    -- Uncategorized
    ('Everybody''s 3-Person Water Balloon Launcher', '1', 12.99, 9, 'Water_Balloon.jpeg'),
    ('Remote Control Blimp', '1', 34.99, 2, 'Blimp.jpeg');

CREATE TABLE IF NOT EXISTS item_categories (
item_id INTEGER REFERENCES items(id),
category_id INTEGER REFERENCES categories(id)
);

INSERT INTO item_categories (item_id, category_id)
VALUES
    -- Frozen Food (items 1-10)
    (1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
    (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
    
    -- Snacks (items 11-20)
    (11, 2), (12, 2), (13, 2), (14, 2), (15, 2),
    (16, 2), (17, 2), (18, 2), (19, 2), (20, 2),
    
    -- Drinks (items 21-30)
    (21, 3), (22, 3), (23, 3), (24, 3), (25, 3),
    (26, 3), (27, 3), (28, 3), (29, 3), (30, 3),
    
    -- Home Goods (items 31-40)
    (31, 4), (32, 4), (33, 4), (34, 4), (35, 4),
    (36, 4), (37, 4), (38, 4), (39, 4), (40, 4),

    -- Uncategorized (items 41 - 42)
    (41, 5), (42, 5),
    
    -- Crossover: Frozen + Snacks
    (1, 2),  -- Frost Pops
    (2, 2),  -- Ice Cream
    (9, 2),  -- Ice Cream Bars
    
    -- Crossover: Drinks + Snacks
    (24, 2), -- Coffee
    (30, 2); -- Chocolate Milk`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.argv[2],
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
