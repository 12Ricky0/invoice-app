import Image from "next/image";
import Title from "./title";
import { fetchFilteredInvoice, fetchInvoice } from "@/libs/data";
import Link from "next/link";

export default async function Invoice({ query }) {
    let data;

    if (query) {
        data = await fetchFilteredInvoice(query)
    } else {
        data = await fetchInvoice()
    }


    function dueDate(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(date)
        let month = months[d.getMonth()]
        let day = d.getDate()
        let year = d.getFullYear()
        return `Due ${day} ${month} ${year}`
    }

    if (!data || data.length === 0) {
        return (
            <div className="">
                <Title total={`${data && data.length} ${data && data.length > 1 ? 'invoices' : 'invoice'}`} mtotal={`  ${data && data.length > 0 ? `There are ${data && data.length} total invoices` : 'No invoices'}`} />
                <div className="w-[240px] mt-[140px] mx-auto">
                    <Image
                        src="/assets/illustration-empty.svg"
                        alt="empty image"
                        height={200}
                        width={240}
                        className=""
                    />
                    <article className="mt-[42px] text-center">
                        <h1 className="text-secondary-black mb-[23px] font-bold text-[24px] dark:text-white">There is nothing here</h1>
                        <span className=" block md:hidden text-center text-secondary-greyish-blue font-medium text-[13px] dark:text-white">Create a new invoice by clicking <b>New</b> button and get started </span>
                        <span className=" hidden md:block text-center text-secondary-greyish-blue font-medium text-[13px] dark:text-white">Create a new invoice by clicking <b>New Invoice</b> button and get started </span>
                    </article>
                </div>
            </div>
        )
    }

    return (
        <div id="invoice" className="mb-[105px] lg:mb-0 z-1">
            <Title total={`${data && data.length} ${data && data.length > 1 ? 'invoices' : 'invoice'}`} mtotal={`  ${data && data.length > 0 ? `There are ${data.length} total invoices` : 'No invoices'}`} />
            {data && data.map(invoice =>
                <Link key={invoice.id} href={`dashboard/invoice/${invoice.id}`}>
                    <section className="hover:border cursor-pointer hover:border-primary-violet md:flex justify-between items-center mt-4 md:text-left rounded-lg h-[134px] md:h-[72px] w-[87%] lg:w-[50%] md:w-[90%] bg-white mx-auto dark:bg-primary-very-dark-blue">
                        <article className="mx-6 pt-[25px] block md:hidden">
                            <div className="flex justify-between mb-5 ">
                                <span className="text-secondary-greyish-blue font-medium">#<span className="text-secondary-black font-bold text-[15px] dark:text-white">{invoice.id.slice(1, 7).toUpperCase()}</span></span>
                                <p className="text-secondary-greyish-blue font-medium text-[13px] dark:text-white">{invoice.client_name}</p>
                            </div>
                            <div className="flex justify-between">
                                <span className="">
                                    <p className="text-secondary-greyish-blue font-medium text-left text-[13px] mb-[9px] dark:text-white">{dueDate(invoice.payment_due)}</p>
                                    <h3 className="text-secondary-black font-bold text-[15px] dark:text-white">{invoice.total}</h3>
                                </span>
                                <span className={`w-[104px] h-[40px] ml-[40px] ${invoice.status === 'Paid' && 'bg-tetiary-paid'} ${invoice.status === 'Pending' && 'bg-tetiary-pending'} ${invoice.status === 'Draft' && 'bg-primary-gray'} ${invoice.status === 'Draft' && 'bg-primary-gray'} ${invoice.status === 'Draft' && 'dark:bg-primary-gray'} bg-opacity-[0.06] rounded-md inline-flex justify-center items-center`}>
                                    <div className={`w-2 h-2 rounded-[5px] ${invoice.status === 'Paid' && 'bg-tetiary-paid'} ${invoice.status === 'Pending' && 'bg-tetiary-pending'} ${invoice.status === 'Draft' && 'bg-primary-gray'} ${invoice.status === 'Draft' && 'dark:bg-secondary-light-greyish-blue'}`} />
                                    <span className={`${invoice.status === 'Paid' && 'text-tetiary-paid'} ${invoice.status === 'Pending' && 'text-tetiary-pending'} ${invoice.status === 'Draft' && 'text-primary-gray'} ${invoice.status === 'Draft' && 'dark:text-secondary-light-greyish-blue'} text-[15px] font-bold ml-2`}>{invoice.status}</span>
                                </span>
                            </div>
                        </article>

                        <div className="flex gap-[43px]">
                            <div className="ml-6 hidden md:inline-block">
                                <span className="text-secondary-greyish-blue font-medium ">#</span>
                                <span className="text-secondary-black font-bold text-[15px] dark:text-white">{invoice.id.slice(1, 7).toUpperCase()}</span>
                            </div>
                            <div className="hidden md:inline-block text-left">
                                <p className="text-secondary-greyish-blue font-medium text-[13px] mb-[9px] md:m-0 dark:text-white">{dueDate(invoice.payment_due)}</p>
                            </div>
                            <div className="hidden md:inline-block text-left self-stretch whitespace-nowrap">
                                <p className="text-secondary-greyish-blue font-medium text-[13px]  dark:text-white">{invoice.client_name}</p>
                            </div>
                        </div>
                        <div className="hidden md:inline-flex items-center">
                            <h3 className="text-secondary-black font-bold text-[15px] dark:text-white md:text-right">{invoice.total}</h3>
                            <span className={`w-[104px] shrink-0 h-[40px] mr-5 ml-10 ${invoice.status === 'Paid' && 'bg-tetiary-paid'} ${invoice.status === 'Pending' && 'bg-tetiary-pending'} ${invoice.status === 'Draft' && 'bg-primary-gray'} ${invoice.status === 'Draft' && 'dark:bg-primary-gray'} bg-opacity-[0.06] rounded-md inline-flex justify-center items-center`}>
                                <div className={`w-2 h-2 rounded-[5px] ${invoice.status === 'Paid' && 'bg-tetiary-paid'} ${invoice.status === 'Pending' && 'bg-tetiary-pending'} ${invoice.status === 'Draft' && 'bg-primary-gray'} ${invoice.status === 'Draft' && 'dark:bg-secondary-light-greyish-blue'}`} />
                                <span className={`${invoice.status === 'Paid' && 'text-tetiary-paid'} ${invoice.status === 'Pending' && 'text-tetiary-pending'} ${invoice.status === 'Draft' && 'text-primary-gray'} ${invoice.status === 'Draft' && 'dark:text-secondary-light-greyish-blue'}  text-[15px] font-bold ml-2`}>{invoice.status}</span>
                            </span>
                            <Image
                                src="/assets/icon-arrow-right.svg"
                                alt="arrow right"
                                width={5}
                                height={10}
                                className="mr-6"
                            />
                        </div>
                    </section>
                </Link>
            )}
        </div>
    )
}