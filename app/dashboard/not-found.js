import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex md:mt-[15%] mt-[50%] h-full flex-col items-center justify-center gap-2">
            🥹
            <h2 className="text-xl dark:text-white font-semibold">404 Not Found</h2>
            <p className="dark:text-white">Could not find the requested invoice.</p>
            <Link
                href="/dashboard"
                className="mt-4 rounded-md bg-primary-violet px-4 py-2 text-sm text-white transition-colors hover:bg-primary-light-violet"
            >
                Go Back
            </Link>
        </main>
    );
}