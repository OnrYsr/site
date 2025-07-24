const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function makeAdmin() {
  try {
    console.log('🔧 Admin Kullanıcı Yapma Script\'i');
    console.log('================================');
    
    // Tüm kullanıcıları listele
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (users.length === 0) {
      console.log('❌ Henüz kayıtlı kullanıcı yok!');
      console.log('💡 Önce /auth/register sayfasından kayıt olun.');
      process.exit(1);
    }

    console.log('\n📋 Mevcut Kullanıcılar:');
    console.log('────────────────────────────────────────');
    users.forEach((user, index) => {
      const roleIcon = user.role === 'ADMIN' ? '👑' : '👤';
      console.log(`${index + 1}. ${roleIcon} ${user.name} (${user.email}) - ${user.role}`);
    });

    rl.question('\n🎯 Hangi kullanıcıyı admin yapmak istiyorsunuz? (numara girin): ', async (answer) => {
      const userIndex = parseInt(answer) - 1;
      
      if (userIndex < 0 || userIndex >= users.length) {
        console.log('❌ Geçersiz numara!');
        process.exit(1);
      }

      const selectedUser = users[userIndex];
      
      if (selectedUser.role === 'ADMIN') {
        console.log(`✅ ${selectedUser.name} zaten admin!`);
        process.exit(0);
      }

      // Admin yap
      await prisma.user.update({
        where: { id: selectedUser.id },
        data: { role: 'ADMIN' }
      });

      console.log(`🎉 Başarılı! ${selectedUser.name} artık admin.`);
      console.log(`🔗 Admin paneli: http://localhost:3000/admin`);
      
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

makeAdmin(); 