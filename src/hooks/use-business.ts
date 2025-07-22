import { useState } from "react";

export const useBusiness = (initialBusinessId: string) => {
  const [businessId, setBusinessId] = useState(initialBusinessId);

  return { businessId, setBusinessId };
};
