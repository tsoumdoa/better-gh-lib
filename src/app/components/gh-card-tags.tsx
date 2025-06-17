export default function GhCardTags(props: {
  tags: string[];
  useNarrow: boolean;
  tagFilter?: string[];
}) {
  return (
    <div
      className={`flex ${props.useNarrow ? "w-[calc(100%-4.25rem)]" : "w-full"} flex-wrap items-center gap-2 pb-1`}
    >
      {props.tags.map((tag, i) =>
        props.tagFilter?.includes(tag) ? (
          <p
            key={`tag-${i}-${tag}`}
            className="rounded-sm bg-neutral-100 px-2 text-sm font-semibold text-neutral-800"
          >
            {tag}
          </p>
        ) : (
          <p
            key={`tag-${i}-${tag}`}
            className="rounded-sm bg-neutral-600 px-2 text-sm font-semibold text-neutral-100"
          >
            {tag}
          </p>
        )
      )}
    </div>
  );
}
