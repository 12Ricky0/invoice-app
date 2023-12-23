'use server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import validator from "validator";
import { insertDefaultInvoice } from "./defaultInvoice";
const pg = require('pg');
import { auth } from "@/auth";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Invoice",
    password: process.env.PASSWORD,
    port: 5433,
});
db.connect();


export async function seedUser() {
    const { user } = await auth() || {};

    try {
        const emailExists = await db.query(`
        SELECT user_id
        FROM users
        WHERE email = $1
    `, [user?.email]);
        console.log(emailExists.rows)
        if (emailExists.rows.length > 0) {
            console.log("Email already exists");
        } else {
            const newUser = await db.query(`
            INSERT INTO users(name, email)
            VALUES($1, $2)
            RETURNING user_id
        `, [user?.name, user?.email]);
            await insertDefaultInvoice()

        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export default async function createInvoice(id, prevState, formData) {
    const { user } = await auth() || {};

    const invoice = {
        clientName: formData.get('cName'),
        date: formData.get('date'),
        paymentTerm: formData.get('paymentTerm'),
        description: formData.get('pjDesc'),
        clientEmail: formData.get('cEmail'),

    }
    console.log(user)

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

    try {

        const userId = await db.query(`
        SELECT user_id
        FROM users
        WHERE email = $1
    `, [user?.email]);

        const data = await db.query(`
            INSERT INTO invoice (user_id, created_at, payment_due, description, payment_terms, client_name, client_email, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING invoice_ref;
        `,
            [userId.rows[0].user_id, invoice.date, payment_due, invoice.description, invoice.paymentTerm, invoice.clientName, invoice.clientEmail, status]
        )

        const invoice_ref = data.rows[0].invoice_ref


        for (let i = 0; i < items.itemName.length; i++) {
            const itemName = items.itemName[i];
            const quantity = items.quantity[i];
            const price = items.price[i];
            const total = items.total[i];

            await db.query(`
                INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
                VALUES($1, $2, $3, $4, $5, $6)
        `,
                [userId.rows[0].user_id, invoice_ref, itemName, quantity, price, total]
            )

        }


        await db.query(`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `,
            [userId.rows[0].user_id, invoice_ref, billFrom.streetAddress, billFrom.city, billFrom.postCode, billFrom.country, billTo.streetAddress, billTo.city, billTo.postCode, billTo.country]
        );


    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error Creating Invoice")
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function deleteInvoice(ref) {
    const { user } = await auth() || {};


    try {
        const userId = await db.query(`
        SELECT user_id
        FROM users
        WHERE email = $1
    `, [user?.email]);

        await db.query(`
        DELETE FROM invoice
        WHERE user_id =$1 AND invoice_ref = $2
        `, [userId.rows[0].user_id, ref]);
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error deleting invoice")
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');

}

export async function updateInvoice(ref, id) {
    const { user } = await auth() || {};

    try {

        const userId = await db.query(`
        SELECT user_id
        FROM users
        WHERE email = $1
    `, [user?.email]);

        await db.query(`
        UPDATE invoice
        SET status = 'Paid'
        where user_id=$1 AND invoice_ref = $2
        `, [userId.rows[0].user_id, ref]);
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

            await db.query(`
                    UPDATE items
                    SET name = $2, quantity = $3, price = $4, total = $5
                    where invoice_ref = $1
            `,
                [id, itemName, quantity, price, total]
            );
        }

        await db.query(`
            UPDATE address
            SET cli_street = $2, cli_city = $3, cli_post_code = $4, cli_country = $5, sen_street = $6, sen_city = $7, sen_post_code = $8, sen_country = $9
            where invoice_ref = $1
        `,
            [id, billTo.streetAddress, billTo.city, billTo.postCode, billTo.country, billFrom.streetAddress, billFrom.city, billFrom.postCode, billFrom.country]
        );


    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error Updating Invoice")
    }


    revalidatePath('/dashboard');
    redirect('/dashboard',);

}

