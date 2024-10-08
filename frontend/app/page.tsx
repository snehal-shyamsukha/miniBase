"use client"
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { getAllGames } from "./_actions/queries";
// import { useQuery } from "@tanstack/react-query";

const menuItems = [
  { label: "All" },
  { label: "RPG" },
  { label: "TCG" },
  { label: "Multiplayer" },
  { label: "Strategy" }
]
const gameList = [
  { name: "Dawnshard", type: "TCG", desc: "In-game assets available", img: "/dawnlogo.png" },
  { name: "Sorare", type: "Fantasy Sport", desc: "In-game assets available", img: "/sologo.png" },
  { name: "Illuvium", type: "RPG", desc: "In-game assets available", img: "/illulogo.png" },
  { name: "The Sandbox", type: "P2E", desc: "In-game assets available", img: "/sandboxlogo.png" }
]

export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('All');
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const gamesData = await getAllGames();
        console.log(gamesData)
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="font-akira min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0 pt-3">
          <Image
            src="/mainvector.png"
            alt="Background"
            width={1046.766}
            height={2149.492}
            priority
            className="z-0 h-auto w-auto"
          />
        </div>
        <main className="flex-grow relative overflow-hidden">
          <div className="relative z-10 flex justify-center items-center mt-8">
            <div className="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-[linear-gradient(132deg,rgba(255,255,255,0.1)_4.45%,rgba(255,255,255,0.1)_110.76%)]">
              <div className="flex items-center gap-[7.719px] px-[30.874px] py-[15.437px]">
                <Image
                  src="/ellipse.png"
                  alt="Background"
                  width={15}
                  height={15}
                  priority
                  className="z-0 h-auto w-auto"
                />
                <span className="font-sans text-white text-[19.296px] font-normal leading-[90.5%] tracking-[-0.386px]">
                  What's new and updates
                </span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center mt-8">
            {["miniclip", "but", "onchain"].map((text, index) => (
              <h1
                key={index}
                className="text-[144.968px] font-extrabold leading-none"
                style={{
                  textShadow:
                    "-3px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA, -1px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA",
                }}
              >
                {text}
              </h1>
            ))}
            <p className="mt-2 text-2xl font-sans font-medium">
              Discover, Play, Trade and enjoy your favourite games on Base.{" "}
            </p>
          </div>
          <div className="absolute inset-0 pointer-events-none z-20">
            <Image
              src="/game.png"
              alt="Game"
              width={188.4}
              height={141.143}
              className="absolute top-[55%] left-[16%]"
            />
            <Image
              src="/based.png"
              alt="Based"
              width={150}
              height={150}
              className="absolute top-[65%] right-[11%]"
            />
          </div>
        </main>
        <section className="relative z-10 h-screen flex flex-col justify-start mt-[15vh]">
          <div className="text-white text-center">
            <h2
              className="text-[80.87px] font-bold"
              style={{
                textShadow:
                  "-3px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA, -2px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA",
              }}
            >
              Discover Games
            </h2>
            <p className="font-sans text-[25px] font-medium">
              Discover your favourite onchain games on Base.
            </p>
          </div>
          <div className="font-sans mt-10 flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-[1305px] px-4">
              <span className="font-bold text-[#AEFE03] text-[30px] block mb-2">
                FEATURED GAME
              </span>
              <div className="w-full h-[472px] rounded-[18.763px] border-2 border-[#AEFE03] bg-[#001894] flex flex-row items-center p-4">
                <Image
                  src="/dawnshard.png"
                  alt="dawnshard"
                  width={782}
                  height={437}
                  className="object-cover rounded-[14px]"
                />
                <div className="px-20 text-white">
                  <h3
                    className="text-3xl font-bold mb-2"
                    style={{
                      color: "#8CFF05",
                      fontSize: "49.678px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Dawnshard
                  </h3>
                  <h2
                    className="mb-2"
                    style={{
                      color: "#8CFF05",
                      fontFamily: '"Grantha Sangam MN"',
                      fontSize: "27.446px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "normal",
                    }}
                  >
                    By Deep Monolith | P2E |
                  </h2>
                  <p
                    className="font-sans mb-4"
                    style={{
                      color: "#FFF",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    In-game assets available
                  </p>
                  <button className="flex w-[302px] h-[46px] px-[12.42px] py-[4.774px] justify-center items-center gap-[9.554px] rounded-[19.107px] border-[1.17px] border-[#0043F4] bg-[#8CFF05] text-[#001894] font-bold mb-1">
                    Claim your first TCG Pack
                  </button>
                  <p
                    className="font-sans mb-4"
                    style={{
                      color: "#FFF",
                      fontSize: "17.553px",
                      fontStyle: "normal",
                      fontWeight: 200,
                      lineHeight: "normal",
                    }}
                  >
                    18 minted | 69 per wallet | 30d 1h left
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="relative">
          <div className="absolute inset-0 pt-[60vh]">
            <Image
              src="/mainvector.png"
              alt="Background"
              width={1046.766}
              height={2149.492}
              className="z-0 h-auto w-auto object-cover"
            />
          </div>

          <section className="relative z-10 h-screen flex flex-col justify-start">
            <div className="font-sans mt-10 flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-[1305px] px-4">
                <div className="flex flex-row justify-start space-x-6 mb-4">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      className={`text-[22.115px] font-bold
          px-[6.706px] py-[2.579px] rounded-[10.317px]
          border transition-all duration-200 ease-in-out
          ${selectedMenuItem === item.label
                          ? 'border-[#0043F4] bg-[#AEFE03] text-[#0043F4]'
                          : 'border-transparent text-[#AEFE03] hover:border-[#0043F4] hover:bg-[#AEFE03] hover:text-[#0043F4]'
                        }`}
                      onClick={() => setSelectedMenuItem(item.label)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="w-full h-[529px] rounded-[18.763px] border-2 border-[#AEFE03] bg-[#001894] flex flex-col justify-start p-4">
                  <span className="text-[#AEFE03] font-sans ml-4 text-[30px] font-extrabold">TRENDING</span>
                  <div className="flex flex-row space-x-8 justify-center">
                    {gameList.map((item, index) => (
                      <div className="py-4 ">
                        <Image
                          key={index}
                          src={item.img}
                          alt={item.name}
                          width={279.576}
                          height={279.576}
                          className="object-cover rounded-[18.763px] mb-4"
                        />
                        <span className="text-[#AEFE03] ml-2 font-sans text-[23.454px] font-semibold">
                          {item.name} | {item.type}
                        </span>
                        <p className="text-white ml-2 font-sans text-[21.578px]">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="relative z-10 h-screen flex flex-col justify-start mt-[-10vh]">
            <div className="font-sans flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-[1305px] px-4">
                <div className="w-full h-[529px] rounded-[18.763px] border-2 border-[#AEFE03] bg-[#001894] flex flex-col justify-start p-4">
                  <span className="text-[#AEFE03] font-sans ml-4 text-[30px] font-extrabold">LATEST RELEASES</span>
                  <div className="flex flex-row space-x-8 justify-center">
                    {gameList.map((item, index) => (
                      <div className="py-4 ">
                        <Image
                          key={index}
                          src={item.img}
                          alt={item.name}
                          width={279.576}
                          height={279.576}
                          className="object-cover rounded-[18.763px] mb-4"
                        />
                        <span className="text-[#AEFE03] ml-2 font-sans text-[23.454px] font-semibold">
                          {item.name} | {item.type}
                        </span>
                        <p className="text-white ml-2 font-sans text-[21.578px]">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full mt-8">
              <div className="w-[1344.15px] h-[190.55px] flex flex-row rounded-[19.326px] border-[0.966px] border-[#FCD800] bg-[#1832B8] mt-8 items-center px-4 space-x-8">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={118}
                  height={118}
                  className="mt-2"
                />
                <div className="flex flex-col justify-center items-center">
                  <p className="text-[41.016px] text-[#AEFE03]">Looking for recommendations?</p>
                  <p className="text-[24.05px] text-white font-sans">Connect your wallet to view personalized recommendations</p>

                </div>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </div>
  );
}
