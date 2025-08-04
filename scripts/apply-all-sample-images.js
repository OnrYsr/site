#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Kategori bazında görsel mapping
const CATEGORY_IMAGE_MAPPING = {
  // Ana kategoriler
  'Ev Dekorasyon': '/examples/products/ev-dekorasyon-800x800.svg',
  'Mutfak': '/examples/products/mutfak-kurabiye-kalibi-800x800.svg',
  'Günlük Yaşam & Hediyelik': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  
  // Alt kategoriler - Ev Dekorasyon
  'Figür - Objeler': '/examples/products/ev-dekorasyon-800x800.svg',
  'Saksı & Vazo': '/examples/products/ev-dekorasyon-800x800.svg',
  'Aydınlatma': '/examples/products/ev-dekorasyon-800x800.svg',
  'Duvar Dekorasyonu': '/examples/products/ev-dekorasyon-800x800.svg',
  'Masa Aksesuarları': '/examples/products/ev-dekorasyon-800x800.svg',
  
  // Alt kategoriler - Mutfak
  'Kurabiye Kalıbı': '/examples/products/mutfak-kurabiye-kalibi-800x800.svg',
  'Mutfak Aksesuarları': '/examples/products/mutfak-kurabiye-kalibi-800x800.svg',
  'Kek Kalıbı': '/examples/products/mutfak-kurabiye-kalibi-800x800.svg',
  'Bardak Altlığı': '/examples/products/mutfak-kurabiye-kalibi-800x800.svg',
  
  // Alt kategoriler - Günlük Yaşam
  'Anahtarlık': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  'Telefon Aksesuarları': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  'Oyuncak & Hobi': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  'Kişisel Aksesuarlar': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  'Hediyelik Eşya': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  
  // Alt kategoriler - Diğer
  'Raf & Kitap Ayracı': '/examples/products/ev-dekorasyon-800x800.svg',
  'Araba Aksesuarları': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  'Spor & Aktivite': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  'Mobilya Aksesuarları': '/examples/products/ev-dekorasyon-800x800.svg',
  'Bahçe & Dış Mekan': '/examples/products/ev-dekorasyon-800x800.svg',
  'Takı & Süs': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg',
  'Çanta & Valiz': '/examples/products/gunluk-yasam-anahtarlik-800x800.svg'
};

// Fallback için default görsel
const DEFAULT_IMAGE = '/examples/products/ev-dekorasyon-800x800.svg';

async function updateAllProductImages() {
  console.log('🛍️  Tüm ürünlere örnek görseller ekleniyor...\n');
  
  try {
    // Tüm ürünleri al
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        images: true
      }
    });
    
    console.log(`📊 Toplam ${products.length} ürün bulundu`);
    
    let updatedCount = 0;
    let alreadyHasExamplesCount = 0;
    
    for (const product of products) {
      try {
        // Eğer zaten örnek görsel varsa geç
        const hasExampleImages = product.images.some(img => img.startsWith('/examples'));
        if (hasExampleImages) {
          alreadyHasExamplesCount++;
          continue;
        }
        
        // Kategoriye uygun görseli bul
        const categoryImage = CATEGORY_IMAGE_MAPPING[product.category] || DEFAULT_IMAGE;
        
        // Mevcut görselleri koru, örnek görseli başa ekle
        const newImages = [categoryImage, ...product.images];
        
        await prisma.product.update({
          where: { id: product.id },
          data: { images: newImages }
        });
        
        updatedCount++;
        console.log(`✅ ${product.name} (${product.category}) → ${categoryImage.split('/').pop()}`);
        
      } catch (error) {
        console.error(`❌ ${product.name} güncelleme hatası:`, error.message);
      }
    }
    
    console.log('\n🎉 İşlem tamamlandı!');
    console.log(`✅ ${updatedCount} ürüne örnek görsel eklendi`);
    console.log(`ℹ️  ${alreadyHasExamplesCount} üründe zaten örnek görsel vardı`);
    console.log(`📊 Toplam işlenen: ${products.length} ürün`);
    
  } catch (error) {
    console.error('❌ Genel hata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Kategori istatistikleri göster
async function showCategoryStats() {
  console.log('\n📊 Kategori İstatistikleri:');
  
  try {
    const stats = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });
    
    for (const stat of stats) {
      const productsWithExamples = await prisma.product.count({
        where: {
          category: stat.category,
          images: {
            hasSome: ['/examples/products/ev-dekorasyon-800x800.svg', '/examples/products/mutfak-kurabiye-kalibi-800x800.svg', '/examples/products/gunluk-yasam-anahtarlik-800x800.svg']
          }
        }
      });
      
      const imageType = CATEGORY_IMAGE_MAPPING[stat.category] ? CATEGORY_IMAGE_MAPPING[stat.category].split('/').pop() : 'default';
      console.log(`${stat.category}: ${productsWithExamples}/${stat._count.id} ürün → ${imageType}`);
    }
    
  } catch (error) {
    console.error('❌ İstatistik hatası:', error);
  }
}

// Ana fonksiyon
async function main() {
  console.log('🎨 Tüm ürünlere örnek görseller ekleniyor...\n');
  
  await updateAllProductImages();
  await showCategoryStats();
  
  console.log('\n✨ Artık tüm ürünlerde örnek görseller var!');
  console.log('🌐 Anasayfaya git: http://localhost:3000');
}

// Script doğrudan çalıştırılıyorsa
if (require.main === module) {
  main();
}

module.exports = { updateAllProductImages, showCategoryStats }; 