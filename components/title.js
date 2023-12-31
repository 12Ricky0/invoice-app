'use client'
import Image from "next/image";
import { useState } from "react";
import Checkbox from "./buttons/checkbox";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function FilterCard({ query }) {
    const status = ["Draft", "Pending", "Paid"]
    const [showFilter, setShowFilter] = useState(false)
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const { replace } = useRouter()
    const param = new URLSearchParams(searchParams)


    return (

        <div className="inline-flex justify-between items-center">
            <div className="cursor-pointer" onClick={() => { setShowFilter(!showFilter) }} >
                <span className="text-secondary-black font-bold text-[15px] dark:text-white mr-3 inline-block md:hidden">Filter</span>
                <span className="text-secondary-black font-bold text-[15px] dark:text-white mr-3 hidden md:inline-block">Filter by status</span>
            </div>
            {showFilter &&
                <ul className="absolute right-[25%] md:right-[21%] lg:right-[35.5%] h-[128px] w-[180px] md:w-[192px] mt-[180px] rounded-lg bg-white dark:bg-primary-dark-blue dark:text-white text-primary-very-dark-blue shadow-3xl dark:shadow-dark">
                    <div className=" m-[24px]">
                        {status.map((s, index) =>
                            <div key={index} className="flex items-center pb-[10px]">
                                <Checkbox onChange={() => {
                                    const params = new URLSearchParams(searchParams)
                                    if (s) {
                                        params.set('query', s);
                                    } else {
                                        params.delete('query');
                                    }
                                    replace(`${pathname}?${params.toString()}`);
                                }}
                                    checked={param.get('query') == s && true}
                                />
                                <li className="ml-[13px] font-bold text-[15px]">
                                    {s}
                                </li>
                            </div>
                        )}
                    </div>
                </ul>
            }
            <Image
                src={`/assets/icon-arrow-down.svg`}
                alt="arrow down"
                width={9}
                height={5}
                className={`inline-block w-auto cursor-pointer ${showFilter && 'rotate-180'}`}
            />

        </div>
    )
}

export default function Title({ total, mtotal }) {
    const router = useRouter()

    function handleClick() {
        router.push("/dashboard/create")
    }


    return (
        <section className="flex w-[87%] md:w-[90%] lg:w-[720px] mx-auto justify-between items-center mt-[32px] pb-[16px]">
            <div>
                <p className="text-[24px] font-bold text-secondary-black dark:text-white">Invoices</p>
                <p className="text-secondary-greyish-blue font-medium text-[13px] inline-block md:hidden dark:text-white">{total}</p>
                <p className="text-secondary-greyish-blue font-medium text-[13px] hidden md:inline-block dark:text-white">{mtotal}</p>
            </div>
            <div className="inline-flex justify-between items-center">
                <FilterCard query />

                <div onClick={handleClick} className="w-[90px] md:w-[150px] ml-[18.5px] md:ml-[40px] h-[44px] md:h-[48px] rounded-[24px] bg-primary-violet hover:bg-primary-light-violet flex justify-around items-center cursor-pointer">
                    <div className=" w-[32px] h-[32px] rounded-[17px] inline-flex items-center justify-center bg-white ">
                        <Image
                            src="/assets/icon-plus.svg"
                            alt="icon plus"
                            width={9}
                            height={5}
                            className="inline-block w-auto"
                        />
                    </div>
                    <p className=" font-bold text-[15px] text-white pr-3 inline-block md:hidden">New</p>
                    <p className=" font-bold text-[15px] text-white pr-3 hidden md:inline-block">New Invoice</p>

                </div>
            </div>


        </section>
    )
}