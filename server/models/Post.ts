import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  id: string;
  userName: string;
  userRole?: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface IPost extends Document {
  title: string;
  category: string;
  author: string;
  authorRole: string;
  authorId?: mongoose.Types.ObjectId;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string[];
  viewsCount: number;
  reactions: {
    like: number;
    heart: number;
    haha: number;
    wow: number;
    sad: number;
  };
  comments: IComment[];
  isFeatured?: boolean;
  isSubFeatured?: boolean;
  status: 'published' | 'draft' | 'scheduled';
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<any>(
  {
    id: { type: String, required: true },
    author: { type: String, default: 'Bạn đọc' },
    userName: { type: String, default: function(this: any) { return this.author || 'Bạn đọc'; } },
    role: { type: String, default: 'Độc giả Phenikaa' },
    userRole: { type: String, default: function(this: any) { return this.role || 'Độc giả Phenikaa'; } },
    avatarUrl: { type: String, default: '' },
    text: { type: String, default: '' },
    content: { type: String, default: function(this: any) { return this.text || ''; } },
    createdAt: { type: String, default: () => new Date().toISOString() },
    likes: { type: Number, default: 0 },
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề bài viết là bắt buộc'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Chuyên mục là bắt buộc'],
      index: true,
    },
    author: {
      type: String,
      required: [true, 'Tác giả là bắt buộc'],
    },
    authorRole: {
      type: String,
      default: 'Ban Biên Tập Phenikaa',
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedAt: {
      type: String,
      default: () => 'Vừa xong',
    },
    readTime: {
      type: String,
      default: '3 phút đọc',
    },
    excerpt: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    },
    content: {
      type: String,
      required: [true, 'Nội dung bài viết là bắt buộc'],
    },
    tags: {
      type: [String],
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    reactions: {
      like: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
      haha: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
    },
    comments: {
      type: [CommentSchema],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isSubFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'scheduled'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Full text search index
PostSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

export const Post = mongoose.model<IPost>('Post', PostSchema);
