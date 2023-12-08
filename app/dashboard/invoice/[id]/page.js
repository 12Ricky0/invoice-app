import DetailInvoice from "@/components/invoice-details";
import { fetchDetails, fetchClientAddress, fetchSenderAddress, fetchItems } from "@/libs/data";
import { notFound } from "next/navigation";

export default async function Details({ params }) {
    const id = params.id

    const invoice = await fetchDetails(id);
    const clientAddress = await fetchClientAddress(invoice && invoice[0].invoice_ref);
    const senderAddress = await fetchSenderAddress(invoice && invoice[0].invoice_ref);
    const items = await fetchItems(invoice && invoice[0].invoice_ref);

    if (invoice[0].invoice_ref === null) {
        notFound()
    }

    return <DetailInvoice
        clientAddress={clientAddress}
        senderAddress={senderAddress}
        items={items}
        invoice={invoice}
    />
}