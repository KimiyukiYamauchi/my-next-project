import { Suspense } from "react";
import { getCategoryDetail, getNewsList } from "@/app/_libs/microcms";
import { notFound } from "next/navigation";
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import Category from "@/app/_components/Category";
import { NEWS_LIST_LIMIT } from "@/app/_constants";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <CategoryNews params={params} />
    </Suspense>
  );
}

async function CategoryNews({ params }: Pick<Props, "params">) {
  const { id } = await params;
  const category = await getCategoryDetail(id).catch(notFound);
  const { contents: news } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    filters: `category[equals]${category.id}`,
  });
  return (
    <>
      <p>
        <Category category={category} /> の一覧
      </p>
      <NewsList news={news} />
      <Pagination totalCount={news.length} basePath={`/news/category/${id}`} />
    </>
  );
}
