import Image from "next/image";
import Login from "@/components/login";
export default function Home() {

  return (
    <main className="">
      <div className="w-[100%] h-[100%]">
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
      <Login />
    </main>
  )
}
