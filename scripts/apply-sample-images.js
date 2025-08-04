#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Örnek görsel mappingleri
const SAMPLE_IMAGES = {
  categories: {
    'ev-dekorasyon': '/examples/categories/ev-dekorasyon-400x300.svg',
    'mutfak': '/examples/categories/mutfak-400x300.svg',
    'gunluk-yasam-hediyelik': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg'
  },
  products: {
    'ev-dekorasyon': [
      '/examples/products/ev-dekorasyon-800x800.svg'
    ],
    'mutfak': [
      '/examples/products/mutfak-kurabiye-kalibi-800x800.svg'
    ],
    'gunluk-yasam-hediyelik': [
      '/examples/products/gunluk-yasam-anahtarlik-800x800.svg'
    ]
  },
  banners: [
    '/examples/banners/hero-banner-desktop-1920x500.svg',
    '/examples/banners/hero-banner-mobile-768x400.svg'
  ]
};

// Kategorileri güncelle
async function updateCategoryImages() {
  console.log('📂 Kategori görselleri güncelleniyor...');
  
  for (const [slug, imagePath] of Object.entries(SAMPLE_IMAGES.categories)) {
    try {
      const result = await prisma.category.updateMany({
        where: { slug: slug },
        data: { image: imagePath }
      });
      
      if (result.count > 0) {
        console.log(`✅ Kategori güncellendi: ${slug} → ${imagePath}`);
      } else {
        console.log(`⚠️  Kategori bulunamadı: ${slug}`);
      }
    } catch (error) {
      console.error(`❌ Kategori güncelleme hatası: ${slug}`, error.message);
    }
  }
}

// Ürünleri güncelle
async function updateProductImages() {
  console.log('🛍️  Ürün görselleri güncelleniyor...');
  
  // Her kategoriden birkaç ürün al ve güncelle
  for (const [categorySlug, images] of Object.entries(SAMPLE_IMAGES.products)) {
    try {
      // Kategoriyi bul
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug }
      });
      
      if (!category) {
        console.log(`⚠️  Kategori bulunamadı: ${categorySlug}`);
        continue;
      }
      
      // Bu kategorideki ürünleri al (ilk 3 ürün)
      const products = await prisma.product.findMany({
        where: { categoryId: category.id },
        take: 3
      });
      
      // Her ürüne farklı görseller ata
      for (let i = 0; i < products.length && i < images.length; i++) {
        const product = products[i];
        const imagePath = images[i % images.length]; // Döngüsel atama
        
        await prisma.product.update({
          where: { id: product.id },
          data: { 
            images: [imagePath] // Mevcut görselleri değiştir
          }
        });
        
        console.log(`✅ Ürün güncellendi: ${product.name} → ${imagePath}`);
      }
      
      // Eğer kategoride daha fazla ürün varsa, onlara da görseller ata
      const remainingProducts = await prisma.product.findMany({
        where: { 
          categoryId: category.id,
          NOT: {
            id: { in: products.slice(0, images.length).map(p => p.id) }
          }
        },
        take: 5
      });
      
      for (const product of remainingProducts) {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        
        await prisma.product.update({
          where: { id: product.id },
          data: { 
            images: [randomImage]
          }
        });
        
        console.log(`✅ Ürün güncellendi (rastgele): ${product.name} → ${randomImage}`);
      }
      
    } catch (error) {
      console.error(`❌ Ürün güncelleme hatası: ${categorySlug}`, error.message);
    }
  }
}

// Alt kategori ürünlerini güncelle
async function updateSubcategoryProducts() {
  console.log('🔗 Alt kategori ürünleri güncelleniyor...');
  
  // Alt kategorilerdeki ürünleri de güncelle
  const subcategoryMappings = {
    'kurabiye-kalibi': '/examples/products/mutfak-kurabiye-kalibi-800x800.svg',
    'anahtarlik': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
    'saksi-vazo': '/examples/products/ev-dekorasyon-800x800.svg'
  };
  
  for (const [slug, imagePath] of Object.entries(subcategoryMappings)) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug: slug }
      });
      
      if (!category) continue;
      
      const products = await prisma.product.findMany({
        where: { categoryId: category.id },
        take: 5
      });
      
      for (const product of products) {
        await prisma.product.update({
          where: { id: product.id },
          data: { 
            images: [imagePath]
          }
        });
        
        console.log(`✅ Alt kategori ürünü güncellendi: ${product.name} → ${imagePath}`);
      }
      
    } catch (error) {
      console.error(`❌ Alt kategori güncelleme hatası: ${slug}`, error.message);
    }
  }
}

// Banner'ları oluştur/güncelle
async function createSampleBanners() {
  console.log('🎨 Örnek banner\'lar oluşturuluyor...');
  
  try {
    // Mevcut banner'ları temizle
    await prisma.banner.deleteMany();
    
    // Desktop banner
    await prisma.banner.create({
      data: {
        title: '3D Tasarım Koleksiyonu',
        subtitle: 'En kaliteli 3D modeller ve yaratıcı tasarımlar',
        image: '/examples/banners/hero-banner-desktop-1920x500.svg',
        link: '/products',
        type: 'HERO',
        isActive: true,
        order: 1
      }
    });
    
    // Mobile banner
    await prisma.banner.create({
      data: {
        title: 'Yaratıcı 3D Tasarımlar',
        subtitle: 'Mobile için optimize edilmiş',
        image: '/examples/banners/hero-banner-mobile-768x400.svg',
        link: '/products',
        type: 'FEATURED_PRODUCTS',
        isActive: true,
        order: 2
      }
    });
    
    console.log('✅ Banner\'lar oluşturuldu');
    
  } catch (error) {
    console.error('❌ Banner oluşturma hatası:', error.message);
  }
}

// Ana fonksiyon
async function applySampleImages() {
  console.log('🎨 Örnek görseller uygulanıyor...\n');
  
  try {
    await updateCategoryImages();
    console.log('');
    
    await updateProductImages();
    console.log('');
    
    await updateSubcategoryProducts();
    console.log('');
    
    await createSampleBanners();
    console.log('');
    
    console.log('🎉 Örnek görseller başarıyla uygulandı!');
    console.log('📊 İstatistikler:');
    
    // İstatistikleri göster
    const categoryCount = await prisma.category.count({
      where: { image: { not: null } }
    });
    
    const productCount = await prisma.product.count({
      where: { 
        images: { isEmpty: false }
      }
    });
    
    const bannerCount = await prisma.banner.count();
    
    console.log(`✅ ${categoryCount} kategori görseli güncellendi`);
    console.log(`✅ ${productCount} ürün görseli güncellendi`);
    console.log(`✅ ${bannerCount} banner oluşturuldu`);
    
  } catch (error) {
    console.error('❌ Genel hata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Script doğrudan çalıştırılıyorsa
if (require.main === module) {
  applySampleImages();
}

module.exports = { applySampleImages }; 