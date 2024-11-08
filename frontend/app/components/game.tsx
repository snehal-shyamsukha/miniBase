"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface GameProps {
  cover: string;
  icon: string;
  name: string;
  type: string;
  images: string[];
  overview: string;
  faq: Array<{ question: string; answer: string }>;
  website: string;
  discord: string;
  twitter: string;
  cta: string;
  ctaLink: string;
}

export default function Gamecard({
  cover = "/gamecover.jpeg",
  icon,
  name,
  type,
  images,
  overview,
  faq,
  website,
  discord,
  twitter,
  cta,
  ctaLink,
}: GameProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);
  const socialLinks = [
    { src: "/web.png", link: website, alt: "Website" },
    { src: "/dis.png", link: discord, alt: "Discord" },
    { src: "/x.png", link: twitter, alt: "Twitter" },
  ];
  const SocialLink = ({
    src,
    link,
    alt,
  }: {
    src: string;
    link: string;
    alt: string;
  }) => (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer"
    >
      <Image
        src={src}
        alt={alt}
        width={isMobile ? 30 : 44}
        height={isMobile ? 30 : 44}
        className="object-cover"
      />
    </a>
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pb-54">
      <div className="relative">
        <div className="h-[200px] md:h-[400px] w-full relative">
          <Image src={cover} alt="Game Cover" layout="fill" objectFit="cover" />
        </div>
        <div className="absolute top-full left-0 w-full px-4 md:px-10 z-10">
          <div className="flex justify-end w-full mt-2 md:mt-4">
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <SocialLink key={index} {...link} />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 md:translate-y-2/3 flex items-end px-4 md:px-10">
          <div className="p-2 md:p-6 flex flex-col md:flex-row items-center md:items-end justify-between w-full">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <Image
                src={icon}
                alt="Game Logo"
                width={isMobile ? 100 : 200}
                height={isMobile ? 100 : 200}
                className="rounded-[24.741px] border-2 border-[#FFFEFE] object-cover"
              />
              <div className="mt-4 md:mt-10 p-2 md:p-6 text-center md:text-left">
                <h1 className="text-[#8CFF05] font-sans text-2xl md:text-[42.521px] font-semibold leading-tight mt-2 md:mt-10">
                  {name}
                </h1>
                <button className="mt-2 md:mt-4 px-4 md:px-6 py-2 md:py-3 bg-[#8CFF05] text-black font-semibold rounded-full hover:bg-[#7AE004] text-sm md:text-[20px] transition-colors font-sans">
                  {type}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-32 md:mt-72 flex flex-col items-center space-y-8 md:space-y-12 px-4 md:px-0">
        <div className="flex flex-wrap justify-center gap-4 md:flex-row md:items-center md:space-x-8">
          {images.map((src, index) => (
            <div key={index} className="mb-4 md:mb-10">
              <Image
                src={src}
                alt={`Game image ${index + 1}`}
                width={isMobile ? 150 : 249}
                height={isMobile ? 108 : 180}
                className="rounded-[26.39px] border-2 object-cover flex-shrink-0"
                style={{
                  height: isMobile ? "108px" : "180px",
                  width: isMobile ? "150px" : "250px",
                }}
              />
            </div>
          ))}
        </div>

        <div className="w-full max-w-[1328px] font-sans">
          <div className="flex justify-start space-x-4 md:space-x-8 border-b border-gray-200">
            <button
              className={`pb-2 text-xl md:text-[43px] font-semibold leading-normal ${
                activeTab === "overview"
                  ? "text-[#8CFF05] border-b-2 border-[#8CFF05]"
                  : "text-white"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`pb-2 text-xl md:text-[43px] font-semibold ${
                activeTab === "faq"
                  ? "text-[#8CFF05] border-b-2 border-[#8CFF05]"
                  : "text-white"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              FAQ
            </button>
          </div>
          <div className="mt-4 md:mt-6">
            {activeTab === "overview" ? (
              <p className="text-lg md:text-[35px] text-white leading-normal">
                {overview}
              </p>
            ) : (
              <div className="space-y-6 md:space-y-10">
                {faq.map((item, index) => (
                  <div key={index} className="space-y-2 md:space-y-4">
                    <h3 className="text-xl md:text-[38px] text-[#8CFF05] font-semibold">
                      {item.question}
                    </h3>
                    <p className="text-lg md:text-[35px] text-white leading-normal">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center mt-10">
            <a
              href={ctaLink}
              className="bg-[#8CFF05] text-black font-semibold rounded-full hover:bg-[#7AE004] text-sm md:text-[20px] transition-colors font-sans px-4 md:px-6 py-2 md:py-3"
            >
              {cta}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
