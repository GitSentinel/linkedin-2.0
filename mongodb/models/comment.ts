import { IUser } from "@/types/user";
import mongoose, { Document, Schema, models } from "mongoose";

export interface ICommentBase {
    user: IUser;
    text: string;
}

export interface IComment extends Document, ICommentBase {
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<ICommentBase>(
    {
        user:{
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
    },
    {
        timestamps: true,
    }
);

export const Comment =
  mongoose.models.Comment ||
  mongoose.model<ICommentBase>("Comment", CommentSchema);
