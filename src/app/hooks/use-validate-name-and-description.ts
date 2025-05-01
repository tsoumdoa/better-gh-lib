import { GhCardSchema } from "@/types";
import { useEffect, useState } from "react";

export const useValidateNameAndDescription = (
  name: string,
  description: string
) => {
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

  return isValid;
};
