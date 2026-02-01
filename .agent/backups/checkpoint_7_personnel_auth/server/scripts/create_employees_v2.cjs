const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
     console.log('--- Personel Kayıtları Oluşturuluyor (v2) ---');
     const hashedPassword = await bcrypt.hash('123456', 10);

     const targetBranches = [
          'PuraClean Kadıköy Şubesi',
          'PuraClean Beşiktaş Şubesi',
          'PuraClean Şişli Şubesi',
          'PuraClean Ataşehir Şubesi'
     ];

     for (const branchName of targetBranches) {
          const branch = await prisma.branch.findFirst({
               where: { name: branchName }
          });

          if (!branch) {
               console.log(`Şube bulunamadı: ${branchName}`);
               continue;
          }

          const branchSlug = branch.district.toLowerCase()
               .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
               .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
               .replace(/ /g, '');

          const users = [
               {
                    name: `Ahmet Temiz (${branch.district})`,
                    email: `ahmet.${branchSlug}@puraclean.com`,
                    role: 'user',
               },
               {
                    name: `Mehmet Servis (${branch.district})`,
                    email: `mehmet.${branchSlug}@puraclean.com`,
                    role: 'servis',
               },
               {
                    name: `Ayşe Operasyon (${branch.district})`,
                    email: `ayse.${branchSlug}@puraclean.com`,
                    role: 'user',
               }
          ];

          for (const u of users) {
               const exists = await prisma.user.findUnique({ where: { email: u.email } });
               if (!exists) {
                    await prisma.user.create({
                         data: {
                              name: u.name,
                              email: u.email,
                              password: hashedPassword,
                              role: u.role,
                              branchId: branch.id,
                         }
                    });
                    console.log(`  + Kullanıcı eklendi: ${u.email}`);
               } else {
                    console.log(`  ! Kullanıcı zaten var: ${u.email}`);
               }
          }
     }
     console.log('--- Tamamlandı ---');
}

main()
     .catch(e => {
          console.error(e);
          process.exit(1);
     })
     .finally(async () => {
          await prisma.$disconnect();
     });
