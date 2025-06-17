import GHCard from "@/app/components/gh-card";
import { Posts } from "@/server/db/schema";

export default function GHCardDisplay(props: {
  ghCards: Posts[];
  tagFilter?: string[];
}) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {props.ghCards.map((item) => (
        <GHCard
          key={item.bucketUrl}
          id={item.id!}
          cardInfo={item}
          tagFilter={props.tagFilter}
        />
      ))}
    </div>
  );
}
