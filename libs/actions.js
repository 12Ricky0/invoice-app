'use server';
import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";
import { items } from "./placeholder_data";
import validator from "validator";
import { fetchTotalInvoice, fetchInvoice } from "./data";
const pg = require('pg');

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Invoice",
    password: "Suretaste2",
    port: 5433,
});
db.connect();

export default async function createInvoice(prevState, formData) {
    const invoice = {
        clientName: formData.get('cName'),
        date: formData.get('date'),
        paymentTerm: formData.get('paymentTerm'),
        description: formData.get('pjDesc'),
        clientEmail: formData.get('cEmail'),

    }

    // Convert invoice.date to a Date object
    const invoiceDate = new Date(invoice.date);
    const paymentTerm = Number(invoice.paymentTerm)
    // Add 20 days to the invoice date
    const payment_due = new Date(invoiceDate.getTime() + (paymentTerm * 24 * 60 * 60 * 1000));

    const billFrom = {
        streetAddress: formData.get('strAdr'),
        city: formData.get('city'),
        postCode: formData.get('post-code'),
        country: formData.get('country'),
    };
    const billTo = {
        city: formData.get('cCity'),
        postCode: formData.get('cPost-code'),
        country: formData.get('cCountry'),
        streetAddress: formData.get('cAddress'),
    };

    const status = formData.get('saveDraft') === 'Save as Draft' ? 'Draft' : 'Pending';

    const items = {
        itemName: formData.getAll('itmName'),
        quantity: formData.getAll('qty'),
        price: formData.getAll('price'),
        total: formData.getAll('total'),
    }
    if (validator.isEmpty(invoice.clientName)) {
        return {
            cln: 'can`t be empty',
        }
    }

    if (items.itemName.length === 0) {
        return {
            errors: '- An item must be added',
            message: "- All fields must be added"
        }
    }

    for (let i = 0; i < items.itemName.length; i++) {
        const itemName = items.itemName[i];
        const quantity = items.quantity[i];
        const price = items.price[i];
        const total = items.total[i];
        if (validator.isEmpty(itemName + '') || validator.isEmpty(quantity + '') || validator.isEmpty(price + '')) {
            return {
                message: "- All fields must be added"
            }
        }

        if (quantity < 1 || price < 1) {
            return {
                errors: '- Invalid quantity/price',
                message: "- Enter a valid quantity/price"
            }

        }
    }
    console.log(items.itemName.length)



    // await new Promise((resolve) => setTimeout(resolve, 3000));

    try {

        await db.query(`
            INSERT INTO invoice (created_at, payment_due, description, payment_terms, client_name, client_email, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
            [invoice.date, payment_due, invoice.description, invoice.paymentTerm, invoice.clientName, invoice.clientEmail, status]
        )

        const totalInvoice = await fetchTotalInvoice()
        const invoice_ref = totalInvoice[totalInvoice.length - 1].invoice_ref


        for (let i = 0; i < items.itemName.length; i++) {
            const itemName = items.itemName[i];
            const quantity = items.quantity[i];
            const price = items.price[i];
            const total = items.total[i];

            await db.query(`
                INSERT INTO items(invoice_ref, name, quantity, price, total)
                VALUES($1, $2, $3, $4, $5)
        `,
                [invoice_ref, itemName, quantity, price, total]
            )

        }


        await db.query(`
            INSERT INTO client_address(invoice_ref, street, city, post_code, country)
            VALUES($1, $2, $3, $4, $5);
        `,
            [invoice_ref, billTo.streetAddress, billTo.city, billTo.postCode, billTo.country]
        );

        await db.query(`
            INSERT INTO sender_address(invoice_ref, street, city, post_code, country)
            VALUES($1, $2, $3, $4, $5);
        `,
            [invoice_ref, billFrom.streetAddress, billFrom.city, billFrom.postCode, billFrom.country]
        );



    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error Creating Invoice")
    }

    // console.log((totalInvoice[totalInvoice.length - 1].invoice_ref) + 1)

    revalidatePath('/dashboard');
    redirect('/dashboard',);
}

export async function deleteInvoice(ref) {

    try {
        await db.query(`
        DELETE FROM items
        WHERE invoice_ref = $1
        `, [ref]);

        await db.query(`
        DELETE FROM client_address
        WHERE invoice_ref = $1
        `, [ref]);

        await db.query(`
        DELETE FROM sender_address
        WHERE invoice_ref = $1
        `, [ref]);

        await db.query(`
        DELETE FROM invoice
        WHERE invoice_ref = $1
        `, [ref]);

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error deleting invoice")
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');

}

export async function updateInvoice(ref, id) {
    try {
        await db.query(`
        UPDATE invoice
        SET status = 'Paid'
        where invoice_ref = $1
        `, [ref]);
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error updating invoice")

    }
    revalidatePath(`/dashboard/${id}`);

}

export async function updateEditedInvoice(id, prevState, formData) {
    const invoice = {

        clientName: formData.get('cName'),
        date: formData.get('date'),
        paymentTerm: formData.get('paymentTerm'),
        description: formData.get('pjDesc'),
        clientEmail: formData.get('cEmail'),

    }

    const invoiceDate = new Date(invoice.date);
    const paymentTerm = Number(invoice.paymentTerm)
    const payment_due = new Date(invoiceDate.getTime() + (paymentTerm * 24 * 60 * 60 * 1000));

    const billFrom = {
        streetAddress: formData.get('strAdr'),
        city: formData.get('city'),
        postCode: formData.get('post-code'),
        country: formData.get('country'),
    };
    const billTo = {
        city: formData.get('cCity'),
        postCode: formData.get('cPost-code'),
        country: formData.get('cCountry'),
        streetAddress: formData.get('cAddress'),
    };

    const items = {
        itemName: formData.getAll('itmName'),
        quantity: formData.getAll('qty'),
        price: formData.getAll('price'),
        total: formData.getAll('total'),
    }
    if (validator.isEmpty(invoice.clientName)) {
        return {
            cln: 'can`t be empty',
        }
    }

    if (items.itemName.length === 0) {
        return {
            errors: '- An item must be added',
            message: "- All fields must be added"
        }
    }

    for (let i = 0; i < items.itemName.length; i++) {
        const itemName = items.itemName[i];
        const quantity = items.quantity[i];
        const price = items.price[i];
        if (validator.isEmpty(itemName + '') || validator.isEmpty(quantity + '') || validator.isEmpty(price + '')) {
            return {
                message: "- All fields must be added"
            }
        }

        if (quantity < 1 || price < 1) {
            return {
                errors: '- Invalid quantity/price',
                message: "- Enter a valid quantity/price"
            }

        }
    }
    try {

        await db.query(`
            UPDATE invoice 
            SET created_at = $2, payment_due = $3, description = $4, payment_terms = $5, client_name = $6, client_email = $7
            WHERE invoice_ref = $1
        `,
            [id, invoice.date, payment_due, invoice.description, invoice.paymentTerm, invoice.clientName, invoice.clientEmail]
        );


        for (let i = 0; i < items.itemName.length; i++) {
            const itemName = items.itemName[i];
            const quantity = items.quantity[i];
            const price = items.price[i];
            const total = items.total[i];

            db.query(`
                UPDATE items
                SET name = $2, quantity = $3, price = $4, total = $5
                where invoice_ref = $1
        `,
                [id, itemName, quantity, price, total]
            );

        }

        await db.query(`
            UPDATE client_address
            SET street = $2, city = $3, post_code = $4, country = $5
            where invoice_ref = $1
        `,
            [id, billTo.streetAddress, billTo.city, billTo.postCode, billTo.country]
        );

        await db.query(`
            UPDATE sender_address
            SET street = $1, city = $2, post_code = $3, country = $4
            where invoice_ref = $5
        `,
            [billFrom.streetAddress, billFrom.city, billFrom.postCode, billFrom.country, id]
        );



    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error Updating Invoice")
    }

    // console.log((totalInvoice[totalInvoice.length - 1].invoice_ref) + 1)

    revalidatePath('/dashboard');
    redirect('/dashboard',);

}

