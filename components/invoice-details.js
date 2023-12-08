import { Buttons, DeleteButton, MarkButton, EditButton } from "./buttons/buttons";
import { fetchDetails, fetchClientAddress, fetchSenderAddress, fetchItems } from "@/libs/data";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";


export default async function DetailInvoice({ invoice, clientAddress, senderAddress, items }) {

    // const invoice = await fetchDetails(id);
    // const clientAddress = await fetchClientAddress(invoice[0].invoice_ref);
    // const senderAddress = await fetchSenderAddress(invoice[0].invoice_ref);
    // const items = await fetchItems(invoice[0].invoice_ref);

    function dueDate(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(date)
        let month = months[d.getMonth()]
        let day = d.getDate()
        let year = d.getFullYear()
        return `${day} ${month} ${year}`
    }

    return (
        <div>
            <Link href="/dashboard">
                <div className="w-[87%] mt-[65px] lg:w-[50%] block mx-auto">
                    <Image
                        src="/assets/icon-arrow-left.svg"
                        alt="arrow right"
                        width={5}
                        height={10}
                        className="inline-block mr-6 w-auto h-auto"
                    />

                    <span className="text-secondary-greyish-blue mb-[31px] font-medium text-center text-[13px] dark:text-white">Go back</span>

                </div>
            </Link>
            <section className="mb-[56px]">


                {/* Desktop Design */}
                <div className="md:flex h-[91px] w-[87%] lg:w-[50%] bg-white dark:bg-primary-very-dark-blue rounded-lg hidden justify-between items-center mx-auto mb-4 mt-[31px]">

                    <div className="inline-flex items-center">
                        <p className="text-secondary-greyish-blue ml-6 font-medium text-[13px] dark:text-white">Status</p>

                        <span className={`w-[104px] h-[40px] ml-[40px] ${invoice && invoice[0].status === 'Paid' && 'bg-tetiary-paid'} ${invoice && invoice[0].status === 'Pending' && 'bg-tetiary-pending'} ${invoice && invoice[0].status === 'Draft' && 'bg-primary-gray'} ${invoice && invoice[0].status === 'Draft' && 'bg-primary-gray'} ${invoice && invoice[0].status === 'draft' && 'dark:bg-primary-gray'} bg-opacity-[0.06] rounded-md inline-flex justify-center items-center`}>
                            <div className={`w-2 h-2 rounded-[5px] ${invoice && invoice[0].status === 'Paid' && 'bg-tetiary-paid'} ${invoice && invoice[0].status === 'Pending' && 'bg-tetiary-pending'} ${invoice && invoice[0].status === 'Draft' && 'bg-primary-gray'} ${invoice && invoice[0].status === 'Draft' && 'dark:bg-secondary-light-greyish-blue'}`} />
                            <span className={`${invoice && invoice[0].status === 'Paid' && 'text-tetiary-paid'} ${invoice && invoice[0].status === 'Pending' && 'text-tetiary-pending'} ${invoice && invoice[0].status === 'Draft' && 'text-primary-gray'} ${invoice && invoice[0].status === 'Draft' && 'dark:text-secondary-light-greyish-blue'} text-[15px] font-bold ml-2`}>{invoice && invoice[0].status}</span>
                        </span>

                    </div>
                    <div className="mr-6 flex">
                        <EditButton id={invoice && invoice[0].id} />
                        <DeleteButton refe={invoice && invoice[0].invoice_ref} id={invoice && invoice[0].id.slice(1, 7).toUpperCase()} />
                        <MarkButton id={invoice && invoice[0].id} refe={invoice && invoice[0].invoice_ref} />
                    </div>
                </div>
                {/* Desktop Design */}

                {/* Mobile Design */}
                <div className="md:hidden h-[91px] w-[87%] md:w-[50%] bg-white dark:bg-primary-very-dark-blue rounded-lg flex justify-between items-center mx-auto mb-4 mt-[31px]">
                    <p className="text-secondary-greyish-blue ml-6 font-medium text-[13px] dark:text-white">Status</p>

                    <span className={`w-[104px] h-[40px] mr-6 ${invoice && invoice[0].status === 'Paid' && 'bg-tetiary-paid'} ${invoice && invoice[0].status === 'Pending' && 'bg-tetiary-pending'} ${invoice && invoice[0].status === 'Draft' && 'bg-primary-gray'} ${invoice && invoice[0].status === 'Draft' && 'bg-primary-gray'} ${invoice && invoice[0].status === 'draft' && 'dark:bg-primary-gray'} bg-opacity-[0.06] rounded-md inline-flex justify-center items-center`}>
                        <div className={`w-2 h-2 rounded-[5px] ${invoice && invoice[0].status === 'Paid' && 'bg-tetiary-paid'} ${invoice && invoice[0].status === 'Pending' && 'bg-tetiary-pending'} ${invoice && invoice[0].status === 'Draft' && 'bg-primary-gray'} ${invoice && invoice[0].status === 'Draft' && 'dark:bg-secondary-light-greyish-blue'}`} />
                        <span className={`${invoice && invoice[0].status === 'Paid' && 'text-tetiary-paid'} ${invoice && invoice[0].status === 'Pending' && 'text-tetiary-pending'} ${invoice && invoice[0].status === 'Draft' && 'text-primary-gray'} ${invoice && invoice[0].status === 'Draft' && 'dark:text-secondary-light-greyish-blue'} text-[15px] font-bold ml-2`}>{invoice && invoice[0].status}</span>
                    </span>

                </div>
                {/* Mobile Design */}

                <div className="w-[87%] lg:w-[50%] bg-white dark:bg-primary-very-dark-blue mx-auto rounded-lg pb-6">
                    <div className="mx-6 md:mx-[48px] pt-6 md:flex justify-between">
                        <article >
                            <span className="text-secondary-greyish-blue font-medium">#</span>

                            <span className="text-secondary-black font-bold text-[15px] dark:text-white">{invoice && invoice[0].id.slice(1, 7).toUpperCase()}</span>
                            <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{invoice && invoice[0].description}</p>
                        </article>
                        <article className="mt-[30px] md:mt-0 md:text-right">
                            <Suspense fallback="Loading...">
                                <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{senderAddress[0] && senderAddress[0].street}</p>
                                <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{senderAddress[0] && senderAddress[0].city}</p>
                                <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{senderAddress[0] && senderAddress[0].post_code}</p>
                                <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{senderAddress[0] && senderAddress[0].country}</p>
                            </Suspense>
                        </article>
                    </div>

                    <div className="md:grid grid-flow-col md:pb-[47px]">
                        <div className="mt-[30px] flex mx-6 md:mx-[48px] justify-between">
                            <article>
                                <article>
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">Invoice Date</p>
                                    <h3 className="text-secondary-black font-bold text-[15px] dark:text-white my-[13px]">{dueDate(invoice && invoice[0].created_at)}</h3>
                                </article>
                                <article >
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white py-[13px] ">Payment Due</p>
                                    <h3 className="text-secondary-black font-bold text-[15px] dark:text-white">{dueDate(invoice && invoice[0].payment_due)}</h3>
                                </article>
                            </article>

                            <article className="mr-10 md:mr-0">
                                <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">Bill To</p>
                                <Suspense fallback="Loading...">
                                    <h3 className="text-secondary-black font-bold text-[15px] dark:text-white my-[13px]">{invoice && invoice[0].client_name}</h3>
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{clientAddress && clientAddress[0].street}</p>
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{clientAddress && clientAddress[0].city}</p>
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{clientAddress && clientAddress[0].post_code}</p>
                                    <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{clientAddress && clientAddress[0].country}</p>
                                </Suspense>
                            </article>
                        </div>

                        <div className="mx-6 md:mx-7 my-[32px]">
                            <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">Sent To</p>
                            <h3 className="text-secondary-black font-bold text-[15px] dark:text-white my-[13px]">{invoice && invoice[0].client_email}</h3>

                        </div>
                    </div>

                    {/* Mobile Design */}
                    <div className="block md:hidden mx-6 rounded-lg bg-tetiary-light-gray dark:bg-primary-dark-blue">
                        {items && items.map((item, index) =>
                            <div className="flex items-center justify-between mx-6 pt-6" key={index}>
                                <article >
                                    <h3 className="text-secondary-black font-bold text-[15px] dark:text-white">{item.name}</h3>
                                    <p className="text-secondary-greyish-blue font-bold text-[15px] dark:text-white">{item.quantity} x {item.price}</p>
                                </article>
                                <span className="text-secondary-black font-bold text-[15px] dark:text-white">{item.total}</span>
                            </div>
                        )}
                        <article className="rounded-b-lg bg-primary-dark-blue dark:bg-secondary-black h-[80px] flex justify-between items-center mt-[23px]">
                            <p className="text-white font-medium text-[13px] ml-[24px]">Grand Total</p>
                            <p className="text-white font-bold text-[24px] mr-[24px]">{items[0].sub_total}</p>
                        </article>
                    </div>
                    {/* Mobile Design */}

                    {/* Desktop Design */}

                    <div className="mx-[48px] rounded-lg bg-tetiary-light-gray dark:bg-primary-dark-blue hidden md:block">
                        <section className="pt-[32px]">
                            <table className="w-[100%] border-separate">
                                <thead className="">
                                    <tr className="text-secondary-greyish-blue font-medium text-[13px] py-[32px] dark:text-white">
                                        <th className="text-left  pb-[32px] pl-[32px]">Item Name</th>
                                        <th className="text-center pb-[32px]">QTY.</th>
                                        <th className=" pb-[32px] text-right">Price</th>
                                        <th className="text-right pb-[32px] pr-[32px]">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items && items.map((item, index) =>

                                        <tr key={index} className="">
                                            <td className="text-secondary-black font-bold text-[15px] text-left dark:text-white pl-[32px]">{item.name}</td>
                                            <td className="text-center font-bold text-[15px] text-secondary-greyish-blue dark:text-white">{item.quantity}</td>
                                            <td className="text-right font-bold text-[15px] text-secondary-greyish-blue dark:text-white">{item.price}</td>
                                            <td className="text-secondary-black text-right pr-[32px] font-bold text-[15px]  dark:text-white">{item.total}</td>

                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </section>

                        <article className="rounded-b-lg bg-primary-dark-blue dark:bg-secondary-black h-[80px] flex justify-between items-center mt-[32px]">
                            <p className="text-white font-medium text-[13px] ml-[32px]">Amount Due</p>
                            <p className="text-white font-bold text-[24px] mr-[32px]">{items[0].sub_total}</p>
                        </article>
                    </div>

                    {/* Desktop Design */}
                </div>
            </section>
            <Buttons ide={invoice && invoice[0].id} refe={invoice && invoice[0].invoice_ref} id={invoice && invoice[0].id.slice(1, 7).toUpperCase()} />
        </div>
    )
}