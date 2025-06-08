"use client";
import GHCard from "@/app/components/gh-card";
import { Posts } from "@/server/db/schema";

export default function GHCardDisplay(props: { ghCards: Posts[] }) {
  // props.ghCards.sort((a, b) => {
  //   const nameA = a.name || "";
  //   const nameB = b.name || "";
  //
  //   return nameA.localeCompare(nameB);
  // });
  //
  // props.ghCards.reverse();

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {props.ghCards.map((item) => (
        <GHCard key={item.id} id={item.id!} cardInfo={item} />
      ))}
    </div>
  );
}
