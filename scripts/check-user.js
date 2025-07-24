const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log('🔍 Kullanıcı Kontrol Script\'i');
    console.log('=============================');
    
    // onuryasar91@gmail.com kullanıcısını ara
    const user = await prisma.user.findUnique({
      where: { email: 'onuryasar91@gmail.com' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true
      }
    });

    if (user) {
      console.log('✅ Kullanıcı bulundu!');
      console.log('────────────────────');
      console.log(`👤 ID: ${user.id}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🏷️ İsim: ${user.name}`);
      console.log(`👑 Rol: ${user.role}`);
      console.log(`📅 Kayıt Tarihi: ${user.createdAt.toLocaleString('tr-TR')}`);
      console.log(`🔄 Son Güncelleme: ${user.updatedAt.toLocaleString('tr-TR')}`);
      console.log(`✉️ Email Doğrulandı: ${user.emailVerified ? 'Evet' : 'Hayır'}`);
      
      if (user.role === 'ADMIN') {
        console.log('\n🎉 Bu kullanıcı zaten ADMIN!');
        console.log('🔗 Admin paneline giriş yapabilir: http://localhost:3000/admin');
      } else {
        console.log('\n⚠️ Bu kullanıcı henüz ADMIN değil.');
        console.log('💡 Admin yapmak için: npm run make:admin');
      }
    } else {
      console.log('❌ Kullanıcı bulunamadı!');
      console.log('📧 Email: onuryasar91@gmail.com');
      console.log('💡 Bu kullanıcıyı oluşturmak için: npm run create:admin');
    }

    // Tüm kullanıcıları da göster
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('\n📋 Tüm Kullanıcılar:');
    console.log('──────────────────');
    if (allUsers.length === 0) {
      console.log('❌ Henüz hiç kullanıcı yok!');
    } else {
      allUsers.forEach((u, index) => {
        const roleIcon = u.role === 'ADMIN' ? '👑' : '👤';
        console.log(`${index + 1}. ${roleIcon} ${u.name} (${u.email}) - ${u.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

checkUser(); 