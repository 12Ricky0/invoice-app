'use client';
import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from 'react-dom';
import { deleteInvoice, updateInvoice } from "@/libs/actions";
import { useRouter } from "next/navigation";


export function DeleteButton({ id, action, refe }) {
    const [toDelete, setToDelete] = useState(false);

    return (
        <>
            <button onClick={() => setToDelete(true)} className="h-[48px] w-[89px] rounded-[24px] bg-tetiary-red hover:bg-tetiary-light-red cursor-pointer text-white font-bold text-[15px] mx-2" type="button">Delete</button>
            {toDelete &&
                <DeleteModal
                    onClick={(() => { setToDelete(false) })}
                    id={id}
                    action={action}
                    refe={refe}
                />}

        </>
    )
}

export function SubmitButton({ onClick, value }) {
    const { pending, action } = useFormStatus()
    const router = useRouter()
    return (
        <div>
            <button onClick={onClick} aria-disabled={pending} value={value} disabled={pending} type="submit" className="h-[48px] hidden md:inline-block w-[112px] rounded-[24px] md:ml-2 bg-primary-violet hover:bg-primary-light-violet cursor-pointer text-white font-bold text-[15px]" >{pending ? "Sending..." : "Save & Send"}</button>
            {/* <button aria-disabled={pending} onClick={() => console.log(formData.get('paymentTerm'))} className="h-[48px] block md:hidden w-[112px] mr-6 rounded-[24px] bg-primary-violet hover:bg-primary-light-violet cursor-pointer text-white font-bold text-[15px]" type="submit">{pending ? "Sending..." : "Save & Send"}</button> */}
        </div>
    )
}

export function SaveButton() {
    const { pending } = useFormStatus()
    const router = useRouter()

    return <button onClick={() => router.back()} className="h-[48px] w-[117px] rounded-[24px] bg-primary-violet dark:text-white hover:bg-secondary-black cursor-pointer text-white font-bold dark:hover:bg-primary-very-dark-blue text-[15px]" type="submit">{pending ? "Saving..." : "Save Changes"}</button>

}

export function MobileSubmit({ onClick }) {
    const { pending } = useFormStatus()
    const router = useRouter()


    return (
        <div>
            <button onClick={onClick} aria-disabled={pending} className="h-[48px] block md:hidden w-[112px] mr-6 rounded-[24px] bg-primary-violet hover:bg-primary-light-violet cursor-pointer text-white font-bold text-[15px]" type="submit">{pending ? "Sending..." : "Save & Send"}</button>
        </div>
    )
}

export function EditButton({ id }) {
    return (
        <div className="h-[48px] w-[73px] rounded-[24px] cursor-pointer font-bold text-[15px] inline-flex justify-center items-center bg-tetiary-light-gray dark:hover:bg-white hover:bg-secondary-light-greyish-blue text-secondary-light-blue dark:bg-primary-dark-blue" >
            <Link href={`/dashboard/edit/${id}`} >Edit</Link>
        </div>
    )

}

export function MarkButton({ refe, id }) {
    async function handleUpdate() {
        await updateInvoice(refe, id)
    }

    return <button onClick={handleUpdate} className="h-[48px] w-[149px] rounded-[24px] bg-primary-violet hover:bg-primary-light-violet cursor-pointer text-white font-bold text-[15px]" type="button">Mark as Paid</button>

}

export function Overlay({ children }) {
    return <div className="overlay">{children}</div>
}

function DeleteModal({ onClick, id, refe }) {
    // const delete_invoice = 
    async function handleDelete() {
        await deleteInvoice(refe)
        // console.log(refe)
    }
    return (
        <section className="absolute">
            <Overlay />
            <div className="w-[87%] md:w-[480px] bg-white h-[220px] dark:bg-primary-dark-blue rounded-lg z-50 modal">
                <article className="mx-[32px] md:mx-[48px] pt-[30px]">
                    <h1 className="text-secondary-black dark:text-white font-bold text-[24px]">Confirm Deletion</h1>
                    <p className=" font-[13px] text-secondary-greyish-blue ">Are you sure you want to delete invoice
                        <span>#{id}!?</span>
                        This action cannot be undone.
                    </p>
                </article>
                <div className="mx-[32px] md:mx-[48px] flex justify-end mt-[22px] ">
                    <button onClick={onClick} className="h-[48px] w-[89px] rounded-[24px] cursor-pointer font-bold text-[15px] bg-tetiary-light-gray text-secondary-light-blue mr-2" type="button">Cancel</button>
                    <button onClick={handleDelete} type="submit" className="h-[48px] w-[89px] rounded-[24px] bg-tetiary-red hover:bg-tetiary-light-red cursor-pointer text-white font-bold text-[15px]" >Delete</button>
                </div>
            </div>
        </section>
    )
}

export function Buttons({ id, refe, ide }) {


    return (
        <div className="block md:hidden">
            <section className="bg-white h-[91px] dark:bg-primary-very-dark-blue flex justify-center items-center ">
                <div className="mx-6 inline-flex justify-center">
                    <EditButton id={ide} />
                    <DeleteButton refe={refe} id={id} />
                    <MarkButton id={id} refe={refe} />
                </div>
            </section>
        </div>
    )
}
