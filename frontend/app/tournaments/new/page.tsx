import Image from "next/image";
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
export default function NewTournament() {
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
      <form className="w-full max-w-[1320px] space-y-6 ml-10 mt-10">
        <div>
          <label className="block text-[#8CFF05] font-akira text-xl mb-2">Cover Image</label>
          <div className="flex items-center justify-center w-full h-[300px] bg-[#1E52F8] border border-[#FFF9F9] rounded-[19.326px]">
            <span className="text-[#678BFF] font-sans text-xl">+ Add Cover Image</span>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-[#8CFF05] font-akira text-xl mb-2">Name of Tournament</label>
          <input
            type="text"
            id="name"
            className="w-full h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div>
          <label htmlFor="gameDescription" className="block text-[#8CFF05] font-akira text-xl mb-2">Game Description</label>
          <textarea
            id="gameDescription"
            rows={3}
            className="w-full border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg p-4"
          ></textarea>
        </div>

        <div>
          <label htmlFor="tournamentDescription" className="block text-[#8CFF05] font-akira text-xl mb-2">Tournament Description</label>
          <textarea
            id="tournamentDescription"
            rows={3}
            className="w-full border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg p-4"
          ></textarea>
        </div>

        <div>
          <label htmlFor="dateTime" className="block text-[#8CFF05] font-akira text-xl mb-2">Tournament Date/Time</label>
          <input
            type="datetime-local"
            id="dateTime"
            className="w-1/3 h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4 mr-4"
          />
          <input
            type="datetime-local"
            id="dateTime"
            className="w-1/3 h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div>
          <label htmlFor="maxPlayers" className="block text-[#8CFF05] font-akira text-xl mb-2">Maximum Number of Players</label>
          <input
            type="number"
            id="maxPlayers"
            className="w-full h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div className="flex flex-row justify-between">
          <div>
          <label htmlFor="reward" className="block text-[#8CFF05] font-akira text-xl mb-2">Tournament Reward</label>
          <input
            type="text"
            id="reward"
            className="w-[499px] h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
          </div>
          <div className="flex flex-col">
            <label htmlFor="prizeDistribution" className="block text-[#8CFF05] font-akira text-xl mb-2">Prize Distribution</label>
            {[1, 2, 3].map((place) => (
              <input
                key={place}
                id={`prizeDistribution-${place}`}
                placeholder={`${place}${getOrdinalSuffix(place)} Prize`}
                className="w-[499px] h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg p-4 mb-2 flex-shrink-0"
              />
            ))}
          </div>
         
        </div>

        <div>
          <label htmlFor="streamingLink" className="block text-[#8CFF05] font-akira text-xl mb-2">Streaming Link (optional)</label>
          <input
            type="url"
            id="streamingLink"
            className="w-full h-[60px] border-[0.966px] border-[#FCD800] rounded-[19.326px] bg-[rgba(75,104,255,0.40)] text-white font-sans text-lg px-4"
          />
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button className="w-[200px] h-[60px] rounded-[22px] bg-[#8CFF05] hover:bg-[#7FE600] transition-colors duration-300 font-akira text-[#0029FF] hover:text-[#003AD6] text-center text-xl font-bold">
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
