const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Admin Kullanıcı Oluşturma Script\'i');
    console.log('====================================');
    
    // onuryasar91@ kullanıcısını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: 'onuryasar91@gmail.com' }
    });

    if (existingUser) {
      console.log('👤 Kullanıcı zaten mevcut, admin yapılıyor...');
      
      if (existingUser.role === 'ADMIN') {
        console.log('✅ Kullanıcı zaten admin!');
        return;
      }

      // Admin yap
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'ADMIN' }
      });

      console.log('🎉 Başarılı! onuryasar91@gmail.com artık admin.');
    } else {
      console.log('👤 Kullanıcı bulunamadı, yeni admin kullanıcı oluşturuluyor...');
      
      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash('123456', 12);

      // Admin kullanıcı oluştur
      const newUser = await prisma.user.create({
        data: {
          name: 'Onur Yaşar',
          email: 'onuryasar91@gmail.com',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });

      console.log('🎉 Başarılı! Admin kullanıcı oluşturuldu:');
      console.log(`📧 Email: ${newUser.email}`);
      console.log(`🔑 Şifre: 123456`);
      console.log(`👑 Rol: ${newUser.role}`);
    }

    console.log('\n🔗 Şimdi giriş yapabilirsiniz:');
    console.log('   → http://localhost:3000/auth/login');
    console.log('   → Email: onuryasar91@gmail.com');
    console.log('   → Şifre: 123456');
    console.log('   → Otomatik admin paneline yönlendirileceksiniz!');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

createAdmin(); 