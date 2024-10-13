import Image from "next/image";

interface TournamentCardProps {
  name: string;
  logoSrc: string;
  bgSrc: string;
  prizeAmount: string;
  timeline: string;
}

export default function TournamentCard({
  name,
  logoSrc,
  bgSrc,
  prizeAmount,
  timeline,
}: TournamentCardProps) {
  return (
    <div
      className="w-[664.866px] h-[313.223px] flex-shrink-0 rounded-[11.739px] relative bg-lightgray bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), url('${bgSrc}')`,
      }}
    >
      <div className="flex flex-row p-4 space-x-4 items-center">
        <div>
          <Image
            src={logoSrc}
            alt="Tournament logo"
            width={90}
            height={90}
            className="flex-shrink-0"
          />
        </div>
        <div className="w-[492.513px] text-[#8CFF05] font-sans text-[26.68px] font-bold">
          {name}
        </div>
      </div>

      {[1, 2, 3].map((index) => (
        <div key={index} className="flex flex-row justify-between p-1 mb-1">
          <p className="text-white font-sans text-[21.344px] font-bold">Team Alpha {index}</p>
          <p className="text-white font-sans text-[21.344px] font-bold">30.94%</p>
        </div>
      ))}
    

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
            {timeline}
          </div>
        </div>
        <Image
          src="/star.svg"
          alt="Star icon"
          width={21}
          height={21}
          className="absolute bottom-7 right-10 flex-shrink-0"
        />
      </div>
    </div>
  );
}