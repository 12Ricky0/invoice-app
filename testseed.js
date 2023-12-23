const pg = require('pg');
const { invoices, items } = require('../libs/placeholder_data.js');

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Invoice",
    password: "Suretaste2",
    port: 5433,
});
db.connect();

// async function seedDefaultInvoices() {
//     try {
//         const createTable = await db.query(`
//         CREATE TABLE IF NOT EXISTS default_invoice (
//         invoice_ref SERIAL PRIMARY KEY,
//         id UUID DEFAULT uuid_generate_v4(),
//         created_at DATE,
//         payment_due DATE,
//         description TEXT,
//         payment_terms INT NOT NULL,
//         client_name VARCHAR(255) NOT NULL,
//         client_email VARCHAR(255) NOT NULL,
//         status VARCHAR(30),
//         s_street VARCHAR(255) NOT NULL,
//         s_city VARCHAR(255) NOT NULL,
//         s_post_code VARCHAR(255) NOT NULL,
//         s_country VARCHAR(255) NOT NULL,
//         c_street VARCHAR(255) NOT NULL,
//         c_city VARCHAR(255) NOT NULL,
//         c_post_code VARCHAR(255) NOT NULL,
//         c_country VARCHAR(255) NOT NULL
//         );
//         `)

//         console.log(`Created "defaultInvoices" table`);
//         // Insert data into the "customers" table
//         const insertedInvoice = await Promise.all(
//             invoices.map(
//                 (invoice) => db.query(`
//             INSERT INTO default_invoice (id, created_at, payment_due, description, payment_terms, client_name, client_email, status, s_street, s_city, s_post_code, s_country, c_street, c_city, c_post_code, c_country)
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);
//           `,
//                     [invoice.id, invoice.createdAt, invoice.paymentDue, invoice.description,
//                     invoice.paymentTerms, invoice.clientName, invoice.clientEmail, invoice.status,
//                     invoice.senderAddress.street, invoice.senderAddress.city, invoice.senderAddress.postCode, invoice.senderAddress.country,
//                     invoice.clientAddress.street, invoice.clientAddress.city, invoice.clientAddress.postCode, invoice.clientAddress.country]
//                 ),
//             ),
//         );

//         console.log(`Seeded ${insertedInvoice.length} defaultInvoices`);

//         return {
//             createTable,
//             invoice: insertedInvoice,
//         };


//     } catch (error) {
//         console.error('Error Creating default_invoice Table:', error)
//         throw error
//     }
// }

async function createUsersTable() {

    try {
        const createUserTable = await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      );
    `);

        console.log(`Created "user" table`);
        return createUserTable

    } catch (error) {
        console.error(error);
        throw error;
    }

}

async function seedInvoice(client) {
    try {
        await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        // Create the "customers" table if it doesn't exist
        const createTable = await db.query(`
      CREATE TABLE IF NOT EXISTS invoice (
        id UUID DEFAULT uuid_generate_v4(),
        user_id INT REFERENCES users(user_id),
        invoice_ref SERIAL PRIMARY KEY,
        created_at DATE,
        payment_due DATE,
        description TEXT,
        payment_terms INT NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        status VARCHAR(30)
      );
    `);

        console.log(`Created "user_invoice" table`);

        return createTable

    } catch (error) {
        console.error('Error seeding customers:', error);
        throw error;
    }
}


async function seedSenderAddress(client) {
    try {
        const createTable = await db.query(`
        CREATE TABLE IF NOT EXISTS sender_address (
            user_id INT REFERENCES users(user_id),
            invoice_ref INT REFERENCES invoice(invoice_ref) ON DELETE CASCADE,
            street VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            post_code VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL
        );
        `)
        console.log('created senders address table')

        return createTable

    } catch (error) {
        console.error('Error seeding address:', error)
        throw error;
    }
}

async function seedClientAddress() {
    try {
        const createTable = await db.query(`
        CREATE TABLE IF NOT EXISTS client_address (
            user_id INT REFERENCES users(user_id),
            invoice_ref INT REFERENCES invoice(invoice_ref) ON DELETE CASCADE,
            street VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            post_code VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL
        );
        `)
        console.log('created client address table')

        return createTable

    } catch (error) {
        console.error('Error seeding address:', error)
        throw error;
    }

}

async function seedItems() {
    try {
        const createTable = db.query(`
        CREATE TABLE IF NOT EXISTS items(
            id SERIAL PRIMARY KEY UNIQUE,
            user_id INT REFERENCES users(user_id),
            invoice_ref INT REFERENCES default_invoice(invoice_ref) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            total NUMERIC(10, 2) NOT NULL,
            sub_total NUMERIC(10, 2)
        );
        `)

        console.log('created items table')
        return createTable

    } catch (error) {
        console.error("Error seeding items:", error)
        throw error
    }
}

// async function seedDefaultItems() {
//     try {
//         const createTable = db.query(`
//         CREATE TABLE IF NOT EXISTS default_items(
//             id SERIAL PRIMARY KEY UNIQUE,
//             invoice_ref INT REFERENCES default_invoice(invoice_ref) ON DELETE CASCADE,
//             name VARCHAR(255) NOT NULL,
//             quantity INT NOT NULL,
//             price NUMERIC(10, 2) NOT NULL,
//             total NUMERIC(10, 2) NOT NULL,
//             sub_total NUMERIC(10, 2)
//         );
//         `)
//         console.log('created ITEMS table')

//         const insertedItems = await Promise.all(
//             items.map((item) => db.query(
//                 `
//                 INSERT INTO default_items(invoice_ref, name, quantity, price, total)
//                 VALUES($1, $2, $3, $4, $5)
//                 `,
//                 [item.id, item.name, item.quantity, item.price, item.total]
//             ))
//         )

//         console.log(`Seeded ${insertedItems.length} items`);
//         return {
//             createTable,
//             items: insertedItems,
//         };


//     } catch (error) {
//         console.error("Error seeding items:", error)
//         throw error
//     }
// }


async function main() {
    // await seedDefaultInvoices();
    await createUsersTable();
    await seedInvoice();
    await seedSenderAddress();
    await seedClientAddress();
    await seedItems();
    // await seedDefaultItems();
    await db.end();
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:',
        err,
    );
});

await db.query(`
        INSERT INTO user_invoices(user_id, invoice_ref)
        VALUES ($1, $2), ($1, $3), ($1, $4), ($1, $5), ($1, $6), ($1, $7), ($1, $8) 
        `, [newUser.rows[0].user_id, 1, 2, 3, 4, 5, 6, 7])



await db.query(`
            INSERT INTO invoice (user_id, invoice_ref, created_at, payment_due, description, payment_terms, client_name, client_email, status)
            SELECT $1, invoice_ref, created_at, payment_due, description, payment_terms, client_name, client_email, status
            FROM default_invoice
        `, [newUser.rows[0].user_id]);

await db.query(`
            INSERT INTO sender_address(user_id, invoice_ref, street, city, post_code, country)
            SELECT $1, invoice_ref, s_street, s_city, s_post_code, s_country
            FROM default_invoice
            `, [newUser.rows[0].user_id]);

await db.query(`
            INSERT INTO client_address(user_id, invoice_ref, street, city, post_code, country)
            SELECT $1, invoice_ref, c_street, c_city, c_post_code, c_country
            FROM default_invoice
            `, [newUser.rows[0].user_id]);

await db.query(`
             INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
             SELECT $1, invoice_ref, name, quantity, price, total
             FROM default_items
             `, [newUser.rows[0].user_id]);

text:
'SELECT * FROM invoice WHERE invoice.user_id = $1 AND id = $2 AND',
    values: [userId.rows[0].user_id, id],

            const data = await db.query({
        text: 'SELECT * FROM sender_address WHERE sender_address.user_id = $1 AND invoice_ref = $2',
        values: [userId.rows[0].user_id, ref]
    });

const data = await db.query({
    text: 'SELECT * FROM items WHERE items.user_id = $1 AND invoice_ref = $2',
    values: [userId.rows[0].user_id, ref]
});

const data = await db.query(`
        SELECT * FROM items WHERE items.user_id = $1 AND invoice_ref = $2
        `, [userId.rows[0].user_id, ref]);


await db.query(`
        UPDATE invoice
        SET status = 'Paid'
        where user_id=$1 AND invoice_ref = $2
        `, [userId.rows[0].user_id, ref]);




SELECT
invoice.id, invoice.invoice_ref, client_name, payment_due, created_at, status, SUM(total) as total
        FROM invoice
        JOIN items ON invoice.invoice_ref = items.invoice_ref
        where invoice.user_id = $1
        AND invoice.status ILIKE $2
        GROUP BY invoice.invoice_ref
        ORDER BY invoice_ref

const invoiceRef = await db.query(`
            INSERT INTO invoice (user_id, created_at, payment_due, description, payment_terms, client_name, client_email, status)
            SELECT $1, created_at, payment_due, description, payment_terms, client_name, client_email, status
            FROM default_invoice
            WHERE invoice_ref = $2
            RETURNING invoice_ref
        `, [newUser.rows[0].user_id, ref]);

await db.query(`
            INSERT INTO sender_address(user_id, invoice_ref, street, city, post_code, country)
            SELECT $1, $, s_street, s_city, s_post_code, s_country
            FROM default_invoice
            `, [newUser.rows[0].user_id, ref]);

await db.query(`
            INSERT INTO client_address(user_id, invoice_ref, street, city, post_code, country)
            SELECT $1, invoice_ref, c_street, c_city, c_post_code, c_country
            FROM default_invoice
            `, [newUser.rows[0].user_id, ref]);

await db.query(`
             INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
             SELECT $1, invoice_ref, name, quantity, price, total
             FROM default_items
             `, [newUser.rows[0].user_id, ref]);

await db.query(`
            UPDATE items
            SET user_id = $1, invoice_ref=$3
            where user_id IS NULL AND invoice_ref = $2 
            `, [userId.rows[0].user_id, ref, ref * 15]);
await db.query(`
            UPDATE sender_address
            SET user_id = $1, invoice_ref=$3
            where user_id IS NULL AND invoice_ref = $2 
            `, [userId.rows[0].user_id, ref, ref * 15]);


await db.query(`
            UPDATE client_address
            SET user_id = $1, invoice_ref=$3
            where user_id IS NULL AND invoice_ref = $2 
            `, [userId.rows[0].user_id, ref, ref * 15]);

await db.query(`
            UPDATE invoice
            SET status = 'Paid', user_id = $1, invoice_ref=$3
            where user_id IS NULL AND invoice_ref = $2 
            `, [userId.rows[0].user_id, ref, ref * 15]);


const insertedInvoice = await db.query(`
            INSERT INTO invoice (user_id, created_at, payment_due, description, payment_terms, client_name, client_email, status)
            SELECT $1, created_at, payment_due, description, payment_terms, client_name, client_email, status
            FROM default_invoice
            RETURNING invoice_ref
        `, [newUser.rows[0].user_id]);

const invoiceRefs = insertedInvoice.rows

// for (const ref of invoiceRefs) {
await db.query(`
            INSERT INTO address(user_id, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT $1, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            `, [newUser.rows[0].user_id]);

await db.query(`
                 INSERT INTO items(user_id, name, quantity, price, total)
                 SELECT $1, name, quantity, price, total
                 FROM default_items
                 `, [newUser.rows[0].user_id]);



// }

