import { Client } from "pg";

const SQL = `
DROP TABLE IF EXISTS item_categories;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;

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
image_url VARCHAR ( 255 ) DEFAULT NULL,
description TEXT,
SKU VARCHAR ( 255 ) GENERATED ALWAYS AS ('SKU-' || id::text) STORED,
CONSTRAINT chk_PriceStock CHECK (price >= 0 AND stock >= 0)
);

INSERT INTO items (name, size, price, stock, image_url, description)
VALUES 
    -- Frozen Food
    ('Everybody''s Frost Pops', '12 pack', 3.99, 45, 'Frost_Pops.jpeg', 'Refreshing frozen treats in assorted fruit flavors. Perfect for hot summer days or as an after-school snack. Each pack contains 12 individually wrapped pops.'),
    ('Arctic Bliss Ice Cream', '1 pint', 4.50, 22, 'Arctic_Bliss.jpeg', 'Creamy vanilla ice cream made with real Madagascar vanilla beans. Rich, smooth texture that melts perfectly on your tongue. A classic dessert that never goes out of style.'),
    ('QuickMeal Frozen Pizza', '16 oz', 5.99, 18, 'QuickMeal.jpeg', 'Hand-tossed style crust topped with zesty tomato sauce and real mozzarella cheese. Ready in just 12 minutes from frozen. Great for busy weeknights or game day gatherings.'),
    ('Everybody''s Bites Fish Sticks', '24 oz', 6.75, 12, 'Everybody_Bites.jpeg', 'Wild-caught white fish in a crispy golden breading. Bake or fry for a quick protein-packed meal. Kids and adults alike love these crunchy seafood favorites.'),
    ('Everybody''s Veggie Medley', '16 oz', 3.25, 30, 'Everybody_Veggie.jpeg', 'A colorful blend of broccoli, carrots, and cauliflower flash-frozen at peak freshness. Steam or sauté for a nutritious side dish in minutes. No prep work required.'),
    ('Cozy Morning Waffles', '10 count', 4.25, 28, 'Cozy_Morning.jpeg', 'Fluffy Belgian-style waffles that crisp up perfectly in the toaster. Made with real buttermilk for authentic homemade taste. Top with syrup, fruit, or whipped cream.'),
    ('IcyFruit Smoothie Packs', '6 pack', 7.50, 15, 'IcyFruit.jpeg', 'Pre-portioned frozen fruit blends perfect for smoothies and shakes. Each pouch contains strawberries, bananas, and mangoes. Just blend with your choice of liquid.'),
    ('Freezer Fresh Burritos', '8 pack', 8.99, 20, 'Freezer_Fresh.jpeg', 'Hearty flour tortillas stuffed with seasoned beans, rice, and cheese. Microwave for 90 seconds for a filling meal on the go. Authentic southwestern flavor in every bite.'),
    ('Polar Treat Ice Cream Goodies', '6 pack', 5.25, 35, 'Polar_Treat.jpeg', 'Chocolate-covered vanilla ice cream bars on a stick. Thick chocolate coating over premium ice cream. A nostalgic treat that brings back childhood memories.'),
    ('Everybody''s Frozen Fries', '32 oz', 3.75, 40, 'Frozen_Fries.jpeg', 'Classic cut potato fries that bake up crispy and golden. Made from whole potatoes with the skin on for extra flavor. Perfect side dish for burgers, sandwiches, or solo snacking.'),
    
    -- Snacks
    ('CrunchTime Potato Chips', '8 oz', 2.99, 55, 'CrunchTime.jpeg', 'Thin-sliced potatoes fried to perfection and lightly salted. Maximum crunch with every bite. The perfect companion for sandwiches, lunches, or movie nights.'),
    ('Everybody''s Trail Mix', '12 oz', 4.50, 32, 'Trail_Mix.jpeg', 'A hearty blend of peanuts, raisins, chocolate chips, and almonds. Great for hiking, road trips, or desk drawer snacking. Provides energy and satisfies sweet and salty cravings.'),
    ('SnackWave Cheese Crackers', '10 oz', 3.25, 48, 'SnackWave.jpeg', 'Buttery crackers baked with real aged cheddar cheese. Crispy, cheesy goodness in every square. Great alone or paired with soup and salads.'),
    ('Choco Delight Cookies', '14 oz', 3.99, 38, 'Choco_Delight.jpeg', 'Soft-baked chocolate chip cookies loaded with real chocolate chunks. Chewy centers with slightly crisp edges. Tastes like homemade from grandma''s kitchen.'),
    ('Munch Masters Pretzels', '16 oz', 2.75, 50, 'Munch_Master.jpeg', 'Traditional twisted pretzels baked until golden and sprinkled with coarse salt. Satisfying crunch without the grease of chips. Perfect for parties or afternoon munching.'),
    ('Not Your Pop''s Corn!', '6 pack', 4.99, 25, 'Not_Your_Pops.jpeg', 'Microwave popcorn that pops up light and fluffy with real butter flavor. Movie theater taste in the comfort of your home. Six individual bags perfect for portion control.'),
    ('Not Cho Cheese Tortilla Chips', '13 oz', 3.50, 42, 'Not_Cho.jpeg', 'Restaurant-style tortilla chips made from stone-ground corn. Thick and sturdy enough for the heartiest dips. Hint of lime adds authentic Mexican flair.'),
    ('Sweet Tooth Candy Bar', '2.1 oz', 1.50, 85, 'Sweet_Tooth.jpeg', 'Chocolate, caramel, and peanuts combine in this satisfying candy bar. Sweet and salty flavors perfectly balanced. Great for a quick energy boost or dessert on the go.'),
    ('Nuts 4 Buds Peanuts', '16 oz', 5.25, 28, 'Nuts_Buds.jpeg', 'Dry roasted peanuts with just the right amount of salt. High in protein and heart-healthy fats. A smart snack choice for any time of day.'),
    ('Crispy Crunch Rice Cakes', '5 oz', 2.99, 36, 'Crispy_Crunch.jpeg', 'Light and airy rice cakes lightly salted for flavor. Low calorie snack that''s satisfying without the guilt. Top with nut butter or enjoy plain.'),
    
    -- Drinks
    ('Everybody''s Cola', '2 liter', 2.25, 60, 'Cola.jpeg', 'Classic cola with the perfect balance of sweetness and carbonation. Crisp, refreshing taste that pairs well with any meal. Best served ice cold.'),
    ('FizzPop Orange Soda', '12 pack cans', 5.99, 35, 'FizzPop.jpeg', 'Bright orange soda bursting with citrus flavor and fizzy bubbles. Made with real orange extract for authentic taste. Twelve convenient cans for parties or stocking up.'),
    ('Pure Spring Water', '24 pack bottles', 4.99, 48, 'Pure_Spring.jpeg', 'Natural spring water sourced from protected mountain springs. Clean, crisp taste with essential minerals. Twenty-four bottles perfect for families, offices, or events.'),
    ('Dark & Drippy Hot Coffee', '12 oz', 1.99, 22, 'Drippy.jpeg', 'Medium roast ground coffee with bold, smooth flavor. Rich aroma fills your kitchen every morning. Makes approximately 12 cups of delicious coffee.'),
    ('Everybody''s Energy Drink', '16 oz', 2.75, 52, 'Everybody_Energy.jpeg', 'Caffeinated beverage with B-vitamins and taurine for sustained energy. Zero sugar formula with tropical fruit flavor. Keeps you alert during long days or late nights.'),
    ('Tropical Splash Juice', '64 oz', 3.99, 30, 'Tropical_Splash.jpeg', 'Blend of pineapple, mango, and passion fruit juices. 100% juice with no added sugar or preservatives. Family-size bottle provides multiple servings.'),
    ('PuckerUp LemonCup Lemonade', '20 oz', 1.99, 70, 'LemonCup.jpeg', 'Fresh-squeezed lemon taste with just the right amount of sweetness. Tart and refreshing on hot days. Made with real lemon juice concentrate.'),
    ('ChillTime Iced Tea', '1 gallon', 3.50, 25, 'ChillTime.jpeg', 'Brewed black tea lightly sweetened and ready to pour over ice. Smooth taste without bitterness. One gallon serves the whole family at dinner.'),
    ('Fan Fuel Sports Drink', '6 pack', 6.50, 28, 'Fan_Fuel.jpeg', 'Electrolyte-enhanced beverage that replenishes what you lose through sweat. Crisp lemon-lime flavor that''s not too sweet. Six bottles ideal for athletes and active lifestyles.'),
    ('Everybody''s Chocolate Milk', '1 quart', 3.25, 40, 'Everybody_Choc_Milk.jpeg', 'Rich chocolate milk made with real cocoa and whole milk. Creamy treat that kids love and adults appreciate. Excellent source of calcium and protein.'),
    
    -- Home Goods
    ('Everybody''s Paper Towels', '6 rolls', 8.99, 45, 'Paper_Towels.jpeg', 'Two-ply paper towels that are strong when wet and absorbent for big spills. Each roll has 100 sheets of durable toweling. Six-roll pack lasts the average household one month.'),
    ('CleanSweep Trash Bags', '30 count', 6.75, 38, 'CleanSweep.jpeg', 'Heavy-duty 13-gallon trash bags with drawstring closure for easy tying. Thick plastic resists tears and punctures. Fits most standard kitchen trash cans perfectly.'),
    ('FreshScent Dish Soap', '24 oz', 3.25, 50, 'FreshScent.jpeg', 'Concentrated dish liquid cuts through grease while being gentle on hands. Fresh lemon scent leaves dishes sparkling clean. A little goes a long way for economical cleaning.'),
    ('PowerCell Batteries', '8 pack AA', 7.50, 25, 'PowerCell.jpeg', 'Long-lasting alkaline AA batteries for all your electronic devices. Reliable power for remotes, toys, flashlights, and more. Eight-pack ensures you always have spares on hand.'),
    ('Everybody''s Toilet Paper', '12 rolls', 9.99, 55, 'TP.jpeg', 'Soft and strong two-ply bathroom tissue that won''t clog pipes. Each roll provides 250 sheets of comfort. Twelve rolls offer excellent value for families.'),
    ('BrightLight LED Bulbs', '4 pack', 11.99, 18, 'BrightLight.jpeg', 'Energy-efficient LED bulbs that last up to 15 years with normal use. 60-watt equivalent brightness using only 9 watts. Saves money on electric bills while providing warm white light.'),
    ('QuickClean Sponges', '6 pack', 4.25, 42, 'QuickClean.jpeg', 'Dual-sided sponges with soft side for gentle cleaning and scrubbing side for tough jobs. Won''t scratch non-stick cookware or delicate surfaces. Six sponges provide months of dishwashing.'),
    ('Everybody''s PowerClean Pods', '40 count', 10.50, 28, 'PowerClean.jpeg', 'Pre-measured laundry detergent pods with stain-fighting enzymes and color protector. Fresh scent lasts for days after washing. Forty pods handle over a month of laundry for most families.'),
    ('AllPurpose Cleaner Spray', '32 oz', 4.99, 35, 'AllPurpose.jpeg', 'Multi-surface cleaner safe for counters, floors, glass, and appliances. Cuts through dirt and grime without harsh chemical smell. Spray bottle makes application quick and easy.'),
    ('FreshAir Room Spray', '9 oz', 5.75, 30, 'FreshAir.jpeg', 'Odor-eliminating room spray with light lavender scent. Neutralizes pet, cooking, and smoke odors instead of masking them. A few sprays freshen any room instantly.'),
     
    -- Uncategorized
    ('Everybody''s 3-Person Water Balloon Launcher', '1', 12.99, 9, 'Water_Balloon.jpeg', 'Giant slingshot designed for epic water balloon battles. Requires three people to operate for maximum distance. Launches balloons up to 100 feet for backyard summer fun.'),
    ('Remote Control Blimp', '1', 34.99, 2, 'Blimp.jpeg', 'Indoor flying blimp controlled by infrared remote. Helium-filled envelope provides gentle, quiet flight. Hours of entertainment floating around your living room.');

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
    (41, 5), (42, 5)`;

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
