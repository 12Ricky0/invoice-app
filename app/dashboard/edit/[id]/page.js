import EditInvoiceForm from "@/components/forms/edit-invoice";
import { fetchAddress, fetchDetails, itemsToEdit } from "@/libs/data";
import { notFound } from "next/navigation";


export default async function Edit({ params }) {

    const id = params.id
    const invoice = await fetchDetails(id);
    const address = await fetchAddress(invoice && invoice[0].invoice_ref);
    // const billFrom = await fetchSenderAddress(invoice && invoice[0].invoice_ref);
    const items = await itemsToEdit(invoice && invoice[0].invoice_ref);

    if (!invoice) {
        notFound();
    }
    return (
        <EditInvoiceForm
            address={address}
            invoice={invoice}
            items={items}
        />
    )

}