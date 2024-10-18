"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import MainCard from "@/app/components/mainCard";
import { usePrivy } from "@privy-io/react-auth";
import { getAllParticipants, checkParticipantExists } from "@/app/_actions/participant";
import { ethers } from "ethers";
import MiniBaseABIAndAddress from "@/app/abi/MiniBase.json";
import { useParams } from "next/navigation";
import { placeBet } from "@/app/_actions/betting";
import { getTournamentOwner, settleTournament } from "@/app/_actions/tournament";

const USDC_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)"
];

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export default function TournamentBetting() {
  const params = useParams();
  const tournamentId = parseInt(params.tournamentId as string, 10);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [tournamentOwner, setTournamentOwner] = useState<string | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const { user } = usePrivy();
  const ownerWallet = user?.farcaster?.ownerAddress || user?.wallet?.address;

  useEffect(() => {
    const fetchData = async () => {
      if (ownerWallet) {
        const participantData = await getAllParticipants(tournamentId);
        setParticipants(participantData);
        const userIsParticipant = await checkParticipantExists(tournamentId, ownerWallet);
        setIsParticipant(userIsParticipant);
        const owner = await getTournamentOwner(tournamentId);
        console.log(owner);
        setTournamentOwner(owner);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [tournamentId, ownerWallet]);

  const handleBet = async (participantWallet: string, amount: string) => {
    if (!ownerWallet) {
      console.error("No wallet connected");
      return;
    }

    setIsPlacingBet(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
      console.log(usdcContract)
      
      const currentAllowance = await usdcContract.allowance(ownerWallet, MiniBaseABIAndAddress.address);
      const betAmount = ethers.utils.parseUnits(amount, 6);

      console.log(betAmount);

      if (currentAllowance.lt(betAmount)) {
        console.log("Requesting approval for USDC transfer...");
        const approveTx = await usdcContract.approve(MiniBaseABIAndAddress.address, betAmount);
        await approveTx.wait();
        console.log("Approval granted");
      }

      const contract = new ethers.Contract(MiniBaseABIAndAddress.address, MiniBaseABIAndAddress.abi, signer);
      const tx = await contract.placeBet(tournamentId, participantWallet, betAmount);
      await tx.wait();
      console.log("Bet placed successfully on-chain");
      
      const participant = participants.find(p => p.user_wallet === participantWallet);
      if (!participant) {
        throw new Error("Participant not found");
      }
      console.log(participant);

      await placeBet(
        tournamentId,
        participant.participant_id,
        ownerWallet,
        parseFloat(amount)
      );
      console.log("Bet saved to database");

      const updatedParticipants = await getAllParticipants(tournamentId);
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error("Error placing bet:", error);
    } finally {
      setIsPlacingBet(false);
    }
  };

  const handleSettleTournament = async () => {
    if (ownerWallet !== tournamentOwner) {
      console.error("Only the tournament owner can settle the tournament");
      return;
    }

    if (!selectedWinner) {
      console.error("Please select a winner before settling the tournament");
      return;
    }

    setIsSettling(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(MiniBaseABIAndAddress.address, MiniBaseABIAndAddress.abi, signer);
      const tx = await contract.settleTournament(tournamentId, selectedWinner);
      await tx.wait();
      console.log("Tournament settled successfully on-chain");

      await settleTournament(tournamentId, selectedWinner);
      console.log("Tournament settled in database");

      const updatedParticipants = await getAllParticipants(tournamentId);
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error("Error settling tournament:", error);
    } finally {
      setIsSettling(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MainCard
        title="BASED GAMES: THE GREAT REALIGN"
        subtitle="Hosted by FBI"
        imageUrl="/knight.png"
        prizeAmount="10000"
        timeLeft="2 Days"
        description="The Based gods have spoken: 8 clans become 4 as alliances form anew. Unite with your newfound allies to solve the puzzle and earn immunity for your merged clan. The remaining clans face the vote, where fate is decided by whispers and strategies. Forge bonds and secure your future!"
        buttonText="Join Now"
        onButtonClick={() => console.log('Button clicked')}
      />

      {ownerWallet === tournamentOwner && (
        <div className="text-center my-4">
          <select 
            className="bg-[#0043F4] text-white font-bold py-2 px-4 rounded-full mr-4"
            value={selectedWinner || ''}
            onChange={(e) => setSelectedWinner(e.target.value)}
          >
            <option value="">Select Winner</option>
            {participants.map((participant, index) => (
              <option key={index} value={participant.user_wallet}>
                {participant.user_wallet.slice(0, 6)}...{participant.user_wallet.slice(-4)}
              </option>
            ))}
          </select>
          <button 
            className="bg-[#FF4136] text-white font-bold py-2 px-4 rounded-full hover:bg-[#FF7A6F] transition-colors duration-300"
            onClick={handleSettleTournament}
            disabled={isSettling || !selectedWinner}
          >
            {isSettling ? "Settling Tournament..." : "Settle Tournament"}
          </button>
        </div>
      )}

      <div className="w-full max-w-[1330.56px] mx-auto font-sans mb-10">
        <div className="border-t border-b border-[#73C4FF] py-4">
          <div className="flex justify-between items-center">
            <div className="w-1/3 text-[#8CFF05] font-bold text-lg">Teams/Players</div>
            <div className="w-1/3 text-center text-[#8CFF05] font-bold text-lg">Total Bets</div>
            <div className="w-1/3 text-right text-[#8CFF05] font-bold text-lg">Bet</div>
          </div>
        </div>
        
        {participants.map((participant, index) => (
          <div key={index} className="flex justify-between items-center py-4">
            <div className="w-1/3 text-white font-bold">{participant.user_wallet.slice(0, 6)}...{participant.user_wallet.slice(-4)}</div>
            <div className="w-1/3 text-center text-white font-bold">{participant.total_bet_amount} USDC</div>
            <div className="w-1/3 text-right">
              {!isParticipant && (
                <button 
                  className="bg-[#8CFF05] text-[#0043F4] font-bold py-2 px-4 rounded-full hover:bg-[#7AE005] transition-colors duration-300"
                  onClick={() => handleBet(participant.user_wallet, "0.5")}
                  disabled={isPlacingBet}
                >
                  {isPlacingBet ? "Placing Bet..." : "Bet 0.5 USDC"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isParticipant && (
        <div className="text-center text-white mt-4">
          You are a participant in this tournament and cannot place bets.
        </div>
      )}
    </div>
  );
}
