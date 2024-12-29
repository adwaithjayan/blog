"use client"

import React, {useState} from 'react'
import {Key, Mail} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {loginUserAction} from "@/actions/login";


const schema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 chracters long." }),
});


const LoginForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:zodResolver(schema)
    });
    const {toast} = useToast();
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => formData.append(key, data[key]));
            const result = await loginUserAction(formData);
            if (result.success) {
                toast({
                    title: "Login successfull",
                    description: result.success,
                });
                router.push("/");
            } else {
                throw new Error(result.error || "Something wrong occured");
            }
        } catch (e) {
            console.log(e);
            toast({
                title: "Login failed",
                description: e.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
                <div className='relative'>
                    <Mail className='absolute top-2 left-3 h-5 w-5 text-gray-400'/>
                    <Input {...register('email')} placeholder='Email' disabled={isLoading}
                           className='pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'/>
                </div>
                <div className='relative'>
                    <Key className='absolute top-2 left-3 h-5 w-5 text-gray-400'/>
                    <Input {...register('password')} type='password' placeholder='Password' disabled={isLoading}
                           className='pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'/>
                </div>
            </div>
            <Button type='submit' disabled={isLoading}
                    className='w-full hover:bg-gray-800 mt-3 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105'>Login</Button>
        </form>
    )
}
export default LoginForm
