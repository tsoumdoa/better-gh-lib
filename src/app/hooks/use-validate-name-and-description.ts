import { GhCardSchema } from "@/types/types";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

const mockAvailableTags = ["Display", "2D", "3D", "VR", "AR", "XR"];
const fuseOptions = {
  keys: [],
  includeScore: true,
  threshold: 0.4,
  ignoreLocation: true,
  ignoreCase: true,
};

export const useValidateNameDescriptionAndTags = (
  setAddError: (s: string) => void
) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const fuse = new Fuse(mockAvailableTags, fuseOptions);

  const handleAddTag = (tag: string) => {
    const trimedTag = tag.trim();

    if (trimedTag.length > 20) {
      setAddError("Tag is too long");
      setTimeout(() => {
        setAddError("");
      }, 900);
      return;
    }
    if (trimedTag.length === 0) {
      setAddError("Tag cannot be empty");
      setTimeout(() => {
        setAddError("");
      }, 900);
      return;
    }
    if (tags.includes(trimedTag)) {
      setAddError("Tag already exists");
      setTimeout(() => {
        setAddError("");
      }, 900);
      return;
    }
    if (trimedTag === " ") {
      setAddError("Tag cannot be empty");
      setTimeout(() => {
        setAddError("");
      }, 900);
      return;
    }
    // no special characters
    if (trimedTag.match(/[^\p{L}\p{N}]/u)) {
      setAddError("Tag cannot contain special characters");
      setTimeout(() => {
        setAddError("");
      }, 900);
      return;
    }
    setTags([...tags, trimedTag]);
    setTag("");
    setAvailableTags([]);
  };

  const deleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onTagValueChange = (t: string) => {
    setTag(t);
    const matches = fuse.search(t);
    const availableTags = matches.map((m) => m.item);

    //don't show it if it is already in tags
    const filteredAvailableTags = availableTags.filter(
      (t) => !tags.includes(t)
    );
    setAvailableTags(filteredAvailableTags);
  };

  useEffect(() => {
    try {
      GhCardSchema.parse({ name: name, description: description });
      setIsValid(true);
    } catch {
      setIsValid(false);
      return;
    }
  }, [name, description]);

  return {
    name,
    setName,
    description,
    setDescription,
    isValid,
    tag,
    setTag,
    tags,
    setTags,
    handleAddTag,
    deleteTag,
    onTagValueChange,
    availableTags,
    setAvailableTags,
  };
};
