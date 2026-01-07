'use client';

import React from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clueless AI Closet</h1>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href="/sign-in" className="text-white hover:text-gray-300">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
