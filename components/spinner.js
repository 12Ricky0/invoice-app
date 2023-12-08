
export default function Spinner({ text }) {
    return (
        <div className="flex justify-center items-center w-[100%] h-[100%] fixed z-[5000]">
            <div className="w-[40px] h-[40px] animate-spin border-[4px] rounded-[50%] border-primary-light-violet border-t-4 border-t-primary-violet"></div>
            <p className="font-bold text-[15px] animate-pulse ml-3 text-secondary-greyish-blue dark:text-white">Loading...</p>
        </div>
    )
}
