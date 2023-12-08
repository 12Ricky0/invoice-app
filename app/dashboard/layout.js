import Header from "@/components/header";


export default function DashboardLayout(props) {
    return (
        <main className="overflow-scroll">
            <Header />
            {props.children}
            {props.modal}
        </main>
    )
}
