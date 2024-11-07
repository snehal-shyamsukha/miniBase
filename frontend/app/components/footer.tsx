import Image from "next/image";
import Link from "next/link";
const socialItems = [
  { label: "twitter", img: "/x.png", link: "https://x.com/theminibaseHQ" },
  { label: "farcaster", img: "/farcaster.png", link: "https://x.com/theminibaseHQ" },
  { label: "mail", img: "/mail.png", link: "mailto:minibaseofficial@gmail.com" },
]
export default function Footer() {
  return (
    <footer className="relative w-full mt-10">
      <div className=" flex flex-col justify-center items-center font-akira space-y-4 mb-3 z-10 ">
        <div className="flex justify-center w-full">
          <div className="w-full max-w-[1344.15px] rounded-[19.326px] border-[0.966px] border-[#FCD800] bg-[#1832B8] p-4">
            <div className="flex flex-col md:flex-row items-center justify-start space-y-4 md:space-y-0 md:space-x-8 px-10">
              <Image
                src="/logo.png"
                alt="Logo"
                width={118}
                height={118}
              />
              <div className="text-center md:text-left  flex flex-col items-center justify-center">
                <p className="text-[30px] md:text-[41.016px] text-[#AEFE03]">Looking for recommendations?</p>
                <p className="text-[18px] md:text-[24.05px] text-white font-sans">Connect your wallet to view personalized recommendations</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center space-x-8 pb-4">
          {socialItems.map((item, index) => (
            <div key={index}>
              <Link href={item.link}>
              <Image
                src={item.img}
                alt="Logo"
                width={43.131}
                height={43.131}
                className="mt-2"
              />
              </Link>

            </div>
          ))
          }
        </div>
      </div>
    </footer>

  )
}
