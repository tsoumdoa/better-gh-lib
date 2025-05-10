import { GhCardSchema } from "@/types/types";
import { useEffect, useState } from "react";

export const useValidateNameAndDescription = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    try {
      GhCardSchema.parse({ name: name, description: description });
      setIsValid(true);
    } catch {
      setIsValid(false);
      return;
    }
  }, [name, description]);

  return { name, setName, description, setDescription, isValid };
};
