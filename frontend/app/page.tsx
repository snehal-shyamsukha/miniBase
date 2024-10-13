"use client"
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { getAllGames } from "./_actions/game";
// import { useQuery } from "@tanstack/react-query";

const menuItems = [
  { label: "All" },
  { label: "RPG" },
  { label: "TCG" },
  { label: "Multiplayer" },
  { label: "Strategy" }
]
export const gameList = [
  {
    id: 1,
    name: "Dawnshard",
    type: "TCG",
    desc: "Free-to-play multiplayer card game with unique, AI-generated decks.",
    img: "/dawnlogo.png",
    overview: "Dawnshard is a revolutionary TCG that combines traditional card gameplay with AI-generated decks, offering a unique experience every time you play.",
    category: "Card Game",
    images: ["/dawnshard1.png", "/dawnshard2.png", "/dawnshard3.png"]
  },
  {
    id: 2,
    name: "Anybody Problem",
    type: "CASUAL GAME",
    desc: "A casual cozy supercollider game with onchain physics.",
    img: "/ap.png",
    overview: "ANYBODY PROBLEM is a casual, cozy supercollider game built with onchain physics. Built on Base, it uses zero-knowledge (ZK) cryptography to deliver a secure and engaging experience. In ANYBODY PROBLEM, you can mint your wins and climb the leaderboard to collect one-of-a-kind celestial bodies. Each day presents a new “problem” (game), which you can collect as an NFT! These celestial bodies will appear in your wallet, and you can even play the game directly on OpenSea.",
    category: "Puzzle",
    images: ["/img5.png", "/img2.png","/img3.png","/img4.png"]
  },
  {
    id: 3,
    name: "EthXY",
    type: "MMORPG",
    desc: "An MMORPG where you build your hero and go on grand adventures.",
    img: "/ethxy.png",
    overview: "EthXY is an expansive MMORPG set in a vast blockchain-powered world, where players can create unique heroes and embark on epic quests.",
    category: "Role-Playing",
    images: ["/ethxy1.png", "/ethxy2.png", "/ethxy3.png"]
  },
  {
    id: 4,
    name: "Ultimate Champions",
    type: "E-SPORTS",
    desc: "Collect, manage, and trade your favourite football players.",
    img: "/uc.png",
    overview: "Ultimate Champions brings the excitement of football management to the blockchain, allowing players to build and manage their dream teams.",
    category: "Sports",
    images: ["/uc1.png", "/uc2.png", "/uc3.png"]
  },
  {
    id: 5,
    name: "Fren Pet",
    type: "CREATURE COLLECTING",
    desc: "Raise, train, and battle with your onchain fren!",
    img: "/fren.png",
    overview: "Fren Pet is a delightful creature-collecting game where players can nurture and evolve unique blockchain-based pets.",
    category: "Simulation",
    images: ["/fren1.png", "/fren2.png", "/fren3.png"]
  },
  {
    id: 6,
    name: "Fit Club",
    type: "PLAY TO EARN",
    desc: "Workout, compete, and earn on your onchain fitness journey.",
    img: "/fc.png",
    overview: "Fit Club gamifies your fitness routine, rewarding real-world exercise with in-game progress and cryptocurrency earnings.",
    category: "Health & Fitness",
    images: ["/fc1.png", "/fc2.png", "/fc3.png"]
  },
  {
    id: 7,
    name: "CityVerse Tycoon",
    type: "SIMULATION",
    desc: "Buy, sell, and manage properties in a virtual, onchain city.",
    img: "/cvt.png",
    overview: "CityVerse Tycoon lets players become virtual real estate moguls, managing properties and economies in a blockchain-based metropolis.",
    category: "Strategy",
    images: ["/cvt1.png", "/cvt2.png", "/cvt3.png"]
  },
  {
    id: 8,
    name: "Everdawn",
    type: "SIMULATION",
    desc: "Free-to-Play, 3D Tactical Trading Card Game.",
    img: "/ec.png",
    overview: "Everdawn combines tactical gameplay with collectible card mechanics in a stunning 3D environment, all powered by blockchain technology.",
    category: "Strategy",
    images: ["/ec1.png", "/ec2.png", "/ec3.png"]
  }
]
const gameList2 = [
  { name: "Pixotchi", type: "FARMING", desc: "Grow, strategize, and earn rewards as you cultivate your garden on Base!", img: "/p.jpeg" },
  { name: "Cat Town", type: "CASUAL GAME", desc: "Cozy, onchain game inspired by Animal Crossing.", img: "/cat.jpeg" },
  { name: "Atari X", type: "CLASSIC", desc: "Play Atari classics like Asteroids and Breakout onchain.", img: "/atari.jpeg" },
  { name: "GangstaVerse", type: "P2E", desc: "Next-gen digital collectible, Multi-chain gangster City", img: "/gv.jpeg" },
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
    <div className="font-akira flex flex-col">
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
            <div className="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-[linear-gradient(132deg,rgba(255,255,255,0.1)_4.45%,rgba(255,255,255,0.1)_110.76%)] mb-10">
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
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
            {["steam", "but", "onchain"].map((text, index) => (
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
              Discover, Play, Compete, and Bet on your favourite games built on
              Base.{" "}
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
        <section className="relative z-10 flex flex-col justify-start pt-20 mt-11">
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

          <section className="relative z-10 flex flex-col justify-start mb-2">
            <div className="font-sans mt-10 flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-[1305px] px-4">
                <div className="flex flex-row justify-start space-x-6 mb-4">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      className={`text-[22.115px] font-bold
          px-[6.706px] py-[2.579px] rounded-[10.317px]
          border transition-all duration-200 ease-in-out
          ${
            selectedMenuItem === item.label
              ? "border-[#0043F4] bg-[#AEFE03] text-[#0043F4]"
              : "border-transparent text-[#AEFE03] hover:border-[#0043F4] hover:bg-[#AEFE03] hover:text-[#0043F4]"
          }`}
                      onClick={() => setSelectedMenuItem(item.label)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="w-full h-auto rounded-[18.763px] border-2 border-[#AEFE03] bg-[#001894] flex flex-col justify-start p-4">
                  <span className="text-[#AEFE03] font-sans ml-4 text-[30px] font-extrabold">
                    TRENDING
                  </span>
                  <div className="flex flex-wrap justify-center">
                    {gameList.map((item, index) => (
                      <Link
                        key={index}
                        href={`/games/${item.id}`}
                        className="w-1/4 py-4 px-2"
                      >
                        <div className="cursor-pointer transition-transform duration-300 hover:scale-105">
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={279.576}
                            height={279.576}
                            className="object-cover rounded-[18.763px] mb-4"
                          />
                          <span className="text-[#AEFE03] ml-2 font-sans text-[23.454px] font-semibold">
                            {item.name}
                          </span>
                          <div className="flex items-center mt-1 mb-1 ml-2">
                            <span className="inline-block px-2 bg-[#8CFF05] text-[#012583] font-sans text-[16.796px] font-semibold leading-[24.752px] rounded-full">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-white ml-2 font-sans text-[19.578px]">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="relative z-10 flex flex-col justify-start mt-20 mb-10">
            <div className="font-sans flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-[1305px] px-4">
                <div className="w-full h-[529px] rounded-[18.763px] border-2 border-[#AEFE03] bg-[#001894] flex flex-col justify-start p-4">
                  <span className="text-[#AEFE03] font-sans ml-4 text-[30px] font-extrabold">
                    LATEST RELEASES
                  </span>
                  <div className="flex flex-row space-x-8 justify-center">
                    {gameList2.map((item, index) => (
                      <div className="py-4 h-auto">
                        <div className="w-[279.576px] h-[279.576px] relative mb-2">

                        <Image
                          key={index}
                          src={item.img}
                          alt={item.name}
                          fill
                          className="object-cover rounded-[18.763px]"
                        />
                        </div>
                        <span className="text-[#AEFE03] ml-2 font-sans text-[23.454px] font-semibold">
                          {item.name}
                        </span>
                        <div className="flex items-center mt-1 mb-1 ml-2">
                            <span className="inline-block px-2 bg-[#8CFF05] text-[#012583] font-sans text-[16.796px] font-semibold leading-[24.752px] rounded-full">
                              {item.type}
                            </span>
                          </div>
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
        </div>
      </div>
    </div>
  );
}
