import pg from 'pg';
import { auth } from "@/auth";


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Invoice",
    password: process.env.PASSWORD,
    port: 5433,
});
db.connect();


export async function insertDefaultInvoice(ref) {
    const { user } = await auth() || {};
    try {
        const userId = await db.query(`
        SELECT user_id
        FROM users
        WHERE email = $1
    `, [user?.email]);

        const data = await db.query(`
            INSERT INTO invoice (user_id, created_at, payment_due, description, payment_terms, client_name, client_email, status)
            SELECT $1, created_at, payment_due, description, payment_terms, client_name, client_email, status
            FROM default_invoice
            RETURNING invoice_ref
    `, [userId.rows[0].user_id]);

        await Promise.all([
            db.query(`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT $1, $2, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=$3
            `, [userId.rows[0].user_id, data.rows[0].invoice_ref, '1']),
            db.query(`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT $1, $2, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=$3
            `, [userId.rows[0].user_id, data.rows[1].invoice_ref, '2']),
            db.query(`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT $1, $2, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=$3
            `, [userId.rows[0].user_id, data.rows[2].invoice_ref, '3']),
            db.query(`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT $1, $2, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=$3
            `, [userId.rows[0].user_id, data.rows[3].invoice_ref, '4']),
            db.query(`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT $1, $2, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=$3
            `, [userId.rows[0].user_id, data.rows[4].invoice_ref, '5']),
            db.query(`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT $1, $2, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=$3
            `, [userId.rows[0].user_id, data.rows[5].invoice_ref, '6']),
            db.query(`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT $1, $2, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=$3
            `, [userId.rows[0].user_id, data.rows[6].invoice_ref, '7'])

        ])

        await Promise.all([
            db.query(`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT $1, $2, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=$3
         `, [userId.rows[0].user_id, data.rows[0].invoice_ref, '1']),
            db.query(`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT $1, $2, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=$3
         `, [userId.rows[0].user_id, data.rows[1].invoice_ref, '2']),
            db.query(`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT $1, $2, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=$3
         `, [userId.rows[0].user_id, data.rows[2].invoice_ref, '3']),
            db.query(`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT $1, $2, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=$3
         `, [userId.rows[0].user_id, data.rows[3].invoice_ref, '4']),
            db.query(`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT $1, $2, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=$3
         `, [userId.rows[0].user_id, data.rows[4].invoice_ref, '5']),
            db.query(`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT $1, $2, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=$3
         `, [userId.rows[0].user_id, data.rows[5].invoice_ref, '6']),

            db.query(`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT $1, $2, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=$3
         `, [userId.rows[0].user_id, data.rows[6].invoice_ref, '7'])

        ])


    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to insert default invoice.");

    }
}
