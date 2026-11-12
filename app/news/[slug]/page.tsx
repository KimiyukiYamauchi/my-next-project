import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getNewsDetail, getNewsList } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

export const revalidate = 60;

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk?: string;
  }>;
};

export async function generateStaticParams() {
  const { contents } = await getNewsList({ fields: "id", limit: 100 });
  return contents.map((news) => ({ slug: news.id }));
}

export default function Page({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <NewsDetail params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function NewsDetail({
  params,
  searchParams,
}: Pick<Props, "params" | "searchParams">) {
  const { slug } = await params;
  const { dk } = await searchParams;
  const data = await getNewsDetail(slug, {
    draftKey: dk,
  }).catch(notFound);

  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}
