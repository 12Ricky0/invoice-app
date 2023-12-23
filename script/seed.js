const pg = require('pg');
const { invoices, items } = require('../libs/placeholder_data.js');

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Invoice",
    password: process.env.PASSWORD,
    port: 5433,
});
db.connect();

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

// async function createUserInvoice(params) {
//     try {
//         const createTable = await db.query(`
//     CREATE TABLE IF NOT EXISTS user_invoices (
//     user_id INT REFERENCES users(user_id),
//     invoice_ref INT REFERENCES invoice(invoice_ref) ON DELETE CASCADE,
//     PRIMARY KEY (user_id, invoice_ref)
//      );
//     `);

//         console.log(`Created "user_invoice" table`);
//         return createTable


//     } catch (error) {
//         console.error(error);
//         throw error;

//     }
// }

async function seedInvoice(client) {
    try {
        await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        // Create the "customers" table if it doesn't exist
        const createTable = await db.query(`
      CREATE TABLE IF NOT EXISTS invoice (
        user_id INT REFERENCES users(user_id),
        invoice_ref SERIAL PRIMARY KEY,
        id UUID DEFAULT uuid_generate_v4(),
         created_at DATE,
        payment_due DATE,
        description TEXT,
        payment_terms INT NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        status VARCHAR(30)
      );
    `);

        console.log(`Created "customers" table`);

        // const insertedInvoice = await Promise.all(
        //     invoices.map(
        //         (invoice) => db.query(`
        //     INSERT INTO invoice (id, created_at, payment_due, description, payment_terms, client_name, client_email, status)
        //     VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        //   `,
        //             [invoice.id, invoice.createdAt, invoice.paymentDue, invoice.description, invoice.paymentTerms, invoice.clientName, invoice.clientEmail, invoice.status]
        //         ),
        //     ),
        // );

        // console.log(`Seeded ${insertedInvoice.length} customers`);

        // return {
        //     createTable,
        //     invoice: insertedInvoice,
        // };
        return createTable
    } catch (error) {
        console.error('Error seeding customers:', error);
        throw error;
    }
}


async function seedAddress(client) {
    try {
        const createTable = await db.query(`
        CREATE TABLE IF NOT EXISTS address (
            user_id INT REFERENCES users(user_id),
            invoice_ref INT REFERENCES invoice(invoice_ref) ON DELETE CASCADE,
            sen_street VARCHAR(255) NOT NULL,
            sen_city VARCHAR(255) NOT NULL,
            sen_post_code VARCHAR(255) NOT NULL,
            sen_country VARCHAR(255) NOT NULL,
            cli_street VARCHAR(255) NOT NULL,
            cli_city VARCHAR(255) NOT NULL,
            cli_post_code VARCHAR(255) NOT NULL,
            cli_country VARCHAR(255) NOT NULL
        );
        `)
        console.log('created senders address table')

        // const insertedAddress = await Promise.all(
        //     invoices.map((invoice) => db.query(`
        //     INSERT INTO address(invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
        //     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        //     `,
        //         [invoice.ref, invoice.senderAddress.street, invoice.senderAddress.city, invoice.senderAddress.postCode, invoice.senderAddress.country,
        //         invoice.clientAddress.street, invoice.clientAddress.city, invoice.clientAddress.postCode, invoice.clientAddress.country]
        //     ),),
        // );
        // console.log(`Seeded ${insertedAddress.length} address`);

        // return {
        //     createTable,
        //     address: insertedAddress,
        // };
        return createTable
    } catch (error) {
        console.error('Error seeding address:', error)
        throw error;
    }
}

// async function seedClientAddress() {
//     try {
//         const createTable = await db.query(`
//         CREATE TABLE IF NOT EXISTS client_address (
//             user_id INT REFERENCES users(user_id),
//             invoice_ref INT REFERENCES invoice(invoice_ref) ON DELETE CASCADE UNIQUE,
//             street VARCHAR(255) NOT NULL,
//             city VARCHAR(255) NOT NULL,
//             post_code VARCHAR(255) NOT NULL,
//             country VARCHAR(255) NOT NULL
//         );
//         `)
//         console.log('created client address table')

//         const insertedAddress = await Promise.all(
//             invoices.map((invoice) => db.query(`
//             INSERT INTO client_address(invoice_ref, street, city, post_code, country)
//             VALUES($1, $2, $3, $4, $5)
//             ON CONFLICT (invoice_ref) DO NOTHING;
//             `,
//                 [invoice.ref, invoice.clientAddress.street, invoice.clientAddress.city, invoice.clientAddress.postCode, invoice.clientAddress.country]
//             ),),
//         );
//         console.log(`Seeded ${insertedAddress.length} address`);

//         return {
//             createTable,
//             client_address: insertedAddress,
//         };

//     } catch (error) {
//         console.error('Error seeding address:', error)
//         throw error;
//     }

// }

async function seedItems() {
    try {
        const createTable = db.query(`
        CREATE TABLE IF NOT EXISTS items(
            id SERIAL PRIMARY KEY UNIQUE,
            user_id INT REFERENCES users(user_id),
            invoice_ref INT REFERENCES invoice(invoice_ref) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            total NUMERIC(10, 2) NOT NULL,
            sub_total NUMERIC(10, 2)
        );
        `)
        console.log('created ITEMS table')

        // const insertedItems = await Promise.all(
        //     items.map((item) => db.query(
        //         `
        //         INSERT INTO items(invoice_ref, name, quantity, price, total)
        //         VALUES($1, $2, $3, $4, $5)
        //         `,
        //         [item.id, item.name, item.quantity, item.price, item.total]
        //     ))
        // )

        // console.log(`Seeded ${insertedItems.length} items`);
        // return {
        //     createTable,
        //     items: insertedItems,
        // };
        return createTable

    } catch (error) {
        console.error("Error seeding items:", error)
        throw error
    }
}

async function seedDefaultInvoices() {
    try {
        const createTable = await db.query(`
        CREATE TABLE IF NOT EXISTS default_invoice (
        invoice_ref SERIAL PRIMARY KEY,
        id UUID DEFAULT uuid_generate_v4(),
        created_at DATE,
        payment_due DATE,
        description TEXT,
        payment_terms INT NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        status VARCHAR(30),
        sen_street VARCHAR(255) NOT NULL,
        sen_city VARCHAR(255) NOT NULL,
        sen_post_code VARCHAR(255) NOT NULL,
        sen_country VARCHAR(255) NOT NULL,
        cli_street VARCHAR(255) NOT NULL,
        cli_city VARCHAR(255) NOT NULL,
        cli_post_code VARCHAR(255) NOT NULL,
        cli_country VARCHAR(255) NOT NULL
        );
        `)

        console.log(`Created "defaultInvoices" table`);
        // Insert data into the "customers" table
        const insertedInvoice = await Promise.all(
            invoices.map(
                (invoice) => db.query(`
            INSERT INTO default_invoice (id, created_at, payment_due, description, payment_terms, client_name, client_email, status, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);
          `,
                    [invoice.id, invoice.createdAt, invoice.paymentDue, invoice.description,
                    invoice.paymentTerms, invoice.clientName, invoice.clientEmail, invoice.status,
                    invoice.senderAddress.street, invoice.senderAddress.city, invoice.senderAddress.postCode, invoice.senderAddress.country,
                    invoice.clientAddress.street, invoice.clientAddress.city, invoice.clientAddress.postCode, invoice.clientAddress.country]
                ),
            ),
        );

        console.log(`Seeded ${insertedInvoice.length} defaultInvoices`);

        return {
            createTable,
            invoice: insertedInvoice,
        };


    } catch (error) {
        console.error('Error Creating default_invoice Table:', error)
        throw error
    }
}


async function seedDefaultItems() {
    try {
        const createTable = db.query(`
        CREATE TABLE IF NOT EXISTS default_items(
            id SERIAL PRIMARY KEY UNIQUE,
            invoice_ref INT REFERENCES default_invoice(invoice_ref) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            total NUMERIC(10, 2) NOT NULL,
            sub_total NUMERIC(10, 2)
        );
        `)
        console.log('created DEFAULT ITEMS table')

        const insertedItems = await Promise.all(
            items.map((item) => db.query(
                `
                INSERT INTO default_items(invoice_ref, name, quantity, price, total)
                VALUES($1, $2, $3, $4, $5)
                `,
                [item.id, item.name, item.quantity, item.price, item.total]
            ))
        )

        console.log(`Seeded ${insertedItems.length} defaultItems`);
        return {
            createTable,
            items: insertedItems,
        };


    } catch (error) {
        console.error("Error seeding items:", error)
        throw error
    }
}



async function main() {
    await createUsersTable();
    await seedInvoice();
    await seedAddress();
    // await seedClientAddress();
    await seedItems();
    // await createUserInvoice();
    await seedDefaultInvoices();
    await seedDefaultItems();
    await db.end();
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:',
        err,
    );
});