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
import { getTournamentOwner, settleTournament, getAllTournaments } from "@/app/_actions/tournament";
import { formatTimeLeft } from "@/utils/timeUtils";
import { toast } from 'react-hot-toast';

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
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [tournamentIndex, setTournamentIndex] = useState<number | null>(null);
  const [bettingParticipant, setBettingParticipant] = useState<string | null>(null);
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
        const tournaments = await getAllTournaments();
        const currentTournament = tournaments.find(t => t.tournament_id === tournamentId);
        setTournament(currentTournament || null);
        if (currentTournament) {
          setTournamentIndex(tournaments.findIndex(t => t.tournament_id === tournamentId));
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [tournamentId, ownerWallet]);

  const handleBet = async (participantWallet: string, amount: string) => {
    if (!ownerWallet) {
      toast.error("No wallet connected");
      console.error("No wallet connected");
      return;
    }

    setIsPlacingBet(true);
    setBettingParticipant(participantWallet);

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
      toast.success("Bet placed successfully!");

      const updatedParticipants = await getAllParticipants(tournamentId);
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error("Error placing bet:", error);
    } finally {
      setIsPlacingBet(false);
      setBettingParticipant(null);
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
    return (
      <div className="flex justify-center items-center h-screen bg-[#0043F4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#8CFF05] mb-4"></div>
          <p className="text-[#8CFF05] font-bold text-xl font-sans">Loading Tournament...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
    {tournament && tournamentIndex !== null && (
      <MainCard
        title={tournament.name}
        subtitle={`Hosted by ${tournament.owner_wallet.slice(0, 6)}...${tournament.owner_wallet.slice(-4)}`}
        imageUrl={tournamentIndex === 0 ? "/knight.png" : tournamentIndex === 1 ? "/dawnlogo.png"  : tournamentIndex === 2 ? "/cat.jpeg"  : tournamentIndex === 3 ? "/fc.png": "/based.png"}
        prizeAmount={tournament.reward}
        timeLeft={formatTimeLeft(parseInt(tournament.deadline, 10))}
        description={tournament.description}
        buttonText="Watch Stream"
        onButtonClick={() => console.log('Button clicked')}
      />
    )}

      {ownerWallet === tournamentOwner && (
        <div className="text-center my-4 font-sans">
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
            className="bg-[#0043F4] text-[#8CFF05] font-bold py-2 px-4 rounded-full hover:bg-[#003AD6] transition-colors duration-300 border border-[#8CFF05] font-sans"
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
            {!isParticipant && tournament && typeof tournament.deadline === 'number' && tournament.deadline * 1000 > Date.now() && (
        <button 
          className="bg-[#8CFF05] text-[#0043F4] font-bold py-2 px-4 rounded-full hover:bg-[#7AE005] transition-colors duration-300"
          onClick={() => handleBet(participant.user_wallet, "0.5")}
          disabled={isPlacingBet}
        >
          {isPlacingBet && bettingParticipant === participant.user_wallet 
            ? "Placing Bet..." 
            : "Bet 0.5 USDC"}
        </button>
      )}
            </div>
          </div>
        ))}
      </div>

      {isParticipant && (
        <div className="text-center text-white mt-4 mb-8 font-sans max-w-md mx-auto">
          <p className="border-2 border-[#8CFF05] rounded-lg p-4 bg-[#0043F4] shadow-lg">
            <span className="font-bold text-[#8CFF05]">Note:</span> You are a participant in this tournament and cannot place bets.
          </p>
        </div>
      )}
    </div>
  );
}
