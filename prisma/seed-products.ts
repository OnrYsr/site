import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding categories and products...');

  // Kategorileri oluştur
  const categories = [
    {
      name: 'Mimari Modeller',
      slug: 'mimari-modeller',
      description: 'Bina ve yapı tasarımları',
      isActive: true,
      showOnHomepage: true
    },
    {
      name: 'Karakter Modelleri',
      slug: 'karakter-modelleri',
      description: 'İnsan ve hayvan karakterleri',
      isActive: true,
      showOnHomepage: true
    },
    {
      name: 'Araç Modelleri',
      slug: 'arac-modelleri',
      description: 'Otomobil ve araç tasarımları',
      isActive: true,
      showOnHomepage: true
    },
    {
      name: 'Mobilya Modelleri',
      slug: 'mobilya-modelleri',
      description: 'Ev ve ofis mobilyaları',
      isActive: true,
      showOnHomepage: true
    },
    {
      name: 'Elektronik Modeller',
      slug: 'elektronik-modeller',
      description: 'Cihaz ve elektronik ürünler',
      isActive: true,
      showOnHomepage: true
    },
    {
      name: 'Doğa Modelleri',
      slug: 'doga-modelleri',
      description: 'Bitki ve doğa objeleri',
      isActive: true,
      showOnHomepage: true
    }
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
    createdCategories.push(created);
    console.log(`✅ Kategori oluşturuldu: ${created.name}`);
  }

  // Ürünleri oluştur
  const products = [
    {
      name: 'Modern Ev Tasarımı',
      slug: 'modern-ev-tasarimi',
      description: 'Yüksek kaliteli modern ev 3D modeli. Mimari projeleriniz için idealdir.',
      price: 299.99,
      originalPrice: 399.99,
      images: ['/api/placeholder/400/400'],
      stock: 10,
      isActive: true,
      isFeatured: true,
      categorySlug: 'mimari-modeller'
    },
    {
      name: 'Futuristik Araba Modeli',
      slug: 'futuristik-araba-modeli',
      description: 'Gelecekçi tasarım konseptli araba modeli. Oyun ve animasyon projeleriniz için mükemmel.',
      price: 199.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 15,
      isActive: true,
      isFeatured: false,
      categorySlug: 'arac-modelleri'
    },
    {
      name: 'Karakter Animasyon Modeli',
      slug: 'karakter-animasyon-modeli',
      description: 'Detaylı karakter modeli. Animasyon projeleriniz için hazır rigged model.',
      price: 149.99,
      originalPrice: 199.99,
      images: ['/api/placeholder/400/400'],
      stock: 8,
      isActive: true,
      isFeatured: true,
      categorySlug: 'karakter-modelleri'
    },
    {
      name: 'Ofis Mobilya Seti',
      slug: 'ofis-mobilya-seti',
      description: 'Kompleks ofis mobilya koleksiyonu. Masa, sandalye ve dolap modelleri dahil.',
      price: 399.99,
      originalPrice: 499.99,
      images: ['/api/placeholder/400/400'],
      stock: 5,
      isActive: true,
      isFeatured: false,
      categorySlug: 'mobilya-modelleri'
    },
    {
      name: 'Elektronik Cihaz Koleksiyonu',
      slug: 'elektronik-cihaz-koleksiyonu',
      description: 'Çeşitli elektronik cihazlar. Telefon, laptop, tablet modelleri içerir.',
      price: 249.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 12,
      isActive: true,
      isFeatured: true,
      categorySlug: 'elektronik-modeller'
    },
    {
      name: 'Doğa Manzara Seti',
      slug: 'doga-manzara-seti',
      description: 'Ağaç, çiçek ve doğa elementleri koleksiyonu. Çevre tasarımlarınız için ideal.',
      price: 179.99,
      originalPrice: 229.99,
      images: ['/api/placeholder/400/400'],
      stock: 20,
      isActive: true,
      isFeatured: false,
      categorySlug: 'doga-modelleri'
    },
    {
      name: 'Spor Araç Modelleri',
      slug: 'spor-arac-modelleri',
      description: 'Yüksek performanslı spor araba modelleri. Detaylı iç ve dış tasarım.',
      price: 329.99,
      originalPrice: 429.99,
      images: ['/api/placeholder/400/400'],
      stock: 7,
      isActive: true,
      isFeatured: true,
      categorySlug: 'arac-modelleri'
    },
    {
      name: 'Fantastik Karakter Seti',
      slug: 'fantastik-karakter-seti',
      description: 'Mitolojik ve fantastik karakterler. Oyun projeleriniz için özel tasarım.',
      price: 269.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 9,
      isActive: true,
      isFeatured: false,
      categorySlug: 'karakter-modelleri'
    },
    {
      name: 'Villa Tasarımı',
      slug: 'villa-tasarimi',
      description: 'Lüks villa 3D modeli. Mimari görselleştirme projeleriniz için profesyonel kalite.',
      price: 599.99,
      originalPrice: 699.99,
      images: ['/api/placeholder/400/400'],
      stock: 3,
      isActive: true,
      isFeatured: true,
      categorySlug: 'mimari-modeller'
    },
    {
      name: 'Gaming Setup',
      slug: 'gaming-setup',
      description: 'Oyuncu odası düzenlemesi. Masaüstü bilgisayar, monitör ve aksesuarlar.',
      price: 189.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 14,
      isActive: true,
      isFeatured: false,
      categorySlug: 'elektronik-modeller'
    },
    {
      name: 'Bahçe Mobilyası',
      slug: 'bahce-mobilyasi',
      description: 'Dış mekan mobilya koleksiyonu. Masa, sandalye ve şemsiye modelleri.',
      price: 159.99,
      originalPrice: 199.99,
      images: ['/api/placeholder/400/400'],
      stock: 11,
      isActive: true,
      isFeatured: false,
      categorySlug: 'mobilya-modelleri'
    },
    {
      name: 'Orman Manzarası',
      slug: 'orman-manzarasi',
      description: 'Geniş orman ekosistemi. Farklı ağaç türleri ve doğa elementleri içerir.',
      price: 129.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 18,
      isActive: true,
      isFeatured: false,
      categorySlug: 'doga-modelleri'
    }
  ];

  for (const productData of products) {
    // Kategoriyi bul
    const category = createdCategories.find(cat => cat.slug === productData.categorySlug);
    if (!category) {
      console.log(`❌ Kategori bulunamadı: ${productData.categorySlug}`);
      continue;
    }

    const { categorySlug, ...product } = productData;
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        categoryId: category.id
      }
    });
    console.log(`✅ Ürün oluşturuldu: ${created.name}`);
  }

  console.log('🎉 Seed tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 