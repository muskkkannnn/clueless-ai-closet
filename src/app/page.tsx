import { UserButton } from "@clerk/nextjs";
import React from 'react';
import Link from 'next/link';

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <header className="absolute top-0 right-0 m-4">
        <UserButton />
      </header>
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-8">
          Clueless AI Closet
        </h1>

        <nav className="flex flex-col items-center justify-center">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link href="/upload" className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200">
                Upload New Item
              </Link>
            </li>
            <li>
              <Link href="/closet" className="px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200">
                My Digital Closet
              </Link>
            </li>
            <li>
              <Link href="/canvas" className="px-6 py-3 text-lg font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors duration-200">
                Outfit Canvas
              </Link>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  )
}

export default page
