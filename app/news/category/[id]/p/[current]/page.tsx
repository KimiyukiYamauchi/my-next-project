import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategoryDetail, getNewsList } from "@/app/_libs/microcms";
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import { NEWS_LIST_LIMIT } from "@/app/_constants";

type Props = {
  params: Promise<{
    id: string;
    current: string;
  }>;
};

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <PagedNews params={params} />
    </Suspense>
  );
}

async function PagedNews({ params }: Pick<Props, "params">) {
  const { current, id } = await params;
  const currentNum = parseInt(current, 10);

  if (Number.isNaN(currentNum) || currentNum < 1) {
    notFound();
  }

  const category = await getCategoryDetail(id).catch(notFound);

  const { contents: news, totalCount } = await getNewsList({
    filters: `category[equals]${category.id}`,
    limit: NEWS_LIST_LIMIT,
    offset: NEWS_LIST_LIMIT * (currentNum - 1),
  });

  if (news.length === 0) {
    notFound();
  }

  return (
    <>
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        current={currentNum}
        basePath={`/news/category/${id}`}
      />
    </>
  );
}
