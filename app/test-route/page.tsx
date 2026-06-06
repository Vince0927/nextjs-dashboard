
"use client"

import Link from 'next/link'


import { usePathname } from 'next/navigation';
import clsx from 'clsx';


export default function Page(){
    const pathName = usePathname();

    return(
        <>
            <h1>Test this route from a folder with a page.tsx</h1>
            <Link href='/login' 
                  
            >
                <p>Go to sign in</p>
                <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">Login</button>
            </Link>
            
        </>
    )
}