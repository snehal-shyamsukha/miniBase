"use client"
import Image from "next/image";
import MainCard from "@/app/components/mainCard";
export default function TournamentBetting() {
  return (
    <div>
            <MainCard
        title="BASED GAMES: THE GREAT REALIGN"
        subtitle="Hosted by FBI"
        imageUrl="/knight.png"
        prizeAmount="10000"
        timeLeft="2 Days"
        description="     The Based gods have spoken: 8 clans become 4 as alliances form anew. Unite with your newfound allies to solve the puzzle and earn immunity for your merged clan. The remaining clans face the vote, where fate is decided by whispers and strategies. Forge bonds and secure your future!"
        buttonText="Join Now"
        onButtonClick={() => console.log('Button clicked')}
      />
<div className="w-full max-w-[1330.56px] mx-auto font-sans mb-10">
  <div className="border-t border-b border-[#73C4FF] py-4">
    <div className="flex justify-between items-center">
      <div className="w-1/3 text-[#8CFF05] font-bold text-lg">Teams/Players</div>
      <div className="w-1/3 text-center text-[#8CFF05] font-bold text-lg">% Chance</div>
      <div className="w-1/3 text-right text-[#8CFF05] font-bold text-lg">Bet</div>
    </div>
  </div>
  
  {[
    { name: "Player 1", chance: "30.94%", bet: "0.5" },
    { name: "Player 2", chance: "45.12%", bet: "0.5" },
    { name: "Player 3", chance: "23.94%", bet: "0.5" },
  ].map((player, index) => (
    <div key={index} className="flex justify-between items-center py-4">
      <div className="w-1/3 text-white font-bold">{player.name}</div>
      <div className="w-1/3 text-center text-white font-bold">{player.chance}</div>
      <div className="w-1/3 text-right">
        <button className="bg-[#8CFF05] text-[#0043F4] font-bold py-2 px-4 rounded-full hover:bg-[#7AE005] transition-colors duration-300">
          {player.bet} USDC
        </button>
      </div>
    </div>
  ))}
</div>

      </div>

  );
}
