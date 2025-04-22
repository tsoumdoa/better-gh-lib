import { useState } from "react";

export default function GHCard(props: { name: string; description: string }) {
  const [editMode, setEditMode] = useState(false);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-md p-3 ring-1 ring-neutral-500 ${editMode ? "bg-neutral-500" : "bg-neutral-900"}`}
    >
      <div>
        <p
          className={` ${editMode ? "text-neutral-900" : "text-neutral-500"} `}
        >
          Name
        </p>
        <p
          className={`pb-1 text-lg ${editMode ? "" : "font-semibold"} transition-all`}
        >
          {props.name}
        </p>
        <p
          className={` ${editMode ? "text-neutral-900" : "text-neutral-500"} `}
        >
          Description
        </p>
        <p className="h-auto text-neutral-100">{props.description}</p>
      </div>
      <div className="flex items-center justify-end text-neutral-400 transition-all">
        <button
          className={`px-2 font-bold hover:text-neutral-50 ${!editMode ? "" : "hidden"}`}
        >
          copy
        </button>
        <button
          className={`px-2 font-bold hover:text-neutral-50 ${!editMode ? "" : "hidden"}`}
        >
          share
        </button>
        <button
          className={`px-2 font-bold hover:text-neutral-50 ${editMode ? "" : "hidden"}`}
        >
          cancel
        </button>
        <button
          className={`px-2 font-bold hover:text-neutral-50 ${editMode ? "" : ""}`}
          onClick={() => handleEditMode()}
        >
          {editMode ? "done" : "edit"}
        </button>
      </div>
    </div>
  );
}
