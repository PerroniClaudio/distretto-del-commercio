import { sanityFetch } from "@/sanity/lib/live";
import { PopulatedPost } from "@/types/post";
import { notFound } from "next/navigation";
import PostContent from "@/components/ui/PostContent";
import { NEWS_VISIBILITY_CONDITIONS } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<PopulatedPost | null> {
  const postQuery = `*[_type == "post" && slug.current == $slug  && ${NEWS_VISIBILITY_CONDITIONS}][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    category[]->{title},
    comuni[]->{title},
    publishedAt,
    image{
      asset->{
        _id,
        url
      },
      alt
    },
    files[]{
      _key,
      _type,
      title,
      asset->{
        _id,
        url,
        originalFilename
      }
    }
  }`;

  const { data: post } = await sanityFetch({
    query: postQuery,
    params: { slug },
  });

  return post;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}
