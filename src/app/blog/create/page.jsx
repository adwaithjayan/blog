import CreateBlogForm from "@/components/blog/createBlog";
import {cookies} from "next/headers";
import {verifyAuth} from "@/lib/auth";

export default async function CreateBlog() {

    const token = (await cookies()).get('token')?.value;
    const user = await verifyAuth(token);

    return (
        <CreateBlogForm user={user} />
    )
}
