import pg from 'pg';
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";
const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
import { notFound } from 'next/navigation';



const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Invoice",
    password: "Suretaste2",
    port: 5433,
});
db.connect();

export async function fetchInvoice() {
    // Add noStore() here prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).
    noStore();
    revalidatePath('/dashboard')

    try {

        console.log("Fetching revenue data...");
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        const data = await db.query(`
                SELECT 
                invoice.id,invoice.invoice_ref, client_name, payment_due, created_at, status, SUM(total) as total
                FROM invoice
                JOIN items ON invoice.invoice_ref=items.invoice_ref
                GROUP BY invoice.invoice_ref
                ORDER BY invoice_ref 
        `);
        console.log("Data fetch complete after 3 seconds.");

        const invoice = data.rows.map((invoice) => ({
            ...invoice,
            total: gbp.format(invoice.total)
        }));

        return invoice;

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch revenue data.");
    }

}

export async function fetchFilteredInvoice(query) {
    try {
        const data = await db.query(`
        SELECT 
        invoice.id,invoice.invoice_ref, client_name, payment_due, created_at, status, SUM(total) as total
        FROM invoice
        JOIN items ON invoice.invoice_ref=items.invoice_ref
        WHERE invoice.status ILIKE $1
        GROUP BY invoice.invoice_ref
        ORDER BY invoice_ref
        `, [query]);

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

    try {
        const data = await db.query({
            text: 'SELECT * FROM invoice WHERE id = $1',
            values: [id],
        });
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error(notFound());
    }
}

export async function fetchClientAddress(ref) {
    noStore();

    try {
        const data = await db.query({
            text: 'SELECT * FROM client_address WHERE invoice_ref = $1',
            values: [ref]
        });
        return data.rows

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch client address.");
    }
}

export async function fetchSenderAddress(ref) {
    noStore();

    try {
        const data = await db.query({
            text: 'SELECT * FROM sender_address WHERE invoice_ref = $1',
            values: [ref]
        });

        return data.rows
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch sender address.");
    }
}

export async function fetchItems(ref) {
    noStore();

    try {
        const data = await db.query({
            text: 'SELECT * FROM items WHERE invoice_ref = $1',
            values: [ref]
        });
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

    try {
        const data = await db.query(`
        SELECT * FROM items WHERE invoice_ref = $1
        `, [ref]);
        return data.rows
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch items");
    }
}

export async function fetchTotalInvoice() {

    try {
        const data = await db.query(`
        SELECT invoice_ref
        FROM invoice
        `);

        return data.rows
    } catch (error) {
        console.error("Database Error", error);
        throw new Error("Failed to fetch total invoice")
    }
}
