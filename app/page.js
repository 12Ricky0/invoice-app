import Image from "next/image";
import Login from "@/components/login";
import { auth } from "@/auth";
import { seedUser } from "@/libs/actions";

export default async function Home() {
  const { user } = await auth() || {};
  user?.email && await seedUser()

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
            <h1 className="text-secondary-black mb-[23px] font-bold text-[24px] dark:text-white">{user ? 'Signed In as' : 'Not Signed In'}</h1>
            {user ?
              <span className=" text-center text-secondary-greyish-blue font-medium text-[13px] dark:text-white"> <b>{user?.email}</b> </span>
              :
              <span className=" text-center text-secondary-greyish-blue font-medium text-[13px] dark:text-white">Login by clicking <b>Sign in</b> button and get started </span>

            }
          </article>
        </div>
      </div>
      <Login user={user} />
    </main>
  )
}
