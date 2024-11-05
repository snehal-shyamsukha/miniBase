"use client";
import { use, useState } from "react";
import { createTournament, uploadTournamentImage } from "@/app/_actions/tournament";
import { usePrivy } from "@privy-io/react-auth";
import { generateTournamentId } from "@/utils/utils";
import { ethers } from "ethers";
import MiniBaseABIAndAddress from "@/app/abi/MiniBase.json";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import imageCompression from 'browser-image-compression';

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

const convertToEpoch = (deadline: string): number => {
  return Math.floor(new Date(deadline).getTime() / 1000);
};

export default function NewTournament() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    gameDescription: "",
    tournamentName: "",
    tournamentDescription: "",
    deadline: "",
    maxPlayers: 0,
    reward: "",
    prizeDistribution: ["", "", ""],
    streaming_link: "",
    imageFile: null as File | null,
    imagePreview: '',
  });

  const [errors, setErrors] = useState({
    gameDescription: "",
    tournamentName: "",
    tournamentDescription: "",
    deadline: "",
    maxPlayers: "",
    reward: "",
    prizeDistribution: ["", "", ""],
    streaming_link: "",
  });
  const { user } = usePrivy();

  const handleInputChange = (e: { target: { id: any; value: any } }) => {
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields.");
      return;
    }
    setIsLoading(true);
    const ownerWallet = user?.farcaster?.ownerAddress || user?.wallet?.address;
    const tournamentId = generateTournamentId();
    const epochDeadline = convertToEpoch(formData.deadline);

    try {
      let imageUrl = "";
      if (formData.imageFile) {
        imageUrl = await uploadTournamentImage(
          formData.imagePreview,
          formData.imageFile.name
        );
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const { chainId } = await provider.getNetwork();

      if (chainId !== 8453) {
        try {
          if (typeof window.ethereum === 'undefined') {
            toast.error("wallet disconnected!")
            throw new Error("No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.");
          }      
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x2105" }],
          });
          console.log("Switched to Base Mainnet");
        } catch (switchError) {
          if (switchError instanceof Error) {
            if ((switchError as any).code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x2105",
                      chainName: "Base Mainnet",
                      nativeCurrency: {
                        name: "Base",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      rpcUrls: ["https://mainnet.base.org"],
                      blockExplorerUrls: ["https://basescan.org/"],
                    },
                  ],
                });
                console.log("Base Mainnet added and switched");
              } catch (addError) {
                console.error("Failed to add Base Mainnet:", addError);
                toast.error("Tournament Creation Failed!");
                return;
              }
            } else {
              console.error("Failed to switch network:", switchError);
              toast.error("Tournament Creation Failed!");
              return;
            }
          } else {
            console.error("Unknown error occurred:", switchError);
            toast.error("Tournament Creation Failed!");
            return;
          }
        }
      }

      const contract = new ethers.Contract(
        MiniBaseABIAndAddress.address,
        MiniBaseABIAndAddress.abi,
        signer
      );
      console.log(
        formData.maxPlayers,
        formData.tournamentName,
        epochDeadline,
        tournamentId
      );
      const tx = await contract.createTournament(
        formData.tournamentName,
        epochDeadline,
        tournamentId,
        formData.maxPlayers
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
        formData.streaming_link,
        imageUrl
      );

      console.log("Tournament data saved in the database");
      toast.success("Tournament Created!");
      router.push(`/tournaments/${tournamentId}`);
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast.error("Tournament Creation Failed!");
    } finally {
      setIsLoading(false);
    }
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.gameDescription.trim()) {
      newErrors.gameDescription = "Game description is required";
      isValid = false;
    } else {
      newErrors.gameDescription = "";
    }

    if (!formData.tournamentName.trim()) {
      newErrors.tournamentName = "Tournament name is required";
      isValid = false;
    } else {
      newErrors.tournamentName = "";
    }

    if (!formData.tournamentDescription.trim()) {
      newErrors.tournamentDescription = "Tournament description is required";
      isValid = false;
    } else {
      newErrors.tournamentDescription = "";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Tournament date/time is required";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.deadline);
      const currentDate = new Date();
      if (selectedDate <= currentDate) {
        newErrors.deadline = "Tournament date/time must be in the future";
        isValid = false;
      } else {
        newErrors.deadline = "";
      }
    }

    if (!formData.maxPlayers || formData.maxPlayers <= 0) {
      newErrors.maxPlayers = "Maximum number of players must be greater than 0";
      isValid = false;
    } else {
      newErrors.maxPlayers = "";
    }

    if (!formData.reward.trim()) {
      newErrors.reward = "Tournament reward is required";
      isValid = false;
    } else {
      newErrors.reward = "";
    }

    const newPrizeErrors = formData.prizeDistribution.map((prize, index) => {
      if (!prize.trim() && index === 0) {
        isValid = false;
        return "1st prize is required";
      }
      return "";
    });
    newErrors.prizeDistribution = newPrizeErrors;

    if (formData.streaming_link && !isValidUrl(formData.streaming_link)) {
      newErrors.streaming_link = "Invalid URL format";
      isValid = false;
    } else {
      newErrors.streaming_link = "";
    }

    setErrors(newErrors);
    return isValid;
  };
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 2,         
          maxWidthOrHeight: 800,  
          useWebWorker: true,
          initialQuality: 0.6   
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            imageFile: compressedFile,
            imagePreview: reader.result as string
          }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Error processing image. Please try a different image.');
      }
    }
  };

  return (
    <div className="mb-10">
      <div className="flex flex-col justify-center items-center mt-10">
        <div
          className="w-full max-w-[1268px] h-[78px] flex-shrink-0 text-white text-center font-akira text-4xl sm:text-5xl md:text-6xl lg:text-[80.87px] font-extrabold leading-none"
          style={{
            textShadow:
              "-3px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA, -1px 0px 0 #FFB9CA, 1px 0px 0 #FFB9CA",
          }}
        >
          HOST A TOURNAMENT
        </div>
        <p className="text-center text-white font-sans text-[25px] font-semibold leading-[97.346%] mt-6">
          Host a tournament or game night for your Based Community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[1320px] space-y-6 ml-10 mt-10"
      >
        <div>
          <label className="block text-[#8CFF05] font-akira text-xl mb-2">Cover Image</label>
          <div 
            className="flex items-center justify-center w-full h-[300px] bg-[#1E52F8] border border-[#FFF9F9] rounded-[19.326px] relative overflow-hidden cursor-pointer"
            onClick={() => document.getElementById('imageUpload')?.click()}
          >
            {formData.imagePreview ? (
              <Image
                src={formData.imagePreview}
                alt="Tournament cover"
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <span className="text-[#678BFF] font-sans text-xl">+ Add Cover Image</span>
            )}
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="gameDescription"
            className="block text-[#8CFF05] font-akira text-xl mb-2"
          >
            Game Description
          </label>
          <textarea
            id="gameDescription"
            value={formData.gameDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg p-4"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="tournamentName"
            className="block text-[#8CFF05] font-akira text-xl mb-2"
          >
            Name of Tournament
          </label>
          <input
            type="text"
            value={formData.tournamentName}
            onChange={handleInputChange}
            id="tournamentName"
            className="w-full h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div>
          <label
            htmlFor="tournamentDescription"
            className="block text-[#8CFF05] font-akira text-xl mb-2"
          >
            Tournament Description
          </label>
          <textarea
            id="tournamentDescription"
            value={formData.tournamentDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg p-4"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="block text-[#8CFF05] font-akira text-xl mb-2"
          >
            Tournament Date/Time
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-1/3 h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div>
          <label
            htmlFor="maxPlayers"
            className="block text-[#8CFF05] font-akira text-xl mb-2"
          >
            Maximum Number of Players
          </label>
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
            <label
              htmlFor="reward"
              className="block text-[#8CFF05] font-akira text-xl mb-2"
            >
              Tournament Reward
            </label>
            <input
              type="text"
              id="reward"
              value={formData.reward}
              onChange={handleInputChange}
              className="w-[499px] h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="prizeDistribution"
              className="block text-[#8CFF05] font-akira text-xl mb-2"
            >
              Prize Distribution
            </label>
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
          <label
            htmlFor="streaming_link"
            className="block text-[#8CFF05] font-akira text-xl mb-2"
          >
            Streaming Link (optional)
          </label>
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
          <button
            type="submit"
            className="w-[200px] h-[60px] rounded-[22px] bg-[#8CFF05] hover:bg-[#7FE600] transition-colors duration-300 font-akira text-[#0029FF] hover:text-[#003AD6] text-center text-xl font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "LFG 🔥"
            )}
          </button>
          <button 
            type="button" 
            className="w-[200px] h-[60px] rounded-[22px] bg-white hover:bg-[#F0F0F0] transition-colors duration-300 font-akira text-[#0029FF] text-center text-xl font-bold"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
