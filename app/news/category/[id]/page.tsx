import { Suspense } from "react";
import { getNewsList } from "@/app/_libs/microcms";
import NewsList from "@/app/_components/NewsList";

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
  const { contents: news } = await getNewsList({
    filters: `category[equals]${id}`,
  });
  return <NewsList news={news} />;
}
