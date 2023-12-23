import Header from "@/components/header";
import { auth } from "@/auth";


export default async function DashboardLayout(props) {
    const { user } = await auth() || {};

    return (
        <main className="overflow-scroll">
            <Header dp={user?.image} />
            {props.children}
            {props.modal}
        </main>
    )
}
