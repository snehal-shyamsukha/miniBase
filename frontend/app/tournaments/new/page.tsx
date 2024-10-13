"use client";
import { use, useState } from "react";
import { createTournament } from "@/app/_actions/tournament";
import { usePrivy } from "@privy-io/react-auth";
import { generateTournamentId } from "@/utils/utils";
import { ethers } from "ethers";
import MiniBaseABIAndAddress from "@/app/abi/MiniBase.json";

function getOrdinalSuffix(i: number): string {
  const j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return "st";
  }
  if (j == 2 && k != 12) {
    return "nd";
  }
  if (j == 3 && k != 13) {
    return "rd";
  }
  return "th";
}

const contractAddress = "";

const convertToEpoch = (deadline: string): number => {
  return Math.floor(new Date(deadline).getTime() / 1000);
};

export default function NewTournament() {
  const [formData, setFormData] = useState({
    gameDescription: "",
    tournamentName: "",
    tournamentDescription: "",
    deadline: "",
    maxPlayers: 0,
    reward: "",
    prizeDistribution: ["", "", ""],
    streaming_link: ""
  });

  const { user } = usePrivy();

  const handleInputChange = (e: { target: { id: any; value: any; }; }) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handlePrizeChange = (index: number, value: string) => {
    setFormData((prevData) => {
      const newPrizes = [...prevData.prizeDistribution];
      newPrizes[index] = value;
      return { ...prevData, prizeDistribution: newPrizes };
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const ownerWallet = user?.farcaster?.ownerAddress || user?.wallet?.address;
    const tournamentId = generateTournamentId();
    const epochDeadline = convertToEpoch(formData.deadline);
    console.log(epochDeadline);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const { chainId } = await provider.getNetwork();

      if (chainId !== 8453) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }],
          });
          console.log("Switched to Base Mainnet");
        } catch (switchError) {
          if (switchError instanceof Error) {
            if ((switchError as any).code === 4902) {
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
                console.error("Failed to add Base Mainnet:", addError);
                return;
              }
            } else {
              console.error("Failed to switch network:", switchError);
              return;
            }
          } else {
            console.error("Unknown error occurred:", switchError);
            return;
          }
        }
      }

      const contract = new ethers.Contract(MiniBaseABIAndAddress.address, MiniBaseABIAndAddress.abi, signer);
      console.log(contract);

      const tx = await contract.createTournament(
        formData.tournamentName,
        epochDeadline,
        tournamentId
      );

      await tx.wait();
      console.log("Tournament created on-chain with ID:", tournamentId);

      await createTournament(
        tournamentId,
        ownerWallet ?? "",
        formData.gameDescription,
        formData.tournamentName,
        formData.tournamentDescription,
        epochDeadline,
        formData.maxPlayers,
        formData.reward,
        formData.prizeDistribution,
        formData.streaming_link
      );

      console.log("Tournament data saved in the database");

    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };


  return (
    <div className="mb-10">
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="w-full max-w-[1268px] h-[78px] flex-shrink-0 text-white text-center font-akira text-4xl sm:text-5xl md:text-6xl lg:text-[80.87px] font-extrabold leading-none"
          style={{ textShadow: "-3px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA, -1px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA" }}
        >
          HOST A TOURNAMENT
        </div>
        <p className="text-center text-white font-sans text-[25px] font-semibold leading-[97.346%] mt-6">
          Host a tournament or game night for your Based Community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-[1320px] space-y-6 ml-10 mt-10">
        {/* <div>
          <label className="block text-[#8CFF05] font-akira text-xl mb-2">Cover Image</label>
          <div className="flex items-center justify-center w-full h-[300px] bg-[#1E52F8] border border-[#FFF9F9] rounded-[19.326px]">
            <span className="text-[#678BFF] font-sans text-xl">+ Add Cover Image</span>
          </div>
        </div> */}

        <div>
          <label htmlFor="gameDescription" className="block text-[#8CFF05] font-akira text-xl mb-2">Game Description</label>
          <textarea
            id="gameDescription"
            value={formData.gameDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg p-4"
          ></textarea>
        </div>

        <div>
          <label htmlFor="tournamentName" className="block text-[#8CFF05] font-akira text-xl mb-2">Name of Tournament</label>
          <input
            type="text"
            value={formData.tournamentName}
            onChange={handleInputChange}
            id="tournamentName"
            className="w-full h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div>
          <label htmlFor="tournamentDescription" className="block text-[#8CFF05] font-akira text-xl mb-2">Tournament Description</label>
          <textarea
            id="tournamentDescription"
            value={formData.tournamentDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg p-4"
          ></textarea>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-[#8CFF05] font-akira text-xl mb-2">Tournament Date/Time</label>
          <input
            type="datetime-local"
            id="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-1/3 h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div>
          <label htmlFor="maxPlayers" className="block text-[#8CFF05] font-akira text-xl mb-2">Maximum Number of Players</label>
          <input
            type="number"
            id="maxPlayers"
            value={formData.maxPlayers}
            onChange={handleInputChange}
            className="w-full h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div className="flex flex-row justify-between">
          <div>
            <label htmlFor="reward" className="block text-[#8CFF05] font-akira text-xl mb-2">Tournament Reward</label>
            <input
              type="text"
              id="reward"
              value={formData.reward}
              onChange={handleInputChange}
              className="w-[499px] h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="prizeDistribution" className="block text-[#8CFF05] font-akira text-xl mb-2">Prize Distribution</label>
            {[1, 2, 3].map((place, index) => (
              <input
                key={place}
                id={`prizeDistribution-${place}`}
                placeholder={`${place}${getOrdinalSuffix(place)} Prize`}
                value={formData.prizeDistribution[index]}
                onChange={(e) => handlePrizeChange(index, e.target.value)}
                className="w-[499px] h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg p-4 mb-2 flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Streaming Link */}
        <div>
          <label htmlFor="streaming_link" className="block text-[#8CFF05] font-akira text-xl mb-2">Streaming Link (optional)</label>
          <input
            type="url"
            id="streaming_link"
            value={formData.streaming_link}
            onChange={handleInputChange}
            className="w-full h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center space-x-4 mt-8">
          <button type="submit" className="w-[200px] h-[60px] rounded-[22px] bg-[#8CFF05] hover:bg-[#7FE600] transition-colors duration-300 font-akira text-[#0029FF] hover:text-[#003AD6] text-center text-xl font-bold">
            LFG 🔥
          </button>
          <button className="w-[200px] h-[60px] rounded-[22px] bg-white hover:bg-[#F0F0F0] transition-colors duration-300 font-akira text-[#0029FF] text-center text-xl font-bold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
