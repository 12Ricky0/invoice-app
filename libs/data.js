import pg from 'pg';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";
import { notFound } from 'next/navigation';
import { auth } from "@/auth";



const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});
pool.connect()

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "Invoice",
//     password: process.env.PASSWORD,
//     port: 5433,
// });
// db.connect();


export async function fetchInvoice() {
    // Add noStore() here prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).
    const { user } = await auth() || {};
    noStore();
    revalidatePath('/dashboard')

    try {

        console.log("Fetching revenue data...");
        // await new Promise((resolve) => setTimeout(resolve, 3000));
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;


        const data = await sql`
                SELECT 
                invoice.id,invoice.invoice_ref, client_name, payment_due, created_at, status, SUM(total) as total
                FROM invoice
                JOIN items ON invoice.invoice_ref=items.invoice_ref
                where invoice.user_id = ${userId.rows[0].user_id} OR NULL
                GROUP BY invoice.invoice_ref
                ORDER BY payment_due 
        `;
        // const data2 = await db.query(`
        // SELECT user_invoices.user_id, invoice.id, invoice.invoice_ref, invoice.status, 
        // invoice.client_name, invoice.payment_due, invoice.created_at, SUM(items.total) as total
        // FROM user_invoices
        // JOIN invoice ON user_invoices.invoice_ref = invoice.invoice_ref
        // JOIN items ON user_invoices.invoice_ref = items.invoice_ref
        // WHERE user_invoices.user_id = $1
        // GROUP BY user_invoices.user_id, invoice.id, invoice.invoice_ref
        // ORDER BY payment_due        
        // `, [userId.rows[0].user_id]);
        console.log("Data fetch complete after 3 seconds.");

        const invoice = data.rows.map((invoice) => ({
            ...invoice,
            total: gbp.format(invoice.total)
        }));
        // const invoice2 = data2.rows.map((invoice) => ({
        //     ...invoice,
        //     total: gbp.format(invoice.total)
        // }));

        return invoice;

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch revenue data.");
    }

}


export async function fetchFilteredInvoice(query) {
    const { user } = await auth() || {};

    try {
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        const data = sql`
        SELECT invoice.id, invoice.invoice_ref, client_name, payment_due, created_at, status, SUM(total) as total
        FROM invoice
        JOIN items ON invoice.invoice_ref = items.invoice_ref
        where invoice.user_id = ${userId.rows[0].user_id}
        AND invoice.status ILIKE ${query}
        GROUP BY invoice.invoice_ref
        ORDER BY payment_due        
        `;

        const invoice = data.rows.map((invoice) => ({
            ...invoice,
            total: gbp.format(invoice.total)
        }));
        return invoice;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch filtered invoice.");
    }
}

export async function fetchDetails(id) {
    noStore();
    const { user } = await auth() || {};

    try {
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        const data = await sql`
        SELECT * FROM invoice
        WHERE invoice.user_id=${userId.rows[0].user_id}  AND invoice.id=${id} 
        `;

        return data.rows;

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error(notFound());
    }
}

export async function fetchAddress(ref) {
    noStore();
    const { user } = await auth() || {};

    try {
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        const data = await sql`
        SELECT * FROM address
        WHERE address.user_id=${userId.rows[0].user_id}  AND address.invoice_ref=${ref} 
        `;

        return data.rows

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch client address.");
    }
}

// export async function fetchSenderAddress(ref) {
//     noStore();
//     const { user } = await auth() || {};

//     try {
//         const userId = await db.query(`
//         SELECT user_id
//         FROM users
//         WHERE email = $1
//     `, [user?.email]);

//         const data = await db.query(`
//         SELECT sender_address.* FROM user_invoices
//         JOIN sender_address on sender_address.invoice_ref=user_invoices.invoice_ref
//         WHERE (sender_address.user_id=$1 OR sender_address.user_id IS NULL) AND sender_address.invoice_ref=$2 
//         `, [userId.rows[0].user_id, ref]);

//         return data.rows
//     } catch (error) {
//         console.error("Database Error:", error);
//         throw new Error("Failed to fetch sender address.");
//     }
// }

export async function fetchItems(ref) {
    noStore();
    const { user } = await auth() || {};

    try {
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        const data = await sql`
        SELECT * FROM items
        WHERE items.user_id = ${userId.rows[0].user_id} AND items.invoice_ref=${ref} 
        `;

        var total = 0
        data.rows.forEach(data => total += Number(data.total))
        const invoice = data.rows.map((invoice) => ({
            ...invoice,
            // Convert amount from cents to dollars
            price: gbp.format(invoice.price),
            total: gbp.format(invoice.total),
            sub_total: gbp.format(total)

        }));
        return invoice;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch items");
    }
}

export async function itemsToEdit(ref) {
    noStore();
    const { user } = await auth() || {};

    try {
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        const data = await sql`
        SELECT * FROM items
        WHERE items.user_id = ${userId.rows[0].user_id} AND items.invoice_ref=${ref} 
        `;

        return data.rows
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch items");
    }
}

// export async function fetchTotalInvoice() {

//     try {
//         const data = await db.query(`
//         SELECT invoice_ref
//         FROM invoice
//         `);

//         return data.rows
//     } catch (error) {
//         console.error("Database Error", error);
//         throw new Error("Failed to fetch total invoice")
//     }
// }
