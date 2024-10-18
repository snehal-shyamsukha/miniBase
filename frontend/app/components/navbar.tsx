"use client";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { formatAddress } from "@/utils/utils";
import { useEffect } from "react";
import { createUser } from "../_actions/user";
import toast, { Toaster } from 'react-hot-toast';
import { useSearch } from '../contexts/SearchContext';

const menuItems = [
  { label: "Home", link: "/" },
  { label: "Tournaments", link: "/tournaments" },
];

export default function Navbar() {
  const { login, user, ready, authenticated } = usePrivy();
  const { searchTerm, setSearchTerm } = useSearch();


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      const addUserToDb = async () => {
        try {
            const userAddress = user?.wallet?.address || user.farcaster?.ownerAddress
            await createUser(userAddress ?? '');
          console.log("User added to the database successfully.");
        } catch (error) {
          console.error("Error adding user to the database:", error);
        }
      };

      addUserToDb(); 
    }
  }, [ready,authenticated, user]);

  return (
    <div className="h-[78px] bg-[#1832B8] font-sans shadow-[0px_1px_2px_0px_rgba(112,112,112,0.06),0px_1px_3px_0px_rgba(112,112,112,0.10)]">
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center flex-1">
          <Image
            src="/logo.png"
            alt="Logo"
            width={61}
            height={61}
            className="mt-2"
          />
          <div className="flex flex-row space-x-8 font-sans ml-2 justify-center">
            {menuItems.map((item, index) => (
              <div key={index} className="flex flex-row items-center">
                <Link
                  href={item.link}
                  className="hover:border hover:rounded-[26px] px-2 py-1"
                >
                  <span className="hover:text-[#AEFE03]">{item.label}</span>
                </Link>
                <Image
                  src="/Vector.png"
                  alt="Logo"
                  width={8}
                  height={4}
                  className=""
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center flex-1">
          <div className="flex flex-row items-center space-x-2 flex-start bg-[#0044E4] w-[334px] h-[42px] rounded-3xl px-2 mr-12">
            <Image src="/search.png" alt="Logo" width={20} height={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by game name, category"
              className="ml-2 bg-transparent text-white text-base font-normal leading-normal tracking-[-0.176px] outline-none w-full"
            />
            <div className="flex justify-center items-center w-6 h-6 py-[5px] flex-shrink-0 rounded-lg bg-[rgba(255,255,255,0.06)]">
              <Image src="/slash.png" alt="Logo" width={6} height={14} />
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center space-x-4 flex-1 justify-end">
          <Image src="/settings.png" alt="Logo" width={24} height={24} />
          {authenticated ? (
            <div className="flex items-center justify-evenly rounded-[9999px] bg-[#AEFE03] text-black w-[189.78px] px-[24.108px] py-[11px] space-x-0.5">
              <Image src="/wallet.png" alt="Wallet" width={24} height={24} />
              <span>{formatAddress(user?.wallet?.address ?? "")}</span>
            </div>
          ) : (
            <div
              onClick={login}
              className="flex items-center justify-center rounded-[9999px] bg-[#AEFE03] text-black w-[189.78px] px-[24.108px] py-[11px] space-x-0.5 cursor-pointer"
            >
              <Image src="/wallet.png" alt="Wallet" width={24} height={24} />
              <span>Connect Wallet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
