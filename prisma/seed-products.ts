import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding categories and products...');

  // Ana kategorileri oluştur
  const mainCategories = [
    {
      name: 'Ev Dekorasyon',
      slug: 'ev-dekorasyon',
      description: 'Evinizi güzelleştiren dekoratif ürünler',
      isActive: true,
      showOnHomepage: true,
      displayOrder: 1
    },
    {
      name: 'Mutfak',
      slug: 'mutfak',
      description: 'Mutfak için pratik ve işlevsel ürünler',
      isActive: true,
      showOnHomepage: true,
      displayOrder: 2
    },
    {
      name: 'Günlük Yaşam & Hediyelik',
      slug: 'gunluk-yasam-hediyelik',
      description: 'Günlük hayatı kolaylaştıran ve hediye edilebilir ürünler',
      isActive: true,
      showOnHomepage: true,
      displayOrder: 3
    }
  ];

  const createdMainCategories = [];
  for (const category of mainCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
    createdMainCategories.push(created);
    console.log(`✅ Ana kategori oluşturuldu: ${created.name}`);
  }

  // Alt kategorileri oluştur
  const subCategories = [
    // Ev Dekorasyon alt kategorileri
    {
      name: 'Raf Kitap Ayracı',
      slug: 'raf-kitap-ayraci',
      description: 'Estetik ve fonksiyonel kitap ayraçları',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 1,
      parentSlug: 'ev-dekorasyon'
    },
    {
      name: 'Minyatür Bitkiler',
      slug: 'minyatur-bitkiler',
      description: 'Dekoratif minyatür bitki modelleri',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 2,
      parentSlug: 'ev-dekorasyon'
    },
    {
      name: 'Saksı & Vazo vb.',
      slug: 'saksi-vazo',
      description: 'Çiçek ve bitki saksıları, vazolar',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 3,
      parentSlug: 'ev-dekorasyon'
    },
    {
      name: 'Aydınlatma',
      slug: 'aydinlatma',
      description: 'Dekoratif aydınlatma ürünleri',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 4,
      parentSlug: 'ev-dekorasyon'
    },
    
    // Mutfak alt kategorileri
    {
      name: 'Kurabiye Kalıbı',
      slug: 'kurabiye-kalibi',
      description: 'Yaratıcı kurabiye kalıpları',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 1,
      parentSlug: 'mutfak'
    },
    {
      name: 'Hamur Desen Oklavası',
      slug: 'hamur-desen-oklavasi',
      description: 'Desenli hamur oklavası modelleri',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 2,
      parentSlug: 'mutfak'
    },

    // Günlük Yaşam & Hediyelik alt kategorileri
    {
      name: 'Bardak Altlığı',
      slug: 'bardak-altligi',
      description: 'Şık ve pratik bardak altlıkları',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 1,
      parentSlug: 'gunluk-yasam-hediyelik'
    },
    {
      name: 'Takı Standı',
      slug: 'taki-standi',
      description: 'Takılarınız için düzenli standlar',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 2,
      parentSlug: 'gunluk-yasam-hediyelik'
    },
    {
      name: 'Organizer',
      slug: 'organizer',
      description: 'Masaüstü ve ev organizasyon ürünleri',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 3,
      parentSlug: 'gunluk-yasam-hediyelik'
    },
    {
      name: 'Anahtarlık',
      slug: 'anahtarlik',
      description: 'Özgün ve yaratıcı anahtarlık tasarımları',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 4,
      parentSlug: 'gunluk-yasam-hediyelik'
    },
    {
      name: 'Magnet',
      slug: 'magnet',
      description: 'Buzdolabı ve dekoratif magnet ürünleri',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 5,
      parentSlug: 'gunluk-yasam-hediyelik'
    },
    {
      name: 'Figür - Objeler',
      slug: 'figur-objeler',
      description: 'Dekoratif figür ve objeler',
      isActive: true,
      showOnHomepage: false,
      displayOrder: 6,
      parentSlug: 'gunluk-yasam-hediyelik'
    }
  ];

  const createdSubCategories = [];
  for (const subCat of subCategories) {
    const parentCategory = createdMainCategories.find(cat => cat.slug === subCat.parentSlug);
    if (!parentCategory) {
      console.log(`❌ Ana kategori bulunamadı: ${subCat.parentSlug}`);
      continue;
    }

    const { parentSlug, ...categoryData } = subCat;
    const created = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: {
        ...categoryData,
        parentId: parentCategory.id
      }
    });
    createdSubCategories.push(created);
    console.log(`✅ Alt kategori oluşturuldu: ${created.name} (${parentCategory.name})`);
  }

  // Ürünleri oluştur (her kategoriden 5 ürün)
  const products = [
    // Raf Kitap Ayracı - 5 ürün
    {
      name: 'Minimalist Kitap Ayracı Seti',
      slug: 'minimalist-kitap-ayraci-seti',
      description: 'Modern tasarımlı 4\'lü minimalist kitap ayracı seti. Geometrik desenlerle.',
      price: 45.99,
      originalPrice: 59.99,
      images: ['/api/placeholder/400/400'],
      stock: 15,
      isActive: true,
      isFeatured: true,
      categorySlug: 'raf-kitap-ayraci'
    },
    {
      name: 'Hayvan Figürlü Kitap Ayracı',
      slug: 'hayvan-figurlu-kitap-ayraci',
      description: 'Sevimli hayvan figürlü kitap ayraçları. Çocuklar için idealdir.',
      price: 29.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 25,
      isActive: true,
      isFeatured: false,
      categorySlug: 'raf-kitap-ayraci'
    },
    {
      name: 'Vintage Tarzı Kitap Tutucu',
      slug: 'vintage-tarzi-kitap-tutucu',
      description: 'Klasik vintage tarzında metal görünümlü kitap tutucu.',
      price: 89.99,
      originalPrice: 109.99,
      images: ['/api/placeholder/400/400'],
      stock: 8,
      isActive: true,
      isFeatured: false,
      categorySlug: 'raf-kitap-ayraci'
    },
    {
      name: 'Doğa Temalı Raf Ayracı',
      slug: 'doga-temali-raf-ayraci',
      description: 'Yaprak ve dal desenli doğa temalı kitap raf ayracı.',
      price: 39.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 20,
      isActive: true,
      isFeatured: false,
      categorySlug: 'raf-kitap-ayraci'
    },
    {
      name: 'Astronot Temalı Kitap Standı',
      slug: 'astronot-temali-kitap-standi',
      description: 'Uzay temalı astronot figürlü kitap standı. Çocuk odası için mükemmel.',
      price: 79.99,
      originalPrice: 99.99,
      images: ['/api/placeholder/400/400'],
      stock: 12,
      isActive: true,
      isFeatured: true,
      categorySlug: 'raf-kitap-ayraci'
    },

    // Minyatür Bitkiler - 5 ürün
    {
      name: 'Sukulent Minyatür Set',
      slug: 'sukulent-minyatur-set',
      description: 'Gerçekçi sukulent bitki minyatürleri. 6\'lı set halinde.',
      price: 65.99,
      originalPrice: 79.99,
      images: ['/api/placeholder/400/400'],
      stock: 18,
      isActive: true,
      isFeatured: true,
      categorySlug: 'minyatur-bitkiler'
    },
    {
      name: 'Tropik Bitki Koleksiyonu',
      slug: 'tropik-bitki-koleksiyonu',
      description: 'Tropik bitki minyatürleri. Monstera, palm ve diğer egzotik bitkiler.',
      price: 89.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 10,
      isActive: true,
      isFeatured: false,
      categorySlug: 'minyatur-bitkiler'
    },
    {
      name: 'Kaktüs Bahçesi Minyatür',
      slug: 'kaktus-bahcesi-minyatur',
      description: 'Çeşitli kaktüs türlerinden oluşan minyatür bahçe seti.',
      price: 49.99,
      originalPrice: 64.99,
      images: ['/api/placeholder/400/400'],
      stock: 22,
      isActive: true,
      isFeatured: false,
      categorySlug: 'minyatur-bitkiler'
    },
    {
      name: 'Aromatik Bitki Seti',
      slug: 'aromatik-bitki-seti',
      description: 'Lavanta, biberiye ve nane minyatür aromatik bitki seti.',
      price: 55.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 16,
      isActive: true,
      isFeatured: false,
      categorySlug: 'minyatur-bitkiler'
    },
    {
      name: 'Teraryum Bitki Koleksiyonu',
      slug: 'teraryum-bitki-koleksiyonu',
      description: 'Teraryum için özel tasarlanmış minyatür bitki koleksiyonu.',
      price: 72.99,
      originalPrice: 89.99,
      images: ['/api/placeholder/400/400'],
      stock: 14,
      isActive: true,
      isFeatured: true,
      categorySlug: 'minyatur-bitkiler'
    },

    // Saksı & Vazo - 5 ürün
    {
      name: 'Geometrik Desenli Saksı Seti',
      slug: 'geometrik-desenli-saksi-seti',
      description: 'Modern geometrik desenlere sahip 3\'lü saksı seti.',
      price: 125.99,
      originalPrice: 149.99,
      images: ['/api/placeholder/400/400'],
      stock: 8,
      isActive: true,
      isFeatured: true,
      categorySlug: 'saksi-vazo'
    },
    {
      name: 'Vintage Stil Vazo',
      slug: 'vintage-stil-vazo',
      description: 'Klasik vintage tarzında dekoratif vazo. Çiçekler için ideal.',
      price: 89.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 12,
      isActive: true,
      isFeatured: false,
      categorySlug: 'saksi-vazo'
    },
    {
      name: 'Ahşap Görünümlü Saksı',
      slug: 'ahsap-gorunumlu-saksi',
      description: 'Doğal ahşap dokulu dekoratif saksı. Çeşitli boyutlarda.',
      price: 69.99,
      originalPrice: 84.99,
      images: ['/api/placeholder/400/400'],
      stock: 20,
      isActive: true,
      isFeatured: false,
      categorySlug: 'saksi-vazo'
    },
    {
      name: 'Mermer Desenli Vazo Seti',
      slug: 'mermer-desenli-vazo-seti',
      description: 'Şık mermer desenli 2\'li vazo seti. Lüks görünüm.',
      price: 149.99,
      originalPrice: 189.99,
      images: ['/api/placeholder/400/400'],
      stock: 6,
      isActive: true,
      isFeatured: true,
      categorySlug: 'saksi-vazo'
    },
    {
      name: 'Bohem Tarzı Makrame Saksı',
      slug: 'bohem-tarzi-makrame-saksi',
      description: 'Makrame desenli bohem tarzında asılabilir saksı.',
      price: 79.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 15,
      isActive: true,
      isFeatured: false,
      categorySlug: 'saksi-vazo'
    },

    // Aydınlatma - 5 ürün
    {
      name: 'LED Masa Lambası Modern',
      slug: 'led-masa-lambasi-modern',
      description: 'Şarj edilebilir LED masa lambası. Dimmer özelliği.',
      price: 199.99,
      originalPrice: 249.99,
      images: ['/api/placeholder/400/400'],
      stock: 10,
      isActive: true,
      isFeatured: true,
      categorySlug: 'aydinlatma'
    },
    {
      name: 'Vintage Edison Ampul Lamba',
      slug: 'vintage-edison-ampul-lamba',
      description: 'Nostaljik Edison ampul tasarımlı dekoratif lamba.',
      price: 129.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 18,
      isActive: true,
      isFeatured: false,
      categorySlug: 'aydinlatma'
    },
    {
      name: 'Ay Işığı Gece Lambası',
      slug: 'ay-isigi-gece-lambasi',
      description: '3D ay modelli gece lambası. Çocuk odası için ideal.',
      price: 89.99,
      originalPrice: 109.99,
      images: ['/api/placeholder/400/400'],
      stock: 25,
      isActive: true,
      isFeatured: true,
      categorySlug: 'aydinlatma'
    },
    {
      name: 'Kristal Prizma Lamba',
      slug: 'kristal-prizma-lamba',
      description: 'Işığı kıran kristal prizma efektli dekoratif lamba.',
      price: 159.99,
      originalPrice: 199.99,
      images: ['/api/placeholder/400/400'],
      stock: 8,
      isActive: true,
      isFeatured: false,
      categorySlug: 'aydinlatma'
    },
    {
      name: 'Doğal Tuz Lamba',
      slug: 'dogal-tuz-lamba',
      description: 'Himalaya tuzu görünümlü iyonize edici lamba.',
      price: 119.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 14,
      isActive: true,
      isFeatured: false,
      categorySlug: 'aydinlatma'
    },

    // Kurabiye Kalıbı - 5 ürün
    {
      name: 'Hayvan Şekilli Kurabiye Kalıbı',
      slug: 'hayvan-sekilli-kurabiye-kalibi',
      description: 'Sevimli hayvan şekilli kurabiye kalıpları. 8\'li set.',
      price: 59.99,
      originalPrice: 74.99,
      images: ['/api/placeholder/400/400'],
      stock: 20,
      isActive: true,
      isFeatured: true,
      categorySlug: 'kurabiye-kalibi'
    },
    {
      name: 'Noel Temalı Kalıp Seti',
      slug: 'noel-temali-kalip-seti',
      description: 'Noel ve kış temalı kurabiye kalıpları. Yılbaşı için özel.',
      price: 45.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 30,
      isActive: true,
      isFeatured: false,
      categorySlug: 'kurabiye-kalibi'
    },
    {
      name: 'Geometrik Şekil Kalıpları',
      slug: 'geometrik-sekil-kaliplari',
      description: 'Modern geometrik şekillerde kurabiye kalıpları.',
      price: 39.99,
      originalPrice: 49.99,
      images: ['/api/placeholder/400/400'],
      stock: 25,
      isActive: true,
      isFeatured: false,
      categorySlug: 'kurabiye-kalibi'
    },
    {
      name: 'Çiçek ve Yaprak Kalıbı',
      slug: 'cicek-ve-yaprak-kalibi',
      description: 'Doğal çiçek ve yaprak şekilli dekoratif kalıplar.',
      price: 49.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 18,
      isActive: true,
      isFeatured: false,
      categorySlug: 'kurabiye-kalibi'
    },
    {
      name: 'Emoji Kurabiye Kalıp Seti',
      slug: 'emoji-kurabiye-kalip-seti',
      description: 'Popüler emoji şekilli eğlenceli kurabiye kalıpları.',
      price: 54.99,
      originalPrice: 69.99,
      images: ['/api/placeholder/400/400'],
      stock: 22,
      isActive: true,
      isFeatured: true,
      categorySlug: 'kurabiye-kalibi'
    },

    // Hamur Desen Oklavası - 5 ürün
    {
      name: 'Çiçek Desenli Oklava',
      slug: 'cicek-desenli-oklava',
      description: 'Hamura çiçek deseni basan dekoratif oklava.',
      price: 79.99,
      originalPrice: 94.99,
      images: ['/api/placeholder/400/400'],
      stock: 15,
      isActive: true,
      isFeatured: true,
      categorySlug: 'hamur-desen-oklavasi'
    },
    {
      name: 'Geometrik Desen Oklava',
      slug: 'geometrik-desen-oklava',
      description: 'Modern geometrik desenler oluşturan oklava.',
      price: 69.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 18,
      isActive: true,
      isFeatured: false,
      categorySlug: 'hamur-desen-oklavasi'
    },
    {
      name: 'Noel Desenli Oklava',
      slug: 'noel-desenli-oklava',
      description: 'Yılbaşı ve Noel temalı desen oklava.',
      price: 59.99,
      originalPrice: 74.99,
      images: ['/api/placeholder/400/400'],
      stock: 25,
      isActive: true,
      isFeatured: false,
      categorySlug: 'hamur-desen-oklavasi'
    },
    {
      name: 'Yaprak ve Dal Oklava',
      slug: 'yaprak-ve-dal-oklava',
      description: 'Doğal yaprak ve dal desenli oklava.',
      price: 74.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 12,
      isActive: true,
      isFeatured: false,
      categorySlug: 'hamur-desen-oklavasi'
    },
    {
      name: 'Vintage Dantel Oklava',
      slug: 'vintage-dantel-oklava',
      description: 'Klasik dantel deseni oluşturan vintage oklava.',
      price: 89.99,
      originalPrice: 109.99,
      images: ['/api/placeholder/400/400'],
      stock: 10,
      isActive: true,
      isFeatured: true,
      categorySlug: 'hamur-desen-oklavasi'
    },

    // Bardak Altlığı - 5 ürün
    {
      name: 'Mermer Desenli Bardak Altlığı',
      slug: 'mermer-desenli-bardak-altligi',
      description: 'Şık mermer desenli 4\'lü bardak altlığı seti.',
      price: 39.99,
      originalPrice: 49.99,
      images: ['/api/placeholder/400/400'],
      stock: 30,
      isActive: true,
      isFeatured: true,
      categorySlug: 'bardak-altligi'
    },
    {
      name: 'Ahşap Görünümlü Altlık',
      slug: 'ahsap-gorunumlu-altlik',
      description: 'Doğal ahşap dokulu bardak altlıkları.',
      price: 29.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 40,
      isActive: true,
      isFeatured: false,
      categorySlug: 'bardak-altligi'
    },
    {
      name: 'Geometrik Desen Altlık',
      slug: 'geometrik-desen-altlik',
      description: 'Modern geometrik desenli dekoratif altlık seti.',
      price: 34.99,
      originalPrice: 44.99,
      images: ['/api/placeholder/400/400'],
      stock: 25,
      isActive: true,
      isFeatured: false,
      categorySlug: 'bardak-altligi'
    },
    {
      name: 'Mandala Desenli Altlık',
      slug: 'mandala-desenli-altlik',
      description: 'Detaylı mandala desenli estetik bardak altlığı.',
      price: 44.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 20,
      isActive: true,
      isFeatured: false,
      categorySlug: 'bardak-altligi'
    },
    {
      name: 'Hexagon Petek Altlık',
      slug: 'hexagon-petek-altlik',
      description: 'Altıgen petek şeklinde modern bardak altlığı.',
      price: 49.99,
      originalPrice: 59.99,
      images: ['/api/placeholder/400/400'],
      stock: 18,
      isActive: true,
      isFeatured: true,
      categorySlug: 'bardak-altligi'
    },

    // Takı Standı - 5 ürün
    {
      name: 'Ağaç Dalı Takı Standı',
      slug: 'agac-dali-taki-standi',
      description: 'Doğal ağaç dalı görünümlü takı organizatörü.',
      price: 89.99,
      originalPrice: 109.99,
      images: ['/api/placeholder/400/400'],
      stock: 15,
      isActive: true,
      isFeatured: true,
      categorySlug: 'taki-standi'
    },
    {
      name: 'Minimalist Takı Kutusu',
      slug: 'minimalist-taki-kutusu',
      description: 'Modern minimalist tasarımlı çok bölmeli takı kutusu.',
      price: 129.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 10,
      isActive: true,
      isFeatured: false,
      categorySlug: 'taki-standi'
    },
    {
      name: 'Döner Takı Standı',
      slug: 'doner-taki-standi',
      description: '360 derece dönen çok katlı takı düzenleyici.',
      price: 159.99,
      originalPrice: 189.99,
      images: ['/api/placeholder/400/400'],
      stock: 8,
      isActive: true,
      isFeatured: true,
      categorySlug: 'taki-standi'
    },
    {
      name: 'Vintage Ayna Takı Standı',
      slug: 'vintage-ayna-taki-standi',
      description: 'Aynalı vintage tarzında takı düzenleyici.',
      price: 99.99,
      originalPrice: 124.99,
      images: ['/api/placeholder/400/400'],
      stock: 12,
      isActive: true,
      isFeatured: false,
      categorySlug: 'taki-standi'
    },
    {
      name: 'Bambu Takı Organizatörü',
      slug: 'bambu-taki-organizatoru',
      description: 'Ekolojik bambu malzemeli takı düzenleyici.',
      price: 79.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 20,
      isActive: true,
      isFeatured: false,
      categorySlug: 'taki-standi'
    },

    // Organizer - 5 ürün
    {
      name: 'Masaüstü Kalem Organizatörü',
      slug: 'masaustu-kalem-organizatoru',
      description: 'Çok bölmeli masaüstü kalem ve kırtasiye organizatörü.',
      price: 69.99,
      originalPrice: 84.99,
      images: ['/api/placeholder/400/400'],
      stock: 25,
      isActive: true,
      isFeatured: true,
      categorySlug: 'organizer'
    },
    {
      name: 'Çekmece İçi Organizer',
      slug: 'cekmece-ici-organizer',
      description: 'Ayarlanabilir çekmece içi düzenleyici set.',
      price: 49.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 30,
      isActive: true,
      isFeatured: false,
      categorySlug: 'organizer'
    },
    {
      name: 'Telefon ve Tablet Standı',
      slug: 'telefon-ve-tablet-standi',
      description: 'Ayarlanabilir açılı telefon ve tablet tutucu.',
      price: 39.99,
      originalPrice: 54.99,
      images: ['/api/placeholder/400/400'],
      stock: 40,
      isActive: true,
      isFeatured: true,
      categorySlug: 'organizer'
    },
    {
      name: 'Kablo Düzenleyici Seti',
      slug: 'kablo-duzenleyici-seti',
      description: 'Masa altı ve üstü kablo düzenleyici çözümleri.',
      price: 59.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 22,
      isActive: true,
      isFeatured: false,
      categorySlug: 'organizer'
    },
    {
      name: 'Modüler Saklama Kutusu',
      slug: 'moduler-saklama-kutusu',
      description: 'İstiflenebilir modüler saklama kutu sistemi.',
      price: 89.99,
      originalPrice: 109.99,
      images: ['/api/placeholder/400/400'],
      stock: 15,
      isActive: true,
      isFeatured: false,
      categorySlug: 'organizer'
    },

    // Anahtarlık - 5 ürün
    {
      name: 'Hayvan Figürlü Anahtarlık',
      slug: 'hayvan-figurlu-anahtarlik',
      description: 'Sevimli hayvan figürlü dekoratif anahtarlık seti.',
      price: 24.99,
      originalPrice: 29.99,
      images: ['/api/placeholder/400/400'],
      stock: 50,
      isActive: true,
      isFeatured: true,
      categorySlug: 'anahtarlik'
    },
    {
      name: 'İsme Özel Anahtarlık',
      slug: 'isme-ozel-anahtarlik',
      description: 'Kişiselleştirilebilir isim yazılı anahtarlık.',
      price: 34.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 35,
      isActive: true,
      isFeatured: true,
      categorySlug: 'anahtarlik'
    },
    {
      name: 'Geometrik Desenli Anahtarlık',
      slug: 'geometrik-desenli-anahtarlik',
      description: 'Modern geometrik desenli metal anahtarlık.',
      price: 19.99,
      originalPrice: 24.99,
      images: ['/api/placeholder/400/400'],
      stock: 45,
      isActive: true,
      isFeatured: false,
      categorySlug: 'anahtarlik'
    },
    {
      name: 'LED Işıklı Anahtarlık',
      slug: 'led-isikli-anahtarlik',
      description: 'Karanlıkta kullanım için LED ışıklı anahtarlık.',
      price: 29.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 30,
      isActive: true,
      isFeatured: false,
      categorySlug: 'anahtarlik'
    },
    {
      name: 'Vintage Tarz Anahtarlık',
      slug: 'vintage-tarz-anahtarlik',
      description: 'Nostaljik vintage tarzında metal anahtarlık.',
      price: 39.99,
      originalPrice: 49.99,
      images: ['/api/placeholder/400/400'],
      stock: 25,
      isActive: true,
      isFeatured: false,
      categorySlug: 'anahtarlik'
    },

    // Magnet - 5 ürün
    {
      name: 'Şehir Temalı Magnet Seti',
      slug: 'sehir-temali-magnet-seti',
      description: 'Ünlü şehir siluetli dekoratif magnet koleksiyonu.',
      price: 34.99,
      originalPrice: 44.99,
      images: ['/api/placeholder/400/400'],
      stock: 40,
      isActive: true,
      isFeatured: true,
      categorySlug: 'magnet'
    },
    {
      name: 'Hayvan Karakteri Magnet',
      slug: 'hayvan-karakteri-magnet',
      description: 'Sevimli hayvan karakterli buzdolabı magneti seti.',
      price: 24.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 60,
      isActive: true,
      isFeatured: false,
      categorySlug: 'magnet'
    },
    {
      name: 'Inspiratif Söz Magnet',
      slug: 'inspiratif-soz-magnet',
      description: 'Motivasyon veren sözlü dekoratif magnet seti.',
      price: 29.99,
      originalPrice: 39.99,
      images: ['/api/placeholder/400/400'],
      stock: 45,
      isActive: true,
      isFeatured: false,
      categorySlug: 'magnet'
    },
    {
      name: 'Geometrik Şekil Magnet',
      slug: 'geometrik-sekil-magnet',
      description: 'Modern geometrik şekilli renkli magnet seti.',
      price: 19.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 50,
      isActive: true,
      isFeatured: false,
      categorySlug: 'magnet'
    },
    {
      name: 'Emoji Magnet Koleksiyonu',
      slug: 'emoji-magnet-koleksiyonu',
      description: 'Popüler emoji ifadeli eğlenceli magnet seti.',
      price: 27.99,
      originalPrice: 34.99,
      images: ['/api/placeholder/400/400'],
      stock: 35,
      isActive: true,
      isFeatured: true,
      categorySlug: 'magnet'
    },

    // Figür - Objeler - 5 ürün
    {
      name: 'Minimalist Figür Seti',
      slug: 'minimalist-figur-seti',
      description: 'Modern minimalist tasarımlı dekoratif figür koleksiyonu.',
      price: 149.99,
      originalPrice: 179.99,
      images: ['/api/placeholder/400/400'],
      stock: 12,
      isActive: true,
      isFeatured: true,
      categorySlug: 'figur-objeler'
    },
    {
      name: 'Doğa Temalı Objeler',
      slug: 'doga-temali-objeler',
      description: 'Yaprak, dal ve doğa elementli dekoratif obje seti.',
      price: 89.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 18,
      isActive: true,
      isFeatured: false,
      categorySlug: 'figur-objeler'
    },
    {
      name: 'Geometrik Sanat Objesi',
      slug: 'geometrik-sanat-objesi',
      description: 'Modern geometrik formlu sanatsal dekorasyon objesi.',
      price: 199.99,
      originalPrice: 249.99,
      images: ['/api/placeholder/400/400'],
      stock: 8,
      isActive: true,
      isFeatured: true,
      categorySlug: 'figur-objeler'
    },
    {
      name: 'Vintage Koleksiyoncu Figürü',
      slug: 'vintage-koleksiyoncu-figuru',
      description: 'Klasik vintage tarzında koleksiyonluk figür.',
      price: 129.99,
      originalPrice: 159.99,
      images: ['/api/placeholder/400/400'],
      stock: 15,
      isActive: true,
      isFeatured: false,
      categorySlug: 'figur-objeler'
    },
    {
      name: 'Soyut Sanat Heykeli',
      slug: 'soyut-sanat-heykeli',
      description: 'Modern soyut tasarımlı dekoratif masa heykeli.',
      price: 179.99,
      originalPrice: null,
      images: ['/api/placeholder/400/400'],
      stock: 10,
      isActive: true,
      isFeatured: false,
      categorySlug: 'figur-objeler'
    }
  ];

  // Tüm kategorileri birleştir
  const allCategories = [...createdMainCategories, ...createdSubCategories];

  // Ürünleri oluştur
  for (const productData of products) {
    // Kategoriyi bul
    const category = allCategories.find(cat => cat.slug === productData.categorySlug);
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
    console.log(`✅ Ürün oluşturuldu: ${created.name} (${category.name})`);
  }

  console.log('🎉 Seed tamamlandı!');
  console.log(`📊 ${mainCategories.length} ana kategori, ${subCategories.length} alt kategori ve ${products.length} ürün oluşturuldu.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 