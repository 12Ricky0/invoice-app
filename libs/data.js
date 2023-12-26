import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";
import { notFound } from 'next/navigation';
import { auth } from "@/auth";
const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });


export async function fetchInvoice() {
    const { user } = await auth() || {};
    noStore();
    revalidatePath('/dashboard')

    try {

        console.log("Fetching revenue data...");
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
    const { user } = await auth() || {};
    try {
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        const data = await sql`
        SELECT invoice.id, invoice.invoice_ref, client_name, payment_due, created_at, status, SUM(total) as total
        FROM invoice
        JOIN items ON invoice.invoice_ref = items.invoice_ref
        where invoice.user_id = ${userId.rows[0].user_id} AND invoice.status = ${query}
        GROUP BY invoice.invoice_ref
        ORDER BY payment_due        
        ;`;
        const invoice = data.rows?.map((invoice) => ({
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

