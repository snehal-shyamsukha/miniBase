import Image from "next/image";

interface MainCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  prizeAmount?: string;
  timeLeft?: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function MainCard({
  title,
  subtitle,
  imageUrl,
  prizeAmount,
  timeLeft,
  description,
  buttonText,
  onButtonClick
}: MainCardProps) {
  return (
    <div className="w-full max-w-[1361px] rounded-[18.763px] border-2 border-[#AEFE03] m-auto my-10 flex flex-col bg-[#001894] overflow-hidden">
      <div className="flex flex-row p-6">
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={300}
          className="h-64 w-64 object-cover rounded-lg"
        />
        <div className="flex flex-col ml-6 flex-grow">
          <h2 className="text-[#8CFF05] font-sans text-4xl font-bold mb-2">
            {title}
          </h2>
          {subtitle && (
            <h3 className="text-white font-sans text-xl font-semibold mb-4">{subtitle}</h3>
          )}
          {(prizeAmount || timeLeft) && (
            <div className="flex flex-row items-center mb-4">
              {prizeAmount && (
                <div className="flex items-center mr-6">
                  <div className="bg-[#3965FF] p-2 rounded-full mr-2">
                    <Image
                      src="/prize.svg"
                      alt="Prize icon"
                      width={24}
                      height={24}
                      className="flex-shrink-0"
                    />
                  </div>
                  <span className="text-white font-sans text-lg font-bold">${prizeAmount}</span>
                </div>
              )}
              {timeLeft && (
                <div className="flex items-center">
                  <div className="bg-[#3965FF] p-2 rounded-full mr-2">
                    <Image
                      src="/clock.svg"
                      alt="Clock icon"
                      width={24}
                      height={24}
                      className="flex-shrink-0"
                    />
                  </div>
                  <span className="text-white font-sans text-lg font-bold">{timeLeft}</span>
                </div>
              )}
            </div>
          )}
          <p className="text-white font-sans text-base mb-6">{description}</p>
          <button 
            onClick={onButtonClick}
            className="w-64 py-3 rounded-lg bg-[#8CFF05] text-black font-sans text-lg font-bold transition-colors duration-300 hover:bg-[#7AE004]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}