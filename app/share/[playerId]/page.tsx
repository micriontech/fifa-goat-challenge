import { redirect } from "next/navigation";
import { PLAYERS } from "@/lib/players";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { playerId: string } }): Promise<Metadata> {
  const player = PLAYERS.find((p) => p.id === params.playerId);
  const name = player?.name ?? "a FIFA Legend";
  const base = "https://fifawcpredict.com";

  return {
    title: `My FIFA GOAT is ${name} - FIFAWCPREDICT`,
    description: `I picked ${name} as the greatest footballer of all time. Who is YOUR FIFA GOAT? Join the challenge!`,
    openGraph: {
      title: `My FIFA GOAT is '${name}'!`,
      description: `Who is YOUR FIFA GOAT? Join The Challenge at fifawcpredict.com`,
      url: `${base}/share/${params.playerId}`,
      siteName: "FIFAWCPREDICT",
      images: [{ url: `${base}/share/${params.playerId}/opengraph-image`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `My FIFA GOAT is '${name}'!`,
      description: `Who is YOUR FIFA GOAT? Join The Challenge at fifawcpredict.com`,
      images: [`${base}/share/${params.playerId}/opengraph-image`],
    },
  };
}

export default function SharePage() {
  redirect("/");
}
