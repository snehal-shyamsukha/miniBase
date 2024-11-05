"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TournamentCard from '@/app/components/tournamentCard';
import { getAllTournaments } from "../_actions/tournament";


const menuItems = [
  { label: "All" },
  { label: "RPG" },
  { label: "TCG" },
  { label: "Multiplayer" },
  { label: "Strategy" },
];

export default function Tournaments() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("All");
  const [tournaments, setTournaments] = useState<Tournament[]>();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchTournaments = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTournaments();
        console.log(data)
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }finally {
        setIsLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-10">
        <div
          className="w-full max-w-[1202px] h-[119px] flex-shrink-0 text-white text-center font-akira text-4xl sm:text-5xl md:text-6xl lg:text-[80.87px] font-extrabold leading-none"
          style={{
            textShadow:
              "-3px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA, -1px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA",
          }}
        >
          Play Tournaments
        </div>
        <p className="text-center text-white font-sans text-[25px] font-semibold leading-[97.346%]">
          Play tournaments and bet on the outcome!
        </p>
        <div className="flex flex-row items-center justify-center space-x-6 mt-10 py-10">
          <Link href="/tournaments/new" passHref>
            <button className="w-[412px] h-[98px] flex-shrink-0 rounded-[22px] bg-[#8CFF05] hover:bg-[#7FE600] transition-colors duration-300 font-sans text-[#0029FF] hover:text-[#003AD6] text-center text-[30px] font-bold">
              Host A Tournament
            </button>
          </Link>
          <button className="w-[412px] h-[98px] flex-shrink-0 rounded-[22px] bg-white hover:bg-[#F0F0F0] transition-colors duration-300 font-sans text-[#0029FF] text-center text-[30px] font-bold">
            Your Tournaments
          </button>
        </div>
      </div>
      {/* <div className="overflow-x-auto mt-20 pb-4 mb-4"> */}
      {/* <div className="flex space-x-6 px-6">
          {tournaments && tournaments.slice(0, 5).map((tournament) => (
            <div
              key={tournament.tournament_id}
              className="flex-shrink-0 w-[454.92px] h-[229.133px] rounded-[21.053px] border-[1.469px] border-[#8CFF05] relative overflow-hidden"
            >
              <Image
                src={"/t1.png"}
                alt={tournament.name}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-start w-2/3">
                <h2 className="text-[#8CFF05] font-sans text-[24.322px] font-bold leading-normal">
                  {tournament.name}
                </h2>
                <p className="text-white font-sans text-[6.901px] font-medium leading-normal mb-4">
                  by FBI
                </p>
                <p className="w-[187.68px] h-[11.22px] flex-shrink-0 text-white font-sans text-[10.2px] font-medium leading-normal mb-2">
                  Tournament Reward 🏆: {tournament.reward} USDC
                </p>
                <p className="w-[147.9px] h-[11.22px] flex-shrink-0 text-white font-sans text-[10.2px] font-medium leading-normal mb-2">
                  Betting Pool 🎰 : {tournament.total_pool || "N/A"} USDC
                </p>
                <div className="flex flex-row space-x-2 mt-3">
                  <button className="w-[81.6px] h-[28.56px] flex-shrink-0 rounded-[23.626px] bg-[#0043F4] text-[#8CFF05] font-sans text-[15.3px] font-medium leading-normal hover:bg-[#003AD6] hover:text-[#7FE600] transition-colors duration-300">
                    Bet Now
                  </button>
                  <button className="w-[94.86px] h-[28.56px] flex-shrink-0 rounded-[23.626px] bg-white hover:bg-[#F0F0F0] transition-colors duration-300">
                    <span className="w-[79.56px] h-[18.36px] flex-shrink-0 text-[#0043F4] font-sans text-[15.3px] font-medium leading-normal hover:text-[#003AD6]">
                      Participate
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      {/* </div> */}
      <div className="p-6 mb-3">
        <div className="flex flex-row space-x-6 mb-4 font-sans mt-10 px-8 items-center justify-center">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`text-[22.115px] font-bold
          px-[6.706px] py-[2.579px] rounded-[10.317px]
          border transition-all duration-200 ease-in-out
          ${
            selectedMenuItem === item.label
              ? "border-[#0043F4] bg-[#AEFE03] text-[#0043F4]"
              : "border-transparent text-white border-white hover:border-[#0043F4] hover:bg-[#AEFE03] hover:text-[#0043F4]"
          }`}
              onClick={() => setSelectedMenuItem(item.label)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8CFF05]"></div>
          </div>
        ) : (
          <div className="flex flex-wrap p-2">
            {tournaments?.map((tournament: Tournament, index: number) => (
              <div
                key={tournament.tournament_id}
                className="w-full md:w-1/2 mb-6 flex items-center justify-center"
              >
                <div className="cursor-pointer transition-transform duration-300 hover:scale-105">
                  <TournamentCard
                    name={tournament.name}
                    tournamentId={tournament.tournament_id}
                    logoSrc={tournament.image || ''}
                    bgSrc={tournament.image || ''}
                    prizeAmount={tournament.reward}
                    timeline={tournament.deadline}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
