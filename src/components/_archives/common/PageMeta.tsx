import { useEffect } from "react";

const PageMeta = ({
  title,
  description = "CuraKidney web dashboard management system",
}: {
  title: string;
  description?: string;
}) => {
  useEffect(() => {
    document.title = `${title} | CuraKidney Dashboard`;
    document
      .querySelector("meta[name='description']")
      ?.setAttribute("content", description);
  }, [title, description]);

  return <></>;
};

export default PageMeta;
