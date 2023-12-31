import Form from "@/components/forms/create-invoice";
import { auth } from "@/auth";


export default async function Create() {
    const { user } = await auth()
    const user_id = user?.email
    return <Form user_id={user_id} />
}