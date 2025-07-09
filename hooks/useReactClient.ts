import { useEffect, useState } from "react";

function useReactClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export default useReactClient;
