module.exports = {

"[project]/.next-internal/server/app/api/products/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/products/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'featured';
        const featured = searchParams.get('featured');
        // Base query
        const where = {
            isActive: true
        };
        // Kategori filtresi
        if (category && category !== 'all') {
            const categoryData = await prisma.category.findUnique({
                where: {
                    slug: category
                }
            });
            if (categoryData) {
                where.categoryId = categoryData.id;
            }
        }
        // Arama filtresi
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }
        // Öne çıkan ürünler filtresi
        if (featured === 'true') {
            where.isFeatured = true;
        }
        // Sıralama
        let orderBy = {};
        switch(sortBy){
            case 'price-low':
                orderBy = {
                    price: 'asc'
                };
                break;
            case 'price-high':
                orderBy = {
                    price: 'desc'
                };
                break;
            case 'newest':
                orderBy = {
                    createdAt: 'desc'
                };
                break;
            case 'name':
                orderBy = {
                    name: 'asc'
                };
                break;
            default:
                orderBy = [
                    {
                        isFeatured: 'desc'
                    },
                    {
                        createdAt: 'desc'
                    }
                ];
        }
        const products = await prisma.product.findMany({
            where,
            orderBy,
            include: {
                category: {
                    select: {
                        name: true,
                        slug: true
                    }
                },
                discounts: {
                    where: {
                        isActive: true,
                        startDate: {
                            lte: new Date()
                        },
                        endDate: {
                            gte: new Date()
                        }
                    }
                },
                reviews: {
                    select: {
                        rating: true
                    }
                }
            }
        });
        // Ürünleri frontend formatına çevir
        const formattedProducts = products.map((product)=>{
            const activeDiscount = product.discounts[0];
            const reviewsCount = product.reviews.length;
            const averageRating = reviewsCount > 0 ? product.reviews.reduce((sum, review)=>sum + review.rating, 0) / reviewsCount : 0;
            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: Number(product.price),
                originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                images: product.images,
                stock: product.stock,
                isActive: product.isActive,
                isFeatured: product.isFeatured,
                category: product.category.name,
                categorySlug: product.category.slug,
                rating: Math.round(averageRating * 10) / 10,
                reviews: reviewsCount,
                discount: activeDiscount ? activeDiscount.percentage : null,
                badgeText: activeDiscount?.badgeText || null,
                badgeColor: activeDiscount?.badgeColor || null,
                isNew: product.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: formattedProducts,
            count: formattedProducts.length
        });
    } catch (error) {
        console.error('Products API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Ürünler yüklenirken hata oluştu'
        }, {
            status: 500
        });
    } finally{
        await prisma.$disconnect();
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__7920dc6e._.js.map