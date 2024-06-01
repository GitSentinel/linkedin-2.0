"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

function PostForm() {
    const ref = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const{ user } = useUser();

    const [ preview, setPreview ] = useState<string | null>(null);

  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;
    (ref.current as HTMLFormElement | null)?.reset();

    const text = formDataCopy.get("postInput") as string;
    if (!text.trim()) {
      throw new Error("You must provide a post input.");
    }

    setPreview(null);

    try {
        await createPostActivity(formDataCopy);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file){
            setPreview(URL.createObjectURL(file));
        }
    }

    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const imageUrl = user?.imageUrl;

  return (
    <div className="mb-2">
        <form 
            ref={ref} 
            action={formData => {
                handlePostAction(formData);
        }} className="p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2">
                <Avatar>
                    {user?.id ? (
                        <AvatarImage src={imageUrl}/>
                    ) : (
                        <AvatarImage src="https://github.com/shadn.png"/>
                    )}

                    <AvatarFallback>
                        {firstName?.charAt(0)}
                        {lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>  

                <input
                    type="text" 
                    placeholder="Start writing a post..."
                    name="postInput"
                    className="flex-1 outline-none rounded-full py-3 px-4 border"
                />

                <input 
                    ref={fileInputRef}
                    type="file" 
                    name="image"
                    accept="iamge/*"
                    hidden
                    onChange={handleImageChange}
                />

                <button type="submit" hidden>
                    Post
                </button>
            </div>

            {preview && (
                <div className="mt-3">
                    <img src={preview} alt="Preview" className="w-full object-cover" />
                </div>
            )}

            <div className="flex justify-end mt-2 space-x-2">
                <Button type="button" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="mr-2" size={16} color="currentColor" />
                    {preview ? "Change" : "Add"} Image
                </Button>

                {preview && (
                    <Button 
                        variant="outline"
                        type="button"
                        onClick={() => setPreview(null)}
                    >
                        <XIcon className="mr-2" size={16} color="currentColor" />
                        Remove Image
                    </Button>
                )}
            </div>
        </form>

        <hr className="mt-2 border-gray-300"/>
    </div>
  )
}

export default PostForm