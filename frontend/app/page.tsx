import Navbar from "./components/navbar";
import Image from "next/image";
export default function Home() {
  return (
    <div className="font-akira min-h-screen flex flex-col">
      <Navbar/>
      <div className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0 pt-3">
          <Image
            src="/mainvector.png"
            alt="Background"
            width={1046.766}
            height={2149.492}
            priority
            className="z-0 h-auto w-auto"
          />
        </div>
      <main className="flex-grow relative overflow-hidden">
        <div className="relative z-10 flex justify-center items-center mt-8">
          <div className="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-[linear-gradient(132deg,rgba(255,255,255,0.1)_4.45%,rgba(255,255,255,0.1)_110.76%)]">
            <div className="flex items-center gap-[7.719px] px-[30.874px] py-[15.437px]">
              <Image
                src="/ellipse.png"
                alt="Background"
                width={15}
                height={15}
                priority
                className="z-0 h-auto w-auto"
              />
              <span className="font-sans text-white text-[19.296px] font-normal leading-[90.5%] tracking-[-0.386px]">What's new and updates</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center mt-8">
          {["miniclip", "but", "onchain"].map((text, index) => (
            <h1
              key={index}
              className="text-[144.968px] font-extrabold leading-none"
              style={{
                textShadow: '-2.25px -1px 0 #FFB9CA, 1px -1px 0 #FFB9CA, -1px 1px 0 #FFB9CA, 1px 1px 0 #FFB9CA'
              }}
            >
              {text}
            </h1>
          ))}
            <p className="mt-2 text-2xl font-sans">
            Discover, Play, Trade and enjoy your favourite games on Base.          </p>
        </div>
        <div className="absolute inset-0 pointer-events-none z-20">
            <Image
              src="/game.png"
              alt="Game"
              width={188.4}
              height={141.143}
              className="absolute top-[55%] left-[16%]"
            />
            <Image
              src="/based.png"
              alt="Based"
              width={150}
              height={150}
              className="absolute top-[65%] right-[11%]"
            />
          </div>
      </main>
      <section className="relative z-10 h-screen flex flex-col justify-start">
          <div className="text-white text-center">
            <h2 className="text-[80.87px] font-bold">Discover Games</h2>
            {/* Add more content for the Discover Games section here */}
          </div>
        </section>

        </div>
    </div>
  );
}
