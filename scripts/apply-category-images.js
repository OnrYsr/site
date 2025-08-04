#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Kategori görsel mappingleri - her kategori için uygun görsel
const CATEGORY_IMAGE_MAPPING = {
  // Ana kategoriler
  'ev-dekorasyon': '/examples/categories/ev-dekorasyon-400x300.svg',
  'mutfak': '/examples/categories/mutfak-400x300.svg',
  'gunluk-yasam-hediyelik': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  
  // Alt kategoriler - Ev Dekorasyon temalı
  'figur-objeler': '/examples/categories/ev-dekorasyon-400x300.svg',
  'saksi-vazo': '/examples/categories/ev-dekorasyon-400x300.svg', 
  'aydinlatma': '/examples/categories/ev-dekorasyon-400x300.svg',
  'duvar-dekorasyonu': '/examples/categories/ev-dekorasyon-400x300.svg',
  'masa-aksesuarlari': '/examples/categories/ev-dekorasyon-400x300.svg',
  'raf-kitap-ayraci': '/examples/categories/ev-dekorasyon-400x300.svg',
  'mobilya-aksesuarlari': '/examples/categories/ev-dekorasyon-400x300.svg',
  'bahce-dis-mekan': '/examples/categories/ev-dekorasyon-400x300.svg',
  
  // Alt kategoriler - Mutfak temalı  
  'kurabiye-kalibi': '/examples/categories/mutfak-400x300.svg',
  'mutfak-aksesuarlari': '/examples/categories/mutfak-400x300.svg',
  'kek-kalibi': '/examples/categories/mutfak-400x300.svg',
  'bardak-altligi': '/examples/categories/mutfak-400x300.svg',
  
  // Alt kategoriler - Günlük yaşam temalı
  'anahtarlik': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  'telefon-aksesuarlari': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  'oyuncak-hobi': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  'kisisel-aksesuarlar': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  'hediyelik-esya': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  'araba-aksesuarlari': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  'spor-aktivite': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  'taki-sus': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg',
  'canta-valiz': '/examples/categories/gunluk-yasam-hediyelik-400x300.svg'
};

// Fallback görsel
const DEFAULT_IMAGE = '/examples/categories/ev-dekorasyon-400x300.svg';

async function updateAllCategoryImages() {
  console.log('📂 Tüm kategorilere görseller ekleniyor...\n');
  
  try {
    // Tüm kategorileri al
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true
      }
    });
    
    console.log(`📊 Toplam ${categories.length} kategori bulundu`);
    
    let updatedCount = 0;
    let alreadyHasImageCount = 0;
    
    for (const category of categories) {
      try {
        // Eğer zaten görsel varsa geç
        if (category.image && category.image.startsWith('/examples')) {
          alreadyHasImageCount++;
          console.log(`ℹ️  ${category.name} → Zaten görsel var`);
          continue;
        }
        
        // Slug'a uygun görseli bul
        const categoryImage = CATEGORY_IMAGE_MAPPING[category.slug] || DEFAULT_IMAGE;
        
        await prisma.category.update({
          where: { id: category.id },
          data: { image: categoryImage }
        });
        
        updatedCount++;
        console.log(`✅ ${category.name} (${category.slug}) → ${categoryImage.split('/').pop()}`);
        
      } catch (error) {
        console.error(`❌ ${category.name} güncelleme hatası:`, error.message);
      }
    }
    
    console.log('\n🎉 İşlem tamamlandı!');
    console.log(`✅ ${updatedCount} kategoriye görsel eklendi`);
    console.log(`ℹ️  ${alreadyHasImageCount} kategoride zaten görsel vardı`);
    console.log(`📊 Toplam işlenen: ${categories.length} kategori`);
    
  } catch (error) {
    console.error('❌ Genel hata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Kategori görsel istatistikleri göster
async function showCategoryImageStats() {
  console.log('\n📊 Kategori Görsel İstatistikleri:');
  
  try {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        image: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    const withImages = categories.filter(cat => cat.image && cat.image.startsWith('/examples'));
    const withoutImages = categories.filter(cat => !cat.image || !cat.image.startsWith('/examples'));
    
    console.log(`\n✅ Görseli olan kategoriler (${withImages.length}):`);
    withImages.forEach(cat => {
      const imageType = cat.image ? cat.image.split('/').pop().replace('.svg', '') : 'None';
      console.log(`   ${cat.name} → ${imageType}`);
    });
    
    if (withoutImages.length > 0) {
      console.log(`\n❌ Görseli olmayan kategoriler (${withoutImages.length}):`);
      withoutImages.forEach(cat => {
        console.log(`   ${cat.name} (${cat.slug})`);
      });
    }
    
    console.log(`\n📈 Toplam: ${categories.length} kategori`);
    console.log(`📊 Görselli: ${withImages.length} (%${Math.round((withImages.length / categories.length) * 100)})`);
    
  } catch (error) {
    console.error('❌ İstatistik hatası:', error);
  }
}

// Ana fonksiyon
async function main() {
  console.log('🎨 Tüm kategorilere görseller ekleniyor...\n');
  
  await updateAllCategoryImages();
  await showCategoryImageStats();
  
  console.log('\n✨ Artık tüm kategorilerde görseller var!');
  console.log('🌐 Kategorileri kontrol et: http://localhost:3000/products');
}

// Script doğrudan çalıştırılıyorsa
if (require.main === module) {
  main();
}

module.exports = { updateAllCategoryImages, showCategoryImageStats }; 