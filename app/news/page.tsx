import { getNewsList } from "@/app/_libs/microcms";
import NewsList from "@/app/_components/NewsList";

// export const revalidate = 60;

export default async function Page() {
  const { contents: news } = await getNewsList();

  return <NewsList news={news} />;
}
