"use client";

import { MessageCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {addCommentAction} from "@/actions/blogComment";


const schema = z.object({
    content: z.string().min(1, "Comment is required"),
});

export default function BlogDetails({post}) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(schema),
    });
    const { toast } = useToast();

    const onSubmit =async (data)=>{
        setIsLoading(true);
        try {
            const result = await addCommentAction({ ...data, postId: post._id });
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Comment added successfully",
                });
                reset();
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            toast({
                title: "Error",
                description: e.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <header className="mb-8">
                <h1 className='text-4xl font-bold mb-4'>{post?.title}</h1>
                <div className='flex items-center space-x-4'>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                            {post?.author?.name || ""}
                        </AvatarFallback>
                    </Avatar>
                    <div className=''>
                        <p className='text-xl font-medium'>{post?.author?.name}</p>
                    </div>
                    <div className='flex justify-between items-center my-8'>
                        <div className='flex space-x-4'>
                            <Button variant='ghost' size='sm'>
                                <MessageCircleIcon className='size-8'/>
                                {post?.comments?.length}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            {
                post?.coverImage && <img alt={post?.title} src={post?.coverImage} className='w-full h-96 object-cover rounded-lg mb-8'/>
            }
            <article className='prose lg:prose-xl'>
                <div dangerouslySetInnerHTML={{__html: post?.content}} />
            </article>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Textarea
                    placeholder="Add a comment..."
                    className="w-full my-4"
                    rows={4}
                    {...register("content")}
                />
                <Button type="submit" disabled={isLoading}>
                    Submit Comment
                </Button>
            </form>

            <div className='my-8 '>
                <h3 className='text-xl font-bold mb-4'>Comments {post?.comments.length}</h3>
                {
                    post?.comments?.map((comment, i) => (
                        <div className='border-b py-4' key={i}>
                            <div className={'flex items-center space-x-2 mb-2'}>
                                <Avatar>
                                    <AvatarFallback>{comment?.authorName[0]}</AvatarFallback>
                                </Avatar>
                                <p className='font-medium'>{comment.authorName}</p>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    ))
                }
            </div>

        </div>
)
}
