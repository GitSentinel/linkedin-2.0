import { IUser } from "@/types/user";
import mongoose, {Schema, Document, models, Model} from "mongoose";
import { Comment, IComment, ICommentBase } from "./comment";
import { use } from "react";

export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl?: string;
    comments?: IComment[];
    likes?: string[];
}

export interface IPost extends Document, IPostBase {
    createdAt: Date;
    updatedAt: Date;
}

interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {};
interface IPostModel extends IPostStatics, Model<IPostDocument> {};

const PostSchema = new Schema<IPostDocument>({
    user: {
        userId: {
            type: String,
            required: true,
        },
        userImage: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
    },
    text: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    comments: {
        type: [Schema.Types.ObjectId], 
        ref: "Comment", 
        default: [],
    },
    likes: {
        type: [String]
    },
}, {
    timestamps: true,
});

PostSchema.methods.likePost = async function (userId: string) {
    try {
        await this.updateOne({ $addToSet: { likes: userId } });
    } catch (error) {
        throw new Error("Error liking post" + error);
    }
};

PostSchema.methods.unlikePost = async function (userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId } });
    } catch (error) {
        throw new Error("Error unliking post" + error);
    }
};

PostSchema.methods.removePost = async function () {
    try {
        await this.model("Post").deleteOne({ _id: this._id });
    } catch (error) {
        throw new Error("Error removing post: " + error);
    }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
    try {
        const comment = await Comment.create(commentToAdd);
        this.comment.push(comment._id);
    } catch (error) {
        throw new Error("Error commenting on post: " + error);
    }
};

PostSchema.methods.getAllComments = async function () {
    try {
        await this.populate({
            path: "comments",
            options: { sort: { createdAt: -1 } }, 
        });
        return this.comments;
    } catch (error) {
        throw new Error("Error getting comments: " + error);
    }
};

PostSchema.statics.getAllPosts = async function () {
    try {
        const posts = await this.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",
                options: {sort: { createdAt: -1 } },
        }).lean();

        return posts.map((post: IPostDocument) => ({
            ...posts,
            _id: post._id?.toString(),
            comments: post.comments?.map((comment: IComment) => ({
                ...comment,
                _id: comment._id?.toString(),
            }))
        }));
    } catch (error) {
        throw new Error("Error getting all posts: " + error);
    }
};

export const Post = 
    models.Post as IPostModel || 
    mongoose.model<IPostDocument, IPostModel>("Post", PostSchema); 