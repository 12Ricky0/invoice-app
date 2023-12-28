import { sql } from "@vercel/postgres";
import { auth } from "@/auth";


export async function insertDefaultInvoice(ref) {
    const { user } = await auth() || {};
    try {
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        const data = await sql`
            INSERT INTO invoice (user_id, created_at, payment_due, description, payment_terms, client_name, client_email, status)
            SELECT ${userId.rows[0].user_id}, created_at, payment_due, description, payment_terms, client_name, client_email, status
            FROM default_invoice
            RETURNING invoice_ref
    `;

        await Promise.all([
            sql`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT ${userId.rows[0].user_id}, ${data.rows[0].invoice_ref}, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=${1}
            `,
            sql`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT ${userId.rows[0].user_id}, ${data.rows[1].invoice_ref}, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=${2}
            `,
            sql`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT ${userId.rows[0].user_id}, ${data.rows[2].invoice_ref}, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=${3}
            `,
            sql`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT ${userId.rows[0].user_id}, ${data.rows[3].invoice_ref}, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=${4}
            `,
            sql`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT ${userId.rows[0].user_id}, ${data.rows[4].invoice_ref}, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=${5}
            `,
            sql`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT ${userId.rows[0].user_id}, ${data.rows[5].invoice_ref}, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=${6}
            `,
            sql`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            SELECT ${userId.rows[0].user_id}, ${data.rows[6].invoice_ref}, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country
            FROM default_invoice
            WHERE invoice_ref=${7}
            `,

        ])

        await Promise.all([
            sql`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT ${userId.rows[0].user_id}, ${data.rows[0].invoice_ref}, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=${1}
         `,
            sql`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT ${userId.rows[0].user_id}, ${data.rows[1].invoice_ref}, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=${2}
         `,
            sql`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT ${userId.rows[0].user_id}, ${data.rows[2].invoice_ref}, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=${3}
         `,
            sql`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT ${userId.rows[0].user_id}, ${data.rows[3].invoice_ref}, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=${4}
         `,
            sql`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT ${userId.rows[0].user_id}, ${data.rows[4].invoice_ref}, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=${5}
         `,
            sql`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT ${userId.rows[0].user_id}, ${data.rows[5].invoice_ref}, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=${6}
         `,

            sql`
        INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
        SELECT ${userId.rows[0].user_id}, ${data.rows[6].invoice_ref}, name, quantity, price, total
        FROM default_items
        WHERE invoice_ref=${7}
         `,

        ])


    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to insert default invoice.");

    }
}
