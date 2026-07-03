import { notFound } from "next/navigation";
import Image from "next/image";
import { getPublicCatalogOrganizationId } from "@/lib/catalog/services/catalog-context-service";
import { getCatalogCmsPage } from "@/lib/catalog/services/cms-service";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CatalogCmsPage({
  params,
}: PageProps) {
  const organizationId =
    getPublicCatalogOrganizationId();

  if (!organizationId) {
    notFound();
  }

  const { slug } = await params;
  const page = await getCatalogCmsPage(
    organizationId,
    slug
  );

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <h1 className="text-4xl font-bold tracking-tight">
        {page.title}
      </h1>
      {page.banner_url && (
        <Image
          src={page.banner_url}
          alt={page.title}
          width={1200}
          height={525}
          unoptimized
          className="aspect-[16/7] w-full rounded-lg object-cover"
        />
      )}
      {page.content && (
        <article className="prose max-w-none">
          {page.content}
        </article>
      )}
    </main>
  );
}
