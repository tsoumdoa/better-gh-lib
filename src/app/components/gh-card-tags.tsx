import TagDisplay from "./gh-card-tag-display";

export default function GhCardTags(props: {
  tags: string[];
  useNarrow: boolean;
  tagFilter?: string[];
  editMode: boolean;
  removeTag: (tag: string, bool: boolean) => void;
}) {
  return (
    <div
      className={`flex ${props.useNarrow ? "w-[calc(100%-4.25rem)]" : "w-full"} flex-wrap items-center gap-2 pb-2`}
    >
      {props.tags.map((tag, i) => (
        <TagDisplay
          key={`tag-${i}-${tag}-${props.editMode}`}
          tag={tag}
          removeTag={props.removeTag}
          isHighlighted={props.tagFilter?.includes(tag) ?? false}
          editMode={props.editMode}
        />
      ))}
    </div>
  );
}
