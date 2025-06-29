import GHCard from "@/app/components/gh-card";
import { Posts } from "@/server/db/schema";

export default function GHCardDisplay(props: {
  ghCards: Posts[];
  tagFilters?: string[];
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {props.ghCards.map((item) => (
        <GHCard
          key={item.bucketUrl}
          id={item.id!}
          cardInfo={item}
          tagFilters={props.tagFilters}
        />
      ))}
    </div>
  );
}
