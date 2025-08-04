import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { existsSync } from 'fs';
import JSZip from 'jszip';

interface ImageInfo {
  name: string;
  path: string;
  category: string;
  size: string;
  format: string;
}

// GET - Mevcut örnek görselleri listele
export async function GET() {
  try {
    const examplesPath = join(process.cwd(), 'public', 'examples');
    const images: ImageInfo[] = [];
    
    // Alt klasörleri tara
    const categories = ['banners', 'products', 'categories', 'backgrounds'];
    
    for (const category of categories) {
      const categoryPath = join(examplesPath, category);
      
      if (existsSync(categoryPath)) {
        const files = await readdir(categoryPath);
        
        for (const file of files) {
          if (file.endsWith('.svg')) {
            const filePath = join(categoryPath, file);
            const fileName = basename(file, extname(file));
            
            // Dosya adından boyut bilgisi çıkar
            const sizeMatch = fileName.match(/(\d+x\d+)/);
            const size = sizeMatch ? sizeMatch[1] : 'Unknown';
            
            images.push({
              name: fileName,
              path: `/examples/${category}/${file}`,
              category: category,
              size: size,
              format: 'SVG'
            });
          }
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: images,
      count: images.length
    });
    
  } catch (error) {
    console.error('Görsel listeleme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Görseller listelenemedi' },
      { status: 500 }
    );
  }
}

// POST - Seçilen görselleri ZIP olarak indir
export async function POST(req: NextRequest) {
  try {
    const { imageIds, category } = await req.json();
    
    const zip = new JSZip();
    const examplesPath = join(process.cwd(), 'public', 'examples');
    
    // Eğer kategori belirtilmişse, o kategorideki tüm görselleri ekle
    if (category && !imageIds) {
      const categoryPath = join(examplesPath, category);
      
      if (existsSync(categoryPath)) {
        const files = await readdir(categoryPath);
        
        for (const file of files) {
          if (file.endsWith('.svg')) {
            const filePath = join(categoryPath, file);
            const content = await readFile(filePath);
            zip.file(`${category}/${file}`, content);
          }
        }
      }
    }
    
    // Seçilen görselleri ekle
    if (imageIds && Array.isArray(imageIds)) {
      for (const imagePath of imageIds) {
        const fullPath = join(process.cwd(), 'public', imagePath);
        
        if (existsSync(fullPath)) {
          const content = await readFile(fullPath);
          const fileName = basename(imagePath);
          const categoryName = imagePath.split('/')[2]; // /examples/category/file.svg
          
          zip.file(`${categoryName}/${fileName}`, content);
        }
      }
    }
    
    // Eğer hiçbir görsel seçilmemişse, tüm görselleri ekle
    if (!imageIds && !category) {
      const categories = ['banners', 'products', 'categories'];
      
      for (const cat of categories) {
        const categoryPath = join(examplesPath, cat);
        
        if (existsSync(categoryPath)) {
          const files = await readdir(categoryPath);
          
          for (const file of files) {
            if (file.endsWith('.svg')) {
              const filePath = join(categoryPath, file);
              const content = await readFile(filePath);
              zip.file(`${cat}/${file}`, content);
            }
          }
        }
      }
    }
    
    // README ekle
    const readme = `# Muse3DStudio Örnek Görseller

Bu ZIP dosyası Muse3DStudio projesi için hazırlanmış örnek görselleri içerir.

## Görsel Boyutları:

### Banner Görselleri:
- Desktop: 1920x500px
- Mobile: 768x400px

### Ürün Görselleri:
- Ana görsel: 800x800px
- Thumbnail: 300x300px

### Kategori Görselleri:
- Standart: 400x300px

## Kullanım:
- Tüm görseller SVG formatındadır
- Boyutları değiştirmek için SVG width/height özelliklerini güncelleyin
- Renkleri CSS ile özelleştirebilirsiniz

## İletişim:
Muse3DStudio - 3D Tasarım Koleksiyonu
${new Date().toISOString().split('T')[0]} tarihinde oluşturuldu
`;
    
    zip.file('README.md', readme);
    
    // ZIP oluştur
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="muse3d-sample-images-${Date.now()}.zip"`
      }
    });
    
  } catch (error) {
    console.error('ZIP oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, error: 'ZIP dosyası oluşturulamadı' },
      { status: 500 }
    );
  }
} 