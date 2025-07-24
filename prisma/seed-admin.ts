import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creating admin user...');

  // Admin kullanıcısı bilgileri
  const adminEmail = 'muse3dstudio@outlook.com';
  const adminPassword = '27486399oO*';
  const adminName = 'Muse3DStudio Admin';

  // Mevcut kullanıcıyı kontrol et
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingUser) {
    console.log('❌ Admin user already exists with email:', adminEmail);
    console.log('   Updating existing user to ADMIN role...');
    
    // Mevcut kullanıcıyı güncelle
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const updatedUser = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        role: 'ADMIN',
        name: adminName,
      }
    });
    
    console.log('✅ Admin user updated successfully!');
    console.log('   Email:', updatedUser.email);
    console.log('   Role:', updatedUser.role);
    return;
  }

  // Şifreyi hash'le
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Admin kullanıcısı oluştur
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'ADMIN',
    }
  });

  console.log('✅ Admin user created successfully!');
  console.log('   ID:', adminUser.id);
  console.log('   Email:', adminUser.email);
  console.log('   Name:', adminUser.name);
  console.log('   Role:', adminUser.role);

  console.log('\n🎯 Admin Login Credentials:');
  console.log('   Email: muse3dstudio@outlook.com');
  console.log('   Password: 27486399oO*');
  console.log('   Role: ADMIN');
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 