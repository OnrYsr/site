import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Upload konfigürasyonu
const UPLOAD_CONFIG = {
  maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'), // 10MB default
  allowedTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
  uploadPath: join(process.cwd(), 'public', 'uploads')
};

// Dosya adı oluşturma fonksiyonu
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}

// Klasör oluşturma fonksiyonu
async function ensureUploadDir(category: string): Promise<string> {
  const uploadDir = join(UPLOAD_CONFIG.uploadPath, category);
  
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  
  return uploadDir;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'products';

    // Dosya kontrolü
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Boyut kontrolü
    if (file.size > UPLOAD_CONFIG.maxSize) {
      return NextResponse.json(
        { success: false, error: `Dosya boyutu çok büyük. Maksimum ${UPLOAD_CONFIG.maxSize / 1048576}MB olmalıdır` },
        { status: 400 }
      );
    }

    // Tip kontrolü
    if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Desteklenmeyen dosya tipi: ${file.type}` },
        { status: 400 }
      );
    }

    // Kategori kontrolü
    const validCategories = ['products', 'banners', 'categories', 'avatars', 'logos'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    // Upload klasörünü hazırla
    const uploadDir = await ensureUploadDir(category);
    
    // Dosya adı oluştur
    const fileName = generateFileName(file.name);
    const filePath = join(uploadDir, fileName);
    
    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL oluştur
    const fileUrl = `/uploads/${category}/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'Dosya başarıyla yüklendi',
      data: {
        fileName,
        fileUrl,
        fileSize: file.size,
        fileType: file.type,
        category
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Dosya silme endpoint'i
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('fileUrl');

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Dosya URL\'si gereklidir' },
        { status: 400 }
      );
    }

    // URL'den dosya yolunu çıkar
    const relativePath = fileUrl.replace('/uploads/', '');
    const filePath = join(UPLOAD_CONFIG.uploadPath, relativePath);

    // Dosyayı sil
    const { unlink } = await import('fs/promises');
    try {
      await unlink(filePath);
      return NextResponse.json({
        success: true,
        message: 'Dosya başarıyla silindi'
      });
    } catch (unlinkError) {
      // Dosya bulunamadıysa da başarılı say
      return NextResponse.json({
        success: true,
        message: 'Dosya zaten mevcut değil'
      });
    }

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Dosya silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 