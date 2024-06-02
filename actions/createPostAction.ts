"use server"

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server"

export default async function createPostAction(formData: FormData) {
    const user = await currentUser()

    if(!user){
        throw new Error ("User not authenticated");
    }

    const postInput = formData.get("postInput") as string;
    const image = formData.get("image") as File;
    let imgUrl: string | undefined;

    if(!postInput) {
        throw new Error ("Please enter a post");
    }

    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
    };

    try {            
        if(image.size > 0) {
            
            const body : AddPostRequestBody = {
                user: userDB,
                text: postInput,
                imageUrl: imgUrl,
            };
            await Post.create(body);
        }else{
            const body : AddPostRequestBody = {
                user: userDB,
                text: postInput,
            };
            await Post.create(body);
        }
    } catch (error: any) {
        throw new Error("Failed to create post", error);
    }
}