'use client';
import { useState, useContext, useEffect } from "react";
import { useFormState } from 'react-dom';
import Image from "next/image";
import { Overlay, SaveButton } from "../buttons/buttons";
import CustomSelect from "./select-form";
import { useRouter, usePathname, redirect } from "next/navigation";
import { updateEditedInvoice, invoiceUpdate } from "@/libs/actions";
import Link from "next/link";


function ItemsForm({ onDelete, index, t, q, p, n }) {

    const [qty, setQty] = useState(q)
    const [price, setPrice] = useState(p)
    const [name, setName] = useState(n)
    let total = Number(qty) * Number(price)

    const handleDelete = () => {
        onDelete(index);
    };

    return (
        <div className="md:flex">

            <div className="md:mr-6">
                <label className="text-secondary-greyish-blue font-medium text-[13px] " htmlFor="itmName" >Item Name</label><br />
                <input onChange={(e) => { setName(e.target.value) }} value={name} className={`${name ? 'border-secondary-light-greyish-blue' : 'border-tetiary-red'} pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] md:w-[214px] mt-[9px] mb-[25px] border rounded-[4px]  dark:text-white dark:bg-primary-dark-blue`} type="text" name="itmName" />
            </div>
            <div className="inline-flex items-center justify-between">
                <div className="mr-6">
                    <label className="text-secondary-greyish-blue font-medium text-[13px] " htmlFor="qty" >Qty.</label><br />
                    <input onChange={(e) => { setQty(e.target.value) }} value={qty} placeholder="0" className={` ${qty < 1 && "border-tetiary-red outline-tetiary-red"} pl-5 font-bold text-[15px] text-secondary-black dark:text-white h-[48px] w-[64px] mt-[9px] mb-[25px] border rounded-[4px] dark:bg-primary-dark-blue border-secondary-light-greyish-blue`} type="number" name="qty" />
                </div>
                <div className="mr-6">
                    <label className="text-secondary-greyish-blue font-medium text-[13px] " htmlFor="itmName" >Price</label><br />
                    <input onChange={(e) => { setPrice(e.target.value) }} value={price} className={`${price < 1 && "border-tetiary-red outline-tetiary-red"} pl-5 font-bold text-[15px] text-secondary-black dark:text-white h-[48px] w-[100px] mt-[9px] mb-[25px] border rounded-[4px] dark:bg-primary-dark-blue border-secondary-light-greyish-blue"`} type="number" placeholder="0.00" name="price" />
                </div>
                <div>
                    <span className="text-secondary-greyish-blue font-medium text-[13px] ">Total</span><br />
                    <input className=" h-[48px] w-[100px] mt-[9px] mb-[25px] dark:bg-tetiary-dark-russian text-secondary-greyish-blue font-bold text-[15px] outline-none caret-white" name="total" value={total || t} readOnly />
                </div>
                <svg
                    className="hover:fill-tetiary-red fill-secondary-greyish-blue cursor-pointer"
                    width="13"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleDelete}
                >
                    <path
                        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                    />

                </svg>
            </div>
        </div>
    )
}


export default function EditInvoiceForm({ invoice, address, items }) {

    const createdDate = new Date(invoice[0].created_at);
    const formattedDate = createdDate.toISOString().split('T')[0];

    // function handleEdit(formData) {
    //     updateEditedInvoice(invoice[0].invoice_ref)
    // }

    const handleEdit = updateEditedInvoice.bind(null, invoice[0].invoice_ref)

    const [itemForm, setItemForm] = useState([])
    const router = useRouter()
    const pathname = usePathname()
    const [selectedTerm, setSelectedTerm] = useState(30)
    const initialState = { message: null, errors: [], cln: null };
    const [state, dispatch] = useFormState(handleEdit, initialState)
    function handleAddForm() {
        setItemForm([...itemForm, <ItemsForm key={itemForm.length} index={itemForm.length} onDelete={handleDelete} />])
    }
    function handleDelete(key) {
        setItemForm(prev => {
            return prev.filter((item, index) => {
                return key !== index
            })

        })
    }

    useEffect(() => {
        if (pathname === "/dashboard/create") {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        const newItem = items && items.map((item, index) =>
            <ItemsForm
                key={index}
                index={index}
                onDelete={handleDelete}
                n={item.name}
                p={item.price}
                q={item.quantity}
                t={item.total}
            />)
        newItem && setItemForm(newItem)
        return () => {
            document.body.classList.remove('modal-open');
        };

    }, [items, pathname]);


    const handleChange = (term) => {
        term === "Net 1 Day" && setSelectedTerm(1);
        term === "Net 7 Days" && setSelectedTerm(7);
        term === "Net 14 Days" && setSelectedTerm(17);
        term === "Net 30 Days" && setSelectedTerm(30);
    };


    return (
        <div className="">
            <Overlay>
                <form action={dispatch} className="caret-primary-violet">

                    <div className="lg:w-[700px] md:w-[670px] md:ml-0 lg:ml-[80px] absolute bg-white overflow-y-auto dark:bg-tetiary-dark-russian md:rounded-r-[20px]">
                        <section className="mx-6 md:mx-[56px] lg:mr-[56px] lg:ml-[70px]">
                            <Link href="/dashboard" className="block md:hidden">
                                <div className="w-[87%] mt-[100px] lg:w-[50%] block">
                                    <Image
                                        src="/assets/icon-arrow-left.svg"
                                        alt="arrow right"
                                        width={5}
                                        height={10}
                                        className="inline-block mr-6 w-auto h-auto"
                                    />

                                    <span className="text-secondary-black mb-[31px] font-bold text-center text-[15px] dark:text-white">Go back</span>

                                </div>
                            </Link>

                            <h1 className="font-bold text-[24px] md:pt-[59px] pt-[26px] pb-[22px] md:pb-[46px] text-secondary-black dark:text-white">Edit #{invoice[0].id.slice(1, 7).toUpperCase()}</h1>

                            <fieldset>
                                <legend className="font-bold text-[15px] mb-6 text-primary-violet">Bill From</legend>

                                <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="strAdr" >Street Address</label><br />
                                <input defaultValue={address[0].sen_street} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="strAdr" />

                                <div className="flex justify-between mb-[25px]">
                                    <div className="mr-[23px] md:mr-6">
                                        <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="city" >City</label><br />
                                        <input defaultValue={address[0].sen_city} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] border mt-[9px] rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="city" />
                                    </div>
                                    <div className="md:mr-6">
                                        <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="postCode" >Post Code</label><br />
                                        <input defaultValue={address[0].sen_post_code} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] border mt-[9px] rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="post-code" />
                                    </div>
                                    <div className="hidden md:inline-block">
                                        <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="country" >Country</label><br />
                                        <input defaultValue={address[0].sen_country} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="country" />
                                    </div>
                                </div>
                                <div className="block md:hidden">
                                    <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="country" >Country</label><br />
                                    <input defaultValue={address[0].sen_country} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="country" />
                                </div>
                            </fieldset>

                            <fieldset className="">
                                <legend className="font-bold mb-6 text-[15px] text-primary-violet">Bill To</legend>
                                <div className="flex justify-between">
                                    <label className={`${state.cln == null ? 'text-secondary-greyish-blue' : 'text-tetiary-red'} text-secondary-greyish-blue font-medium text-[13px]`} htmlFor="cName">Client`s Name</label>
                                    <p aria-live="polite" className="text-tetiary-red text-[10px] font-semibold">
                                        {state && state.cln}
                                    </p>
                                </div>
                                <input defaultValue={invoice[0].client_name} className={`pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white  ${state.cln == null ? 'border-secondary-light-greyish-blue' : 'border-tetiary-red'}`} type="text" name="cName" />

                                <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="cEmail" >Client`s Email</label><br />
                                <input defaultValue={invoice[0].client_email} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="email" name="cEmail" placeholder="e.g. email@example.com" />

                                <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="cEmail" >Street Address</label><br />
                                <input defaultValue={address[0].cli_street} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="cAddress" />

                                <div className="flex justify-between mb-[25px]">
                                    <div className="mr-[23px] md:mr-6">
                                        <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="city" >City</label><br />
                                        <input defaultValue={address[0].cli_city} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] border mt-[9px] rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="cCity" />
                                    </div>
                                    <div className="md:mr-6">
                                        <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="postCode" >Post Code</label><br />
                                        <input defaultValue={address[0].cli_post_code} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] border mt-[9px] rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="cPost-code" />
                                    </div>
                                    <div className="hidden md:inline-block">
                                        <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="country" >Country</label><br />
                                        <input defaultValue={address[0].cli_country} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="cCountry" />
                                    </div>

                                </div>

                                <div className="block md:hidden">
                                    <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="country" >Country</label><br />
                                    <input defaultValue={address[0].cli_country} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" type="text" name="country" />
                                </div>
                                <div className="md:flex justify-between">
                                    <div className="md:mr-6">
                                        <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="date" >Invoice Date</label><br />
                                        <input defaultValue={formattedDate} className={`pl-5 font-bold text-[15px] text-secondary-black h-[48px] px-4 w-[100%] md:w-[240px]  mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue`} type="date" name="date" />
                                    </div>
                                    <div className="">
                                        <label className="text-secondary-greyish-blue dark:text-white font-medium text-[13px]" htmlFor="dueDate">Payment Terms</label><br />
                                        <input name="paymentTerm" defaultValue={selectedTerm} className="w-0 h-0 opacity-0" type="hidden" />
                                        <CustomSelect term={invoice[0].payment_terms} onChange={handleChange} />
                                    </div>
                                </div>
                                <label className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="pjDesc" >Project Description</label><br />
                                <input defaultValue={invoice[0].description} className="pl-5 font-bold text-[15px] text-secondary-black h-[48px] w-[100%] mt-[9px] mb-[25px] border rounded-[4px] dark:border-none dark:bg-primary-dark-blue dark:text-white border-secondary-light-greyish-blue" placeholder="e.g. Graphic Design Service" type="text" name="pjDesc" />

                                <legend className="font-bold mb-6 text-[15px] text-secondary-greyish-blue">Item List</legend>
                                {/* <div className="hidden md:flex justify-between mb-[15px] mx-6">
                                    <p className="text-secondary-greyish-blue font-medium text-[13px]" htmlFor="itmName" >Item Name</p>
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] ml-[130px]" htmlFor="qty" >Qty.</p>
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] mr-[40px] " htmlFor="itmName" >Price</p>
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] mr-[115px]">Total</p>

                                </div> */}
                                {
                                    itemForm
                                }
                            </fieldset>
                            <button onClick={handleAddForm} className="text-secondary-greyish-blue font-bold text-[15px] border-none block w-[100%] bg-tetiary-light-gray py-4 rounded-[24px] dark:bg-primary-dark-blue" type="button">+ Add New Item</button>
                            <p aria-live="polite" className="text-tetiary-red text-[10px] font-semibold mt-[34px]">
                                {state && state.errors}
                            </p>
                            <p aria-live="polite" className="text-tetiary-red text-[10px] font-semibold">
                                {state && state.message}
                            </p>

                        </section>
                        <section className="mt-[41px] md:mx-[56px] flex justify-end rounded-br-[20px] items-center h-[91px] mx-6">
                            {/* <input className="h-[48px] block md:hidden w-[117px] rounded-[24px] bg-primary-gray dark:text-white hover:bg-secondary-black cursor-pointer text-secondary-greyish-blue font-bold dark:hover:bg-primary-very-dark-blue text-[15px]" value="Save as Draft" name="saveDraft" type="submit" /> */}
                            <div className="">
                                <button onClick={() => router.back()} className="h-[48px] w-[84px] mr-2 rounded-[24px] cursor-pointer font-bold text-[15px] inline-flex justify-center items-center bg-tetiary-light-gray dark:hover:bg-white hover:bg-secondary-light-greyish-blue text-secondary-light-blue dark:bg-white" type="button">Cancel</button>
                                <SaveButton />
                            </div>
                        </section>
                    </div>
                </form>

            </Overlay>
        </div>
    )
}