import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function TagDisplay(props: {
  tag: string;
  removeTag: (tag: string, toBeRemoved: boolean) => void;
  isHighlighted: boolean;
  editMode: boolean;
  updatePath: (t: string, bool: boolean) => void;
}) {
  const [toBeRemoved, setToBeRemoved] = useState(false);
  const handleClick = () => {
    setToBeRemoved(!toBeRemoved);
    props.removeTag(props.tag, toBeRemoved);
  };
  if (props.isHighlighted) {
    return (
      <p
        key={`tag-${props.tag}`}
        className={`flex flex-row items-center gap-x-2 rounded-sm px-2 text-sm font-semibold text-neutral-800 ${toBeRemoved ? "bg-neutral-100/30" : "bg-neutral-100"} transition-all hover:cursor-pointer`}
        onClick={() =>
          props.editMode ? handleClick() : props.updatePath(props.tag, false)
        }
      >
        {props.tag}
        {props.editMode && <ControlIcon toBeRemoved={toBeRemoved} />}
      </p>
    );
  }
  return (
    <p
      key={`tag-${props.tag}`}
      className={`flex flex-row items-center gap-x-2 rounded-sm px-2 text-sm font-semibold text-neutral-100 ${toBeRemoved ? "bg-neutral-600/30" : "bg-neutral-600"} transition-all hover:cursor-pointer`}
      onClick={() =>
        props.editMode ? handleClick() : props.updatePath(props.tag, true)
      }
    >
      {props.tag}
      {props.editMode && <ControlIcon toBeRemoved={toBeRemoved} />}
    </p>
  );
}

function ControlIcon(porps: { toBeRemoved: boolean }) {
  if (porps.toBeRemoved) {
    return <Plus className="h-3 w-3 hover:cursor-pointer" />;
  } else {
    return <X className="h-3 w-3 hover:cursor-pointer" />;
  }
}
