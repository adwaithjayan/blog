import HomeComponent from "@/components/home";
import {getBlogPostsAction} from "@/actions/blog";

export default async function Home() {
  const posts =await getBlogPostsAction();
  return (
      <HomeComponent posts={posts.posts} />
  );
}
