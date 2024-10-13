"use client";
import { useParams } from 'next/navigation';
import Image from "next/image";
import Gamecard from "@/app/components/game";
import { gameList } from '@/app/page';

export default function Game() {
    const { id } = useParams();
    const game = gameList.find(g => g.id.toString() === id);

    if (!game) {
        return <div>Game not found</div>;
      }
      
  return (
    <Gamecard
      cover="/gamecover.jpeg"
      icon={game.img}
      name={game.name}
      type={game.type}
      images={game.images}
      overview={game.overview}
      faq="Game FAQ text..."
    />
);
}