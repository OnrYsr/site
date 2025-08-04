#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

// Production API'sinden veri çeken fonksiyon
async function fetchFromProduction(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `https://muse3dstudio.com/api${endpoint}`;
    console.log(`📡 Fetching: ${endpoint}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.success) {
            resolve(jsonData.data);
          } else {
            reject(new Error(`API Error: ${jsonData.error}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Veritabanını temizle
async function clearLocalDatabase() {
  console.log('🗑️  Local database temizleniyor...');
  
  try {
    // Sırayla temizle (foreign key constraints nedeniyle)
    await prisma.orderItem.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.discount.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    
    console.log('✅ Local database temizlendi');
  } catch (error) {
    console.error('❌ Database temizleme hatası:', error);
    throw error;
  }
}

// Kategorileri sync et
async function syncCategories(productionCategories) {
  console.log('📂 Kategoriler sync ediliyor...');
  
  // Ana kategorileri (parent olmayan) önce oluştur
  const parentCategories = productionCategories.filter(cat => !cat.parentId);
  const childCategories = productionCategories.filter(cat => cat.parentId);
  
  console.log(`📊 ${parentCategories.length} ana kategori, ${childCategories.length} alt kategori bulundu`);
  
  // Ana kategorileri oluştur
  for (const category of parentCategories) {
    try {
      await prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          displayOrder: category.displayOrder,
          isActive: category.isActive,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt)
        }
      });
      console.log(`✅ Ana kategori oluşturuldu: ${category.name}`);
    } catch (error) {
      console.error(`❌ Ana kategori hatası: ${category.name}`, error.message);
    }
  }
  
  // Alt kategorileri oluştur
  for (const category of childCategories) {
    try {
      await prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          parentId: category.parentId,
          displayOrder: category.displayOrder,
          isActive: category.isActive,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt)
        }
      });
      console.log(`✅ Alt kategori oluşturuldu: ${category.name}`);
    } catch (error) {
      console.error(`❌ Alt kategori hatası: ${category.name}`, error.message);
    }
  }
}

// Ürünleri sync et
async function syncProducts(productionProducts, categories) {
  console.log('🛍️  Ürünler sync ediliyor...');
  console.log(`📊 ${productionProducts.length} ürün bulundu`);
  
  // Kategori adını ID'ye çevirmek için mapping oluştur
  const categoryMap = new Map();
  categories.forEach(cat => {
    categoryMap.set(cat.name, cat.id);
  });
  
  for (const product of productionProducts) {
    try {
      // Kategori adından ID bul
      let categoryId = product.categoryId;
      if (!categoryId && product.category) {
        categoryId = categoryMap.get(product.category);
      }
      
      if (!categoryId) {
        console.log(`⚠️  Kategori bulunamadı: ${product.category} (${product.name})`);
        continue; // Bu ürünü atla
      }
      
      await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
          images: product.images || [],
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          categoryId: categoryId,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        }
      });
      console.log(`✅ Ürün oluşturuldu: ${product.name} → ${product.category}`);
    } catch (error) {
      console.error(`❌ Ürün hatası: ${product.name}`, error.message);
    }
  }
}

// Ana sync fonksiyonu
async function syncProductionData() {
  console.log('🚀 Production data sync başlıyor...\n');
  
  try {
    // 1. Production verilerini çek
    console.log('🔄 Production veriler çekiliyor...');
    const [categories, products] = await Promise.all([
      fetchFromProduction('/categories'),
      fetchFromProduction('/products')
    ]);
    
    console.log(`📊 ${categories.length} kategori, ${products.length} ürün çekildi\n`);
    
    // 2. Local database'i temizle
    await clearLocalDatabase();
    console.log('');
    
    // 3. Kategorileri sync et
    await syncCategories(categories);
    console.log('');
    
    // 4. Ürünleri sync et
    await syncProducts(products, categories);
    console.log('');
    
    console.log('🎉 Production data sync tamamlandı!');
    console.log(`✅ ${categories.length} kategori sync edildi`);
    console.log(`✅ ${products.length} ürün sync edildi`);
    
  } catch (error) {
    console.error('❌ Sync hatası:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Eğer doğrudan çalıştırılıyorsa sync'i başlat
if (require.main === module) {
  syncProductionData();
}

module.exports = { syncProductionData }; 