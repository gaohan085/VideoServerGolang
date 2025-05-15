import { useEffect, useRef } from "react";

const useTitle = (title: string) => {
  const docDefined = typeof document !== "undefined";
  const originalTitle = useRef(docDefined ? document.title : null);

  useEffect(() => {
    if (!docDefined) return;
    if (document.title !== title) document.title = title;

    const currentTitle = originalTitle.current!;

    return () => {
      document.title = currentTitle;
    };
  }, [docDefined, title]);
};

export default useTitle;
