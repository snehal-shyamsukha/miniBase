"use client";
import { useParams } from 'next/navigation';
import Image from "next/image";
import Gamecard from "@/app/components/game";
import { gameList } from '@/utils/gameData';

export default function Game() {
    const { id } = useParams();
    const game = gameList.find(g => g.id.toString() === id);

    if (!game) {
        return <div>Game not found</div>;
      }
  return (
    <Gamecard
      cover={game.cover}
      icon={game.img}
      name={game.name}
      type={game.type}
      images={game.images}
      overview={game.overview}
      faq={game.faqData}
      website={game.website}
      discord={game.discord}
      twitter={game.twitter}
      cta={game.cta}
      ctaLink={game.ctaLink}
    />
);
}