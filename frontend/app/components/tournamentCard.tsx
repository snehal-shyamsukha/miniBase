import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { Interface } from "@ethersproject/abi";
import MiniBaseABIAndAddress from "@/app/abi/MiniBase.json";
import { addParticipantToTournament, checkParticipantExists } from "../_actions/participant";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface TournamentCardProps {
  tournamentId: number;
  name: string;
  logoSrc: string;
  bgSrc?: string;
  prizeAmount: string;
  timeline: string;
  image?: string;
}

const formatTimeline = (epochTimestamp: number): string => {
  const endDate = new Date(epochTimestamp * 1000);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  if (diffTime < 0) {
    return "Ended";
  } else if (diffDays > 1) {
    return `${diffDays} days left`;
  } else if (diffDays === 1) {
    return "1 day left";
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m left`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ${diffSeconds}s left`;
  } else {
    return `${diffSeconds}s left`;
  }
};

const contractInterface = new Interface(MiniBaseABIAndAddress.abi);

const decodeContractError = (error: any) => {
  if (error && error.data) {
    try {
      const decodedError = contractInterface.parseError(error.data);
      switch (decodedError.name) {
        case "TournamentFull":
          return `Tournament ${decodedError.args[0]} is full`;
        case "ParticipantAlreadyAdded":
          return `Participant ${decodedError.args[1]} is already added to tournament ${decodedError.args[0]}`;
        case "TournamentNotFound":
          return `Tournament ${decodedError.args[0]} not found`;
        case "InvalidParticipant":
          return "Invalid participant address";
        default:
          return `Contract error: ${decodedError.name}`;
      }
    } catch (decodeError) {
      console.error("Error decoding contract error:", decodeError);
      return "Unknown contract error";
    }
  }
  return "Unknown error occurred";
};

export default function TournamentCard({
  tournamentId,
  name,
  logoSrc,
  bgSrc,
  prizeAmount,
  timeline,
  image,
}: TournamentCardProps) {
  const { user } = usePrivy();
  const ownerWallet = user?.farcaster?.ownerAddress || user?.wallet?.address;
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [formattedTimeline, setFormattedTimeline] = useState(formatTimeline(parseInt(timeline)));
  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setInterval(() => {
      const newFormattedTimeline = formatTimeline(parseInt(timeline));
      setFormattedTimeline(newFormattedTimeline);
      setIsEnded(newFormattedTimeline === "Ended");
    }, 1000);

    return () => clearInterval(timer);
  }, [timeline]);


  useEffect(() => {
    const checkTournamentStatus = () => {
      const newFormattedTimeline = formatTimeline(parseInt(timeline));
      setFormattedTimeline(newFormattedTimeline);
      setIsEnded(newFormattedTimeline === "Ended");
      setIsLoading(false);
    };

    checkTournamentStatus();
    const timer = setInterval(checkTournamentStatus, 1000);

    return () => clearInterval(timer);
  }, [timeline]);

  const handleAddParticipant = async () => {
    if (!ownerWallet) {
      setJoinError("No wallet address found");
      return;
    }

    setIsJoining(true);
    setJoinError(null);

    try {
      const participantExists = await checkParticipantExists(tournamentId, ownerWallet);

      if (participantExists) {
        setJoinError("You have already joined this tournament");
        setIsJoining(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const balance = await provider.getBalance(ownerWallet);
      if (balance.isZero()) {
        setJoinError("Insufficient ETH balance. Please add some ETH to your wallet to cover gas fees.");
        setIsJoining(false);
        return;
      }

      const { chainId } = await provider.getNetwork();
      if (chainId !== 8453) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }],
          });
          console.log("Switched to Base Mainnet");
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x2105',
                    chainName: 'Base Mainnet',
                    nativeCurrency: {
                      name: 'Base',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://mainnet.base.org'],
                    blockExplorerUrls: ['https://basescan.org/'],
                  },
                ],
              });
              console.log("Base Mainnet added and switched");
            } catch (addError) {
              throw new Error("Failed to add Base Mainnet");
            }
          } else {
            throw new Error("Failed to switch network");
          }
        }
      }

      const contract = new ethers.Contract(MiniBaseABIAndAddress.address, MiniBaseABIAndAddress.abi, signer);

      console.log(`Adding participant to contract: tournamentId=${tournamentId}, ownerWallet=${ownerWallet}`);
      const tx = await contract.addParticipant(tournamentId, ownerWallet);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");

      console.log("Adding participant to database");
      await addParticipantToTournament(tournamentId, ownerWallet);
      console.log("Participant added to database");
      toast.success("You have joined the tournament!")

    } catch (error) {
      console.error("Error adding participant:", error);
      const errorMessage = decodeContractError(error);
      setJoinError(errorMessage);
    } finally {
      setIsJoining(false);
    }
  };

  console.log(logoSrc);

  return (
    <div
      className="w-[664.866px] h-[313.223px] flex-shrink-0 rounded-[11.739px] relative bg-lightgray bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), url('${image || bgSrc || 'linear-gradient(135deg, #001894 0%, #3965FF 100%)'}')`
      }}
    >
      <Link href={`/tournaments/${tournamentId}`} passHref>
        <div className="flex flex-row p-4 space-x-4 items-center">
          <div className="w-[90px] h-[90px] flex-shrink-0 overflow-hidden">
            <Image
              src={logoSrc ? new URL(logoSrc).toString() : '/fallback-image.png'}
              alt="Tournament logo"
              width={90}
              height={90}
              className="h-full w-auto min-w-full object-cover"
              unoptimized
            />
          </div>
          <div className="w-[492.513px] text-[#8CFF05] font-sans text-[26.68px] font-bold object-cover">
            {name}
          </div>
        </div>

        {['harris.base.eth', 'jesse.base.eth', 'brian.base.eth'].map((name,index) => (
          <div key={index} className="flex flex-row justify-between p-1 mb-1">
            <p className="text-white font-sans text-[21.344px] font-bold">{name}</p>
            <p className="text-white font-sans text-[21.344px] font-bold">30.94%</p>
          </div>
        ))}
      </Link>
      <div className="absolute bottom-0 left-0 w-full h-[81.107px] flex-shrink-0 bg-[#001894] rounded-b-[11.739px] flex items-center">
        <div className="flex flex-row p-4 space-x-2 items-center">
          <div className="bg-[#3965FF] p-1">
            <Image
              src="/prize.svg"
              alt="Prize icon"
              width={13.874}
              height={17.609}
              className="flex-shrink-0"
            />
          </div>
          <div className="text-white font-sans text-[16.008px] font-bold">
            ${prizeAmount}
          </div>
        </div>
        <div className="flex flex-row p-4 space-x-2 items-center">
          <div className="bg-[#3965FF] p-1">
            <Image
              src="/clock.svg"
              alt="Clock icon"
              width={13.149}
              height={13.151}
              className="flex-shrink-0"
            />
          </div>
          <div className="text-white font-sans text-[16.008px] font-bold">
            {formattedTimeline}
          </div>
        </div>
        {!isLoading && !isEnded && (
          <>
            <button
              className="w-[94.86px] h-[28.56px] flex-shrink-0 rounded-[23.626px] bg-white hover:bg-[#F0F0F0] transition-colors duration-300"
              onClick={handleAddParticipant}
              disabled={isJoining}
            >
              <span className="w-[79.56px] h-[18.36px] flex-shrink-0 text-[#0043F4] font-sans text-[15.3px] font-medium leading-normal hover:text-[#003AD6] hover:cursor-pointer">
                {isJoining ? "Joining..." : "Participate"}
              </span>
            </button>
            <Link href={`/tournaments/${tournamentId}`} passHref>
              <button
                className="w-[94.86px] h-[28.56px] flex-shrink-0 rounded-[23.626px] bg-[#8CFF05] hover:bg-[#7AE004] transition-colors duration-300 ml-2"
              >
                <span className="w-[79.56px] h-[18.36px] flex-shrink-0 text-black font-sans text-[15.3px] font-medium leading-normal hover:cursor-pointer">
                  Bet Now
                </span>
              </button>
            </Link>
          </>
          )}

        <Image
          src="/star.svg"
          alt="Star icon"
          width={21}
          height={21}
          className="absolute bottom-7 right-10 flex-shrink-0"
        />
      </div>
      {
        joinError && (
          <div className="absolute bottom-20 left-0 w-full bg-red-500 text-white p-2 text-center font-sans">
            {joinError}
          </div>
        )
      }
    </div >
  );
}
