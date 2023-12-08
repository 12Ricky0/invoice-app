import { Suspense } from "react";
import Invoice from "@/components/invoice";
import Spinner from "@/components/spinner";
import Form from "@/components/forms/create-invoice";


export default function Page({ searchParams }) {
    const query = searchParams.query || ''
    console.log(query)
    return (
        <main className="overflow-scroll">
            <Suspense key={query} fallback={<Spinner />}>
                <Invoice query={query} />
                {/* <Form /> */}
            </Suspense>
        </main>
    )
}
