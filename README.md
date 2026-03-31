# Everybody's Bodega - Inventory Management System

A full-stack inventory management application for a corner store (bodega), built as part of [The Odin Project](https://www.theodinproject.com/) curriculum. The app allows store staff to browse inventory by category, view item details, add new products, and delete items — all through a clean, server-rendered interface.

---

## Screenshot

> _Screenshot placeholder — add a screenshot of the homepage here_

---

## Features

- **Category browsing** — View inventory organized by category (Frozen Food, Snacks, Drinks, Home Goods, Uncategorized)
- **All items view** — Browse the full inventory in a single list
- **Item detail pages** — View name, size, price, stock level, SKU, and product image
- **Add new items** — Form with server-side validation for all fields
- **Delete items** — Password-protected deletion to prevent accidental or unauthorized removals
- **Sorting** — Sort items by name, price, or stock level on any list view
- **Image support** — Product image URLs with an automatic placeholder fallback
- **Redirect-back navigation** — After actions (add, delete), the app returns the user to their previous context (category page, all items, etc.)
- **Cross-category items** — Items can belong to multiple categories via a junction table

---

## Tech Stack

| Layer         | Technology                     |
| ------------- | ------------------------------ |
| Runtime       | Node.js                        |
| Framework     | Express 5.x                    |
| Database      | PostgreSQL                     |
| DB Client     | node-postgres (`pg`)           |
| Templating    | EJS 5.x                        |
| Validation    | express-validator              |
| Utilities     | dotenv, method-override        |
| Module System | ES Modules (`import`/`export`) |

---

## Database Schema

The app uses three tables with a many-to-many relationship between items and categories.

```
┌─────────────┐       ┌──────────────────┐       ┌───────────────┐
│  categories │       │  item_categories  │       │     items     │
│─────────────│       │──────────────────│       │───────────────│
│ id (PK)     │──────<│ category_id (FK) │>──────│ id (PK)       │
│ name        │       │ item_id (FK)     │       │ name          │
└─────────────┘       └──────────────────┘       │ size          │
                                                  │ price         │
                                                  │ stock         │
                                                  │ image_url     │
                                                  │ sku (auto)    │
                                                  └───────────────┘
```

- **categories** — Store sections (e.g., Frozen Food, Snacks)
- **items** — Individual products with price, stock, size, image URL, and an auto-generated SKU
- **item_categories** — Junction table enabling items to belong to multiple categories

---

## Project Structure

```
bodega-inventory/
├── app.js                     # Express app entry point
├── routes/
│   ├── indexRouter.js         # GET / (homepage)
│   ├── itemsRouter.js         # CRUD routes for items
│   └── categoriesRouter.js    # Category browsing route
├── controllers/
│   ├── indexController.js     # Homepage logic
│   ├── itemsController.js     # Item CRUD + validation
│   └── categoriesController.js # Category item listing
├── db/
│   ├── pool.js                # PostgreSQL connection pool
│   ├── queries.js             # All SQL query functions
│   └── populatedb.js          # DB init and seed script
├── views/
│   ├── index.ejs              # Homepage — category grid
│   ├── categoryPage.ejs       # Items in a category
│   ├── allItemsPage.ejs       # All items list
│   ├── itemPage.ejs           # Individual item detail
│   ├── newItemForm.ejs        # Add item form
│   ├── confirmDelete.ejs      # Delete confirmation + password
│   └── itemDeleted.ejs        # Post-deletion success page
├── partials/
│   ├── formErrors.ejs         # Reusable form validation errors
│   └── passwordErrors.ejs     # Reusable password error display
└── public/
    └── images/                # Static product images + placeholder
```

The app follows an **MVC pattern**: routes delegate to controllers, controllers call query functions, and query functions interact with the database via a shared connection pool.

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (v14+)

### 1. Clone the repository

```bash
git clone https://github.com/housemouse62/bodega-inventory.git
cd bodega-inventory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the database

```bash
psql -U postgres -c "CREATE DATABASE bodega_inventory;"
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DB_CONNECTION=postgresql://localhost/bodega_inventory
ADMIN_PASSWORD=your_admin_password_here
PORT=3000
```

| Variable         | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `DB_CONNECTION`  | PostgreSQL connection string                             |
| `ADMIN_PASSWORD` | Password required to delete items                        |
| `PORT`           | Port to run the server on (optional, defaults to `3000`) |

### 5. Seed the database

Run the population script to create tables and load sample data (42 items across 5 categories):

```bash
node db/populatedb.js
```

### 6. Start the server

```bash
node app.js
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Routes Reference

| Method | Path                           | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| `GET`  | `/`                            | Homepage — all categories       |
| `GET`  | `/category/:id`                | All items in a category         |
| `GET`  | `/items`                       | All items                       |
| `GET`  | `/items/new`                   | Add new item form               |
| `POST` | `/items/new`                   | Submit new item                 |
| `GET`  | `/items/:id`                   | Item detail page                |
| `GET`  | `/items/:id/confirmDeleteItem` | Delete confirmation dialog      |
| `POST` | `/items/:id/deleteItem`        | Delete item (requires password) |

**Sorting** is supported on list views via a `?sort=` query parameter:

- `/items?sort=name` — sort by item name
- `/category/:id?sort=price` — sort by price
- `/items?sort=stock` — sort by stock level

---

## Deployment

### Deploying to Render

1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com) and connect your repo
3. Add a **PostgreSQL** database instance on Render
4. Set environment variables in the Render dashboard (`DB_CONNECTION`, `ADMIN_PASSWORD`)
5. Set the start command to `node app.js`
6. After the service is live, run the seed script against your production database:

```bash
DB_CONNECTION=your_render_db_connection_string node db/populatedb.js
```

---

## Future Enhancements

- **User authentication** — Replace the single admin password with proper user accounts and sessions
- **Direct image uploads** — Allow file uploads instead of requiring an image URL
- **Category CRUD** — Add, edit, and delete categories (currently read-only)
- **Edit items** — Update existing item details without deleting and re-adding
- **Search and filter** — Find items by name, price range, or stock level
- **Pagination** — Handle large inventories without loading all items at once
- **Low stock alerts** — Flag items below a configurable stock threshold
- **Bulk operations** — Import/export inventory via CSV

---

## Learning Outcomes

This project was built to practice:

- **RESTful routing** with Express — organizing routes by resource and HTTP method
- **Relational database design** — modeling many-to-many relationships with a junction table
- **SQL with node-postgres** — writing raw parameterized queries and managing a connection pool
- **Server-side form validation** — using express-validator with custom error messages and re-rendered forms
- **MVC architecture** — separating routing, business logic, and data access concerns
- **EJS templating** — rendering dynamic HTML with partials for reusable components
- **Admin access control** — password-protecting destructive actions without a full auth system
- **User experience details** — redirect-back navigation, placeholder images, and sort controls

---

## License

ISC

todo:
Add edit button to individual item page
Password protect add new item. editing too?
