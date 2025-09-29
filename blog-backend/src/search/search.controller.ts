import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search posts by title, content, author, or tags' })
  @ApiResponse({
    status: 200,
    description: 'Returns search results',
    schema: {
      example: {
        posts: [
          {
            _id: '507f1f77bcf86cd799439011',
            title: 'JavaScript Tutorial',
            content: 'Content here...',
            author: {
              username: 'johndoe',
              firstName: 'John',
              lastName: 'Doe',
            },
            tags: ['javascript', 'tutorial'],
          },
        ],
        pagination: {
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3,
        },
      },
    },
  })
  searchPosts(@Query() searchDto: SearchDto) {
    return this.searchService.searchPosts(searchDto);
  }
}