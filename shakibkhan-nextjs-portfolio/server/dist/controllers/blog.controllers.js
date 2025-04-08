"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllTags = exports.getTags = exports.deleteTag = exports.updateTag = exports.createTag = exports.getBlogBySlug = exports.publicBlogs = exports.unhideBlog = exports.hideBlog = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getBlogs = exports.createBlog = void 0;
const prisma_1 = require("../services/prisma");
const asyncHandler_1 = require("../utils/asyncHandler");
// Function to calculate reading time
const calculateReadingTime = (content) => {
    const wordsPerMinute = 200; // Average reading speed
    // Count words by splitting on whitespace and filtering out empty strings
    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
    // Calculate minutes and round up to nearest integer
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
};
exports.createBlog = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin !== true) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description, content, tags, coverImage } = req.body;
    if (!title || !description || !content || !tags || !coverImage) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Calculate reading time before creating the blog
    const readingTime = calculateReadingTime(content);
    const blog = yield prisma_1.prisma.blog.create({
        data: {
            title,
            description,
            content,
            tags: {
                connect: tags.map((id) => ({
                    id
                }))
            },
            image_url: coverImage,
            slug: title.toLowerCase().replace(/ /g, '-'),
            readingTime: readingTime
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Blog created successfully',
        data: blog
    });
}));
exports.getBlogs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Calculate skip value based on page and limit
    const skip = (page - 1) * limit;
    // Fetch blogs with pagination
    const blogs = yield prisma_1.prisma.blog.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            tags: true
        }
    });
    // Optional: Get total count for pagination metadata
    const totalBlogs = yield prisma_1.prisma.blog.count();
    const totalPages = Math.ceil(totalBlogs / limit);
    return res.status(200).json({
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs,
        pagination: {
            currentPage: page,
            limit: limit,
            totalBlogs: totalBlogs,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        },
        links: {
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
            first: `${req.protocol}://${req.get('host')}${req.originalUrl}?page=1`,
            prev: page > 1 ? `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${page - 1}` : null,
            next: page < totalPages ? `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${page + 1}` : null,
            last: `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${totalPages}`
        }
    });
}));
exports.getBlogById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Fetch blog by ID
    const blog = yield prisma_1.prisma.blog.findUnique({
        where: {
            id
        },
        include: {
            tags: true
        }
    });
    if (!blog) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Blog fetched successfully',
        data: blog
    });
}));
exports.updateBlog = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, content, tags, coverImage } = req.body;
    const blog = yield prisma_1.prisma.blog.findUnique({
        where: {
            id
        },
        include: {
            tags: true // Include existing tags
        }
    });
    if (!blog) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    const existingTagLabels = blog.tags.map((tag) => tag.label);
    const newTagsToAdd = tags.filter((tag) => !existingTagLabels.includes(tag));
    const updatedBlog = yield prisma_1.prisma.blog.update({
        where: {
            id
        },
        data: {
            title,
            description,
            content,
            readingTime: calculateReadingTime(content),
            tags: {
                create: newTagsToAdd.map((tag) => ({
                    label: tag
                }))
            },
            image_url: coverImage
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        data: updatedBlog
    });
}));
exports.deleteBlog = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const blog = yield prisma_1.prisma.blog.findUnique({
        where: {
            id
        }
    });
    if (!blog) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    yield prisma_1.prisma.blog.delete({
        where: {
            id
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Blog deleted successfully'
    });
}));
exports.hideBlog = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    const blog = yield prisma_1.prisma.blog.findUnique({
        where: {
            id
        }
    });
    if (!blog) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    yield prisma_1.prisma.blog.update({
        where: {
            id
        },
        data: {
            isHidden: true
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Blog hidden successfully'
    });
}));
exports.unhideBlog = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const blog = yield prisma_1.prisma.blog.findUnique({
        where: {
            id
        }
    });
    if (!blog) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    yield prisma_1.prisma.blog.update({
        where: {
            id
        },
        data: {
            isHidden: false
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Blog unhidden successfully'
    });
}));
exports.publicBlogs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Calculate skip value based on page and limit
    const skip = (page - 1) * limit;
    // Fetch blogs with pagination
    const blogs = yield prisma_1.prisma.blog.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        where: {
            isHidden: false
        },
        include: {
            tags: true
        }
    });
    // Optional: Get total count for pagination metadata
    const totalBlogs = yield prisma_1.prisma.blog.count();
    const totalPages = Math.ceil(totalBlogs / limit);
    return res.status(200).json({
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs,
        pagination: {
            currentPage: page,
            limit: limit,
            totalBlogs: totalBlogs,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        },
        links: {
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
            first: `${req.protocol}://${req.get('host')}${req.originalUrl}?page=1`,
            prev: page > 1 ? `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${page - 1}` : null,
            next: page < totalPages ? `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${page + 1}` : null,
            last: `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${totalPages}`
        }
    });
}));
exports.getBlogBySlug = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Fetch current blog
    const blog = yield prisma_1.prisma.blog.findFirst({
        where: {
            slug: slug,
            isHidden: false
        },
        include: {
            tags: true
        }
    });
    if (!blog) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    // Get total count of blogs for pagination
    const totalBlogs = yield prisma_1.prisma.blog.count({
        where: {
            isHidden: false
        }
    });
    // Find next blog
    const nextBlog = yield prisma_1.prisma.blog.findFirst({
        where: {
            isHidden: false,
            createdAt: {
                gt: blog.createdAt
            }
        },
        orderBy: {
            createdAt: 'asc'
        },
        select: {
            slug: true
        }
    });
    // Find previous blog
    const previousBlog = yield prisma_1.prisma.blog.findFirst({
        where: {
            isHidden: false,
            createdAt: {
                lt: blog.createdAt
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            slug: true
        }
    });
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalBlogs / limit);
    const hasNext = nextBlog !== null;
    const hasPrevious = previousBlog !== null;
    return res.status(200).json({
        success: true,
        message: 'Blog fetched successfully',
        data: blog,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalBlogs,
            itemsPerPage: limit
        },
        links: {
            next: hasNext ? `/api/blogs/${nextBlog === null || nextBlog === void 0 ? void 0 : nextBlog.slug}` : null,
            previous: hasPrevious ? `/api/blogs/${previousBlog === null || previousBlog === void 0 ? void 0 : previousBlog.slug}` : null,
            hasNext: hasNext,
            hasPrevious: hasPrevious
        }
    });
}));
exports.createTag = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin !== true) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { label } = req.body;
    if (!label) {
        return res.status(400).json({ message: "Label is required" });
    }
    const existTag = yield prisma_1.prisma.tag.findFirst({
        where: {
            label
        }
    });
    if (existTag) {
        return res.status(400).json({ message: "Tag already exists" });
    }
    const tag = yield prisma_1.prisma.tag.create({
        data: {
            label
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Tag created successfully',
        data: tag
    });
}));
exports.updateTag = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin !== true) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { label } = req.body;
    if (!label) {
        return res.status(400).json({ message: "Label is required" });
    }
    const tag = yield prisma_1.prisma.tag.update({
        where: {
            id: req.params.id
        },
        data: {
            label
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Tag updated successfully',
        data: tag
    });
}));
exports.deleteTag = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin !== true) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const tag = yield prisma_1.prisma.tag.delete({
        where: {
            id: req.params.id
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Tag deleted successfully',
        data: tag
    });
}));
exports.getTags = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield prisma_1.prisma.tag.findMany();
    return res.status(200).json({
        success: true,
        message: 'Tags fetched successfully',
        data: tags
    });
}));
exports.deleteAllTags = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin !== true) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const tags = yield prisma_1.prisma.tag.deleteMany();
    return res.status(200).json({
        success: true,
        message: 'All tags deleted successfully',
        data: tags
    });
}));
