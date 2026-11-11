import { Suspense } from "react";
import { getNewsList } from "@/app/_libs/microcms";
import { NEWS_LIST_LIMIT } from "@/app/_constants";
import NewsList from "@/app/_components/NewsList";
import SearchField from "@/app/_components/SearchField";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default function Page({ searchParams }: Props) {
  return (
    <>
      <SearchField />
      <Suspense fallback={<p>読み込み中...</p>}>
        <SearchResult searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function SearchResult({ searchParams }: Pick<Props, "searchParams">) {
  const { q } = await searchParams;
  const { contents: news } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    q,
  });

  return <NewsList news={news} />;
}
