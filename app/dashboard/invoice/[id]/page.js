import DetailInvoice from "@/components/invoice-details";
import { fetchDetails, fetchAddress, fetchItems } from "@/libs/data";
import { notFound } from "next/navigation";

export default async function Details({ params }) {
    const id = params.id

    const invoice = await fetchDetails(id);
    const address = await fetchAddress(invoice[0]?.invoice_ref);
    const items = await fetchItems(invoice && invoice[0].invoice_ref);

    if (invoice[0].invoice_ref === null) {
        notFound()
    }

    return <DetailInvoice
        address={address}
        items={items}
        invoice={invoice}
    />
}