import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";

// Function to calculate reading time
const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200; // Average reading speed
    // Count words by splitting on whitespace and filtering out empty strings
    const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;
    // Calculate minutes and round up to nearest integer
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
};

export const createBlog = asyncHandler(async(req: any,res: any)=>{
    if(req.user.isAdmin !== true){
        return res.status(401).json({message:"Unauthorized"})
    }
    const {title,description,content,tags,coverImage} = req.body;
    
    if(!title || !description || !content || !tags || !coverImage){
        return res.status(400).json({message:"All fields are required"})
    }


    // Calculate reading time before creating the blog
    const readingTime = calculateReadingTime(content);

    const blog = await prisma.blog.create({
        data: {
            title,
            description,
            content,
            tags: {
                connect: tags.map((id: string) => ({
                    id
                }))
            },
            image_url: coverImage,
            slug: title.toLowerCase().replace(/ /g, '-'),
            readingTime: readingTime
        }
    })

    return res.status(200).json({
        success: true,
        message: 'Blog created successfully',
        data: blog
    })
})


export const getBlogs = asyncHandler(async (req: any, res: any) => {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Calculate skip value based on page and limit
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await prisma.blog.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        include:{
            tags: true
        }
    });

    // Optional: Get total count for pagination metadata
    const totalBlogs = await prisma.blog.count();
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
});


export const getBlogById = asyncHandler(async (req: any, res: any) => {
    const { id } = req.params;
    
    // Fetch blog by ID
    const blog = await prisma.blog.findUnique({
        where: {
            id
        },
        include:{
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
});


export const updateBlog = asyncHandler(async(req :any,res :any)=>{
    const {id} = req.params;
    const {title,description,content,tags,coverImage} = req.body;

    const blog = await prisma.blog.findUnique({
        where: {
            id
        },
        include: {
            tags: true // Include existing tags
        }
    });

    if(!blog){
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }

    const existingTagLabels = blog.tags.map((tag: any) => tag.label);
    const newTagsToAdd = tags.filter((tag: string) => !existingTagLabels.includes(tag));

    const updatedBlog = await prisma.blog.update({
        where: {
            id
        },
        data: {
            title,
            description,
            content,
            readingTime: calculateReadingTime(content),
            tags: {
                create: newTagsToAdd.map((tag: string) => ({
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
})

export const deleteBlog = asyncHandler(async(req :any,res :any)=>{
    const {id} = req.params;
    const blog = await prisma.blog.findUnique({
        where: {
            id
        }
    });
    if(!blog){
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    await prisma.blog.delete({
        where: {
            id
        }
    });
    return res.status(200).json({
        success: true,
        message: 'Blog deleted successfully'
    });
})


export const hideBlog = asyncHandler(async(req :any,res :any)=>{
    const {id} = req.params;
    console.log(id);
    
    const blog = await prisma.blog.findUnique({
        where: {
            id
        }
    });
    if(!blog){
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    await prisma.blog.update({
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
})

export const unhideBlog = asyncHandler(async(req :any,res :any)=>{
    const {id} = req.params;
    const blog = await prisma.blog.findUnique({
        where: {
            id
        }
    });
    if(!blog){
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }
    await prisma.blog.update({
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
})



export const publicBlogs = asyncHandler(async (req: any, res: any) => {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Calculate skip value based on page and limit
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await prisma.blog.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        where:{
            isHidden: false
        },
        include:{
            tags: true
        }
    });

    // Optional: Get total count for pagination metadata
    const totalBlogs = await prisma.blog.count();
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
});


export const getBlogBySlug = asyncHandler(async (req: any, res: any) => {
    const { slug } = req.params;
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch current blog
    const blog = await prisma.blog.findFirst({
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
    const totalBlogs = await prisma.blog.count({
        where: {
            isHidden: false
        }
    });

    // Find next blog
    const nextBlog = await prisma.blog.findFirst({
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
    const previousBlog = await prisma.blog.findFirst({
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
            next: hasNext ? `/api/blogs/${nextBlog?.slug}` : null,
            previous: hasPrevious ? `/api/blogs/${previousBlog?.slug}` : null,
            hasNext: hasNext,
            hasPrevious: hasPrevious
        }
    });
});


export const createTag = asyncHandler(async(req: any,res: any)=>{
    if(req.user.isAdmin !== true){
        return res.status(401).json({message:"Unauthorized"})
    }
    const {label} = req.body;
    if(!label){
        return res.status(400).json({message:"Label is required"})
    }
    const existTag = await prisma.tag.findFirst({
        where: {
            label
        }
    })
    if(existTag){
        return res.status(400).json({message:"Tag already exists"})
    }
    const tag = await prisma.tag.create({
        data: {
            label
        }
    })
    return res.status(200).json({
        success: true,
        message: 'Tag created successfully',
        data: tag
    })
})

export const updateTag = asyncHandler(async(req: any,res: any)=>{
    if(req.user.isAdmin !== true){
        return res.status(401).json({message:"Unauthorized"})
    }
    const {label} = req.body;
    if(!label){
        return res.status(400).json({message:"Label is required"})
    }
    const tag = await prisma.tag.update({
        where: {
            id: req.params.id
        },
        data: {
            label
        }
    })
    return res.status(200).json({
        success: true,
        message: 'Tag updated successfully',
        data: tag
    })
})

export const deleteTag = asyncHandler(async(req: any,res: any)=>{
    if(req.user.isAdmin !== true){
        return res.status(401).json({message:"Unauthorized"})
    }
    const tag = await prisma.tag.delete({
        where: {
            id: req.params.id
        }
    })
    return res.status(200).json({
        success: true,
        message: 'Tag deleted successfully',
        data: tag
    })
})

export const getTags = asyncHandler(async(req: any,res: any)=>{
    const tags = await prisma.tag.findMany();
    return res.status(200).json({
        success: true,
        message: 'Tags fetched successfully',
        data: tags
    })
})


export const deleteAllTags = asyncHandler(async(req: any,res: any)=>{
    if(req.user.isAdmin !== true){
        return res.status(401).json({message:"Unauthorized"})
    }
    const tags = await prisma.tag.deleteMany();
    return res.status(200).json({
        success: true,
        message: 'All tags deleted successfully',
        data: tags
    })
})

    