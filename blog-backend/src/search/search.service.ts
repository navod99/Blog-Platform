import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, PostStatus } from '../post/schemas/post.schema';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async searchPosts(searchDto: SearchDto) {
    const {
      query,
      author,
      tags,
      page = 1,
      limit = 10,
    } = searchDto;

    const filter: any = {
      status: PostStatus.PUBLISHED, // Only search published posts
    };

    // Text search on title and content
    if (query) {
      filter.$text = { $search: query };
    }

    // Filter by author
    if (author) {
      filter.author = author;
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate('author', 'username firstName lastName avatar')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(filter),
    ]);

    return {
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}