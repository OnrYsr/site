module.exports = {

"[project]/.next-internal/server/app/api/categories/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[project]/src/app/api/categories/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
// Helper function to generate slug from name
function generateSlug(name) {
    return name.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const homepage = searchParams.get('homepage');
        // Base where condition
        const whereCondition = {};
        // If homepage=true parameter is passed, only show categories with showOnHomepage=true
        if (homepage === 'true') {
            whereCondition.showOnHomepage = true;
        }
        const categories = await prisma.category.findMany({
            where: whereCondition,
            include: {
                subcategories: {
                    where: {
                        isActive: true
                    },
                    include: {
                        _count: {
                            select: {
                                products: {
                                    where: {
                                        isActive: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: [
                        {
                            displayOrder: 'asc'
                        },
                        {
                            name: 'asc'
                        }
                    ]
                },
                _count: {
                    select: {
                        products: {
                            where: {
                                isActive: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                {
                    displayOrder: 'asc'
                },
                {
                    name: 'asc'
                }
            ]
        });
        const formattedCategories = categories.map((category)=>{
            // Ana kategoriler için product count hesapla: doğrudan bağlı + alt kategorilerdeki
            const subcategoriesProductCount = category.subcategories.reduce((total, sub)=>{
                return total + sub._count.products;
            }, 0);
            const totalProductCount = category._count.products + subcategoriesProductCount;
            return {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                image: category.image,
                parentId: category.parentId,
                displayOrder: category.displayOrder,
                isActive: category.isActive,
                productCount: totalProductCount,
                subcategories: category.subcategories.map((sub)=>({
                        id: sub.id,
                        name: sub.name,
                        slug: sub.slug,
                        description: sub.description,
                        image: sub.image,
                        parentId: sub.parentId,
                        displayOrder: sub.displayOrder,
                        isActive: sub.isActive,
                        productCount: sub._count.products,
                        createdAt: sub.createdAt,
                        updatedAt: sub.updatedAt
                    })),
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: formattedCategories,
            count: formattedCategories.length
        });
    } catch (error) {
        console.error('Categories API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Kategoriler yüklenirken hata oluştu'
        }, {
            status: 500
        });
    } finally{
        await prisma.$disconnect();
    }
}
async function POST(request) {
    try {
        const { name, description, image, parentId, displayOrder, isActive, showOnHomepage } = await request.json();
        // Validation
        if (!name?.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Kategori adı gereklidir'
            }, {
                status: 400
            });
        }
        // Validate displayOrder
        const orderValue = Number(displayOrder);
        if (isNaN(orderValue) || orderValue < 0 || orderValue > 999) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Gösterim sırası 0-999 arasında sayısal bir değer olmalıdır'
            }, {
                status: 400
            });
        }
        // Validate parent category if provided
        if (parentId) {
            const parentCategory = await prisma.category.findUnique({
                where: {
                    id: parentId
                }
            });
            if (!parentCategory) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Üst kategori bulunamadı'
                }, {
                    status: 400
                });
            }
        }
        // Generate slug
        const baseSlug = generateSlug(name);
        let slug = baseSlug;
        let counter = 1;
        // Check if slug exists and generate unique one
        while(await prisma.category.findUnique({
            where: {
                slug
            }
        })){
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        // Create category
        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                slug,
                description: description?.trim() || null,
                image: image?.trim() || null,
                parentId: parentId || null,
                displayOrder: orderValue,
                isActive: isActive !== undefined ? isActive : true,
                showOnHomepage: showOnHomepage !== undefined ? showOnHomepage : false
            },
            include: {
                subcategories: {
                    where: {
                        isActive: true
                    },
                    include: {
                        _count: {
                            select: {
                                products: {
                                    where: {
                                        isActive: true
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });
        const formattedCategory = {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            parentId: category.parentId,
            isActive: category.isActive,
            productCount: category._count.products,
            subcategories: category.subcategories.map((sub)=>({
                    id: sub.id,
                    name: sub.name,
                    slug: sub.slug,
                    description: sub.description,
                    image: sub.image,
                    parentId: sub.parentId,
                    isActive: sub.isActive,
                    productCount: sub._count.products,
                    createdAt: sub.createdAt,
                    updatedAt: sub.updatedAt
                })),
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Kategori başarıyla oluşturuldu',
            data: formattedCategory
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Create category error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Kategori oluşturulurken hata oluştu'
        }, {
            status: 500
        });
    } finally{
        await prisma.$disconnect();
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__5100b93b._.js.map