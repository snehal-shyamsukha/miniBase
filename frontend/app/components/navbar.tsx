import Image from "next/image";
const menuItems = [
  { label: "Home", link: "/" },
  { label: "Trade", link: "/products" },
  { label: "Unlockables", link: "/about" },
];

export default function Navbar() {
  return (
    <div className="w-[1440px] h-[78px] bg-[#1832B8] font-sans shadow-[0px_1px_2px_0px_rgba(112,112,112,0.06),0px_1px_3px_0px_rgba(112,112,112,0.10)]">
      <div className="flex justify-between items-center h-full px-4">
      <div className="flex items-center flex-1">
        <Image
          src="/logo.png"
          alt="Logo"
          width={61}
          height={61}
          className="mt-2"
        />
        <div className="flex flex-row space-x-8 font-sans ml-2 justify-center ml-3">
          {menuItems.map((item, index) => (
            <div key={index} className="flex flex-row items-center">
              <span className="hover:border hover:rounded-[26px] px-2 py-1">
                <span className="hover:text-[#AEFE03]">{item.label}</span>
              </span>
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
          <div className="ml-2 text-[rgba(255,255,255,0.48)] text-base font-normal leading-normal tracking-[-0.176px]">
            Search by game name, category
          </div>
          <div className="flex justify-center items-center w-6 h-6 py-[5px] flex-shrink-0 rounded-lg bg-[rgba(255,255,255,0.06)]">
            <Image src="/slash.png" alt="Logo" width={6} height={14} />
          </div>
        </div>
        </div>
        <div className="flex flex-row items-center space-x-4 flex-1 justify-end">
        <Image src="/settings.png" alt="Logo" width={24} height={24} />
          <div className="flex items-center justify-center rounded-[9999px] bg-[#AEFE03] text-black w-[189.78px] px-[24.108px] py-[11px] space-x-0.5">
          <Image src="/wallet.png" alt="Logo" width={24} height={24} />
          <span>Connect Wallet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
