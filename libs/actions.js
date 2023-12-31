'use server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import validator from "validator";
import { insertDefaultInvoice } from "./defaultInvoice";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";


export async function seedUser() {
    const { user } = await auth() || {};

    try {
        const emailExists = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;
        console.log(emailExists.rows)

        if (emailExists.rows.length > 0) {
            console.log("Email already exists");
        } else {
            const newUser = await sql`
            INSERT INTO users(name, email)
            VALUES(${user?.name}, ${user?.email})
            RETURNING user_id
        `;
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
        return ({
            cln: 'can`t be empty',
        }
        )
    }

    if (items.itemName.length === 0) {
        return ({
            errors: '- An item must be added',
            message: "- All fields must be added"
        }
        )
    }

    for (let i = 0; i < items.itemName.length; i++) {
        const itemName = items.itemName[i];
        const quantity = items.quantity[i];
        const price = items.price[i];
        const total = items.total[i];
        if (validator.isEmpty(itemName + '') || validator.isEmpty(quantity + '') || validator.isEmpty(price + '')) {
            return ({
                message: "- All fields must be added"
            }
            )
        }

        if (quantity < 1 || price < 1) {
            return ({
                errors: '- Invalid quantity/price',
                message: "- Enter a valid quantity/price"
            }
            )
        }
    }

    try {

        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        const data = await sql`
            INSERT INTO invoice (user_id, created_at, payment_due, description, payment_terms, client_name, client_email, status)
            VALUES (${userId.rows[0].user_id}, ${invoice.date}, ${payment_due}, ${invoice.description}, ${invoice.paymentTerm}, ${invoice.clientName}, ${invoice.clientEmail}, ${status})
            RETURNING invoice_ref;
        `;

        const invoice_ref = data.rows[0].invoice_ref

        for (let i = 0; i < items.itemName.length; i++) {
            const itemName = items.itemName[i];
            const quantity = items.quantity[i];
            const price = items.price[i];
            const total = items.total[i];

            await sql`
                INSERT INTO items(user_id, invoice_ref, name, quantity, price, total)
                VALUES(${userId.rows[0].user_id}, ${invoice_ref}, ${itemName}, ${quantity}, ${price}, ${total})
                RETURNING id
        `;

        }


        await sql`
            INSERT INTO address(user_id, invoice_ref, sen_street, sen_city, sen_post_code, sen_country, cli_street, cli_city, cli_post_code, cli_country)
            VALUES(${userId.rows[0].user_id}, ${invoice_ref}, ${billFrom.streetAddress}, ${billFrom.city}, ${billFrom.postCode}, 
                ${billFrom.country}, ${billTo.streetAddress}, ${billTo.city}, ${billTo.postCode}, ${billTo.country});
        `;


    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error Creating Invoice")
    }

    revalidatePath('/dashboard'),
        redirect('/dashboard')

}



export async function deleteInvoice(ref) {
    const { user } = await auth() || {};


    try {
        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        await sql`
        DELETE FROM invoice
        WHERE user_id =${userId.rows[0].user_id} AND invoice_ref = ${ref}
        `;
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

        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;

        await sql`
        UPDATE invoice
        SET status = 'Paid'
        where user_id=${userId.rows[0].user_id} AND invoice_ref = ${ref}
        `;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error updating invoice")

    }
    revalidatePath(`/dashboard/${id}`);

}

export async function updateEditedInvoice(id, prevState, formData, pathId) {
    const { user } = await auth() || {};
    console.log(pathId)
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
        itmId: formData.getAll('itmId'),
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

        await sql`
            UPDATE invoice 
            SET created_at = ${invoice.date}, payment_due = ${payment_due}, description = ${invoice.description}, payment_terms = ${invoice.paymentTerm}, client_name = ${invoice.clientName}, client_email = ${invoice.clientEmail}
            WHERE invoice_ref = ${id}
        `;

        const itemId = await sql`
        SELECT * FROM items 
        WHERE invoice_ref = ${id}
        `;

        const userId = await sql`
        SELECT user_id
        FROM users
        WHERE email = ${user?.email}
    `;


        for (let i = 0; i < items.itemName.length; i++) {
            const itemName = items.itemName[i];
            const quantity = items.quantity[i];
            const price = items.price[i];
            const total = items.total[i];
            const itmId = items.itmId[i];
            const item_id = itemId.rows[i]?.id
            const existingItem = itemId.rows.find(item => item.id == itmId);
            if (existingItem) {
                await sql`
                    UPDATE items
                    SET name = ${itemName}, quantity = ${quantity}, price = ${price}, total = ${total}
                    where id = ${item_id} AND invoice_ref = ${id}
            ;`;

            }
            else {
                await sql`
                        INSERT INTO items (invoice_ref, user_id, name, quantity, price, total)
                        VALUES (${id}, ${userId.rows[0].user_id}, ${itemName}, ${quantity}, ${price}, ${total})
                    `;
            }
        }

        await sql`
            UPDATE address
            SET cli_street = ${billTo.streetAddress}, cli_city = ${billTo.city}, cli_post_code = ${billTo.postCode}, cli_country = ${billTo.country}, 
            sen_street = ${billFrom.streetAddress}, sen_city = ${billFrom.city}, sen_post_code = ${billFrom.postCode}, sen_country = ${billFrom.country}
            where invoice_ref = ${id}
        `;


    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error Updating Invoice")
    }


    revalidatePath(`/dashboard/edit/${pathId}`);
    redirect('/dashboard',);

}

async function itemCount(ref) {
    noStore();

    try {
        const count = await sql`
        SELECT COUNT(*) FROM items 
        WHERE invoice_ref =${ref} 
        `
        return count.rows
    } catch (error) {
        console.error('Error counting item', error)

    }
}



export async function deleteItem(id, ref, pathId) {
    const count = await itemCount(ref)
    noStore();

    try {
        if (count[0].count <= 1) {
            return count

        } else {
            await sql`
        DELETE FROM items
        where id = ${id} 
        `;
        }
    } catch (error) {
        console.error('Error deleting item', error)
        throw new Error("Error deleting item")

    }

    revalidatePath(`/dashboard/edit/${pathId}`);
    revalidatePath(`/dashboard`);
    return count

}

