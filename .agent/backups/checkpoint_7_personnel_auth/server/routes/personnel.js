const express = require('express');
const router = express.Router();
const { prisma, createAuditLog } = require('../prismaClient');
const { authenticate } = require('../middleware/authMiddleware');

// Get all employees (isolated by branch for managers)
router.get('/', authenticate, async (req, res) => {
    try {
        // Taze kullanıcı verisi (Token eski olabilir)
        const freshUser = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (freshUser) {
            req.user.branchId = freshUser.branchId;
            req.user.role = freshUser.role;
        }

        console.log('--- GET /api/personnel DEBUG ---');
        console.log('User:', req.user?.email, 'Role:', req.user?.role, 'Branch:', req.user?.branchId);
        console.log('Query Params:', req.query);

        const { search, role, branchId } = req.query;
        let where = { deletedAt: null };
        let userWhere = {};

        // Branch Isolation Logic
        const isSuperUser = req.user.role === 'admin' || req.user.role === 'owner';

        if (!isSuperUser) {
            // Manager ve diğer alt roller sadece kendi şubesini görür
            if (req.user.branchId) {
                where.branchId = req.user.branchId;
                userWhere.branchId = req.user.branchId;
            } else {
                return res.success([]);
            }
        }

        // Admin veya Owner belirli bir şubeyi filtrelemek isterse (veya manager kendi şubesini zaten filtreledi)
        if (branchId) {
            where.branchId = branchId;
            userWhere.branchId = branchId;
        }

        if (role) {
            where.role = role;
            userWhere.role = role;
        } else {
            // If no specific role filter, exclude customers from User table
            userWhere.role = { not: 'customer' };
        }

        if (search) {
            where.name = { contains: search };
            userWhere.name = { contains: search };
        }

        // Fetch from both tables
        const [employees, staffUsers] = await Promise.all([
            prisma.employee.findMany({
                where,
                include: { branch: { select: { name: true } } },
                orderBy: { name: 'asc' }
            }),
            prisma.user.findMany({
                where: userWhere,
                include: { branch: { select: { name: true } } },
                orderBy: { name: 'asc' }
            })
        ]);

        // Merge and Map to common structure
        const combined = [
            ...staffUsers.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                phone: '-', // User table has no phone
                status: 'Active',
                branchId: u.branchId,
                branchName: u.branch?.name || 'Genel Merkez',
                isUserAccount: true,
                permissions: typeof u.permissions === 'string' ? JSON.parse(u.permissions || '{}') : (u.permissions || {})
            })),
            ...employees.map(emp => ({
                ...emp,
                branchName: emp.branch?.name || 'Genel Merkez',
                isUserAccount: false
            }))
        ];

        // Sort combined list by name
        combined.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

        res.success(combined);
    } catch (error) {
        console.error('Personnel Fetch Error:', error);
        res.error(error.message, 500);
    }
});

// Create new employee
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, role, phone, status, rating, email, permissions } = req.body;

        // Role Assignment Validation
        if (role === 'admin' && req.user.role !== 'admin') {
            return res.forbidden('Süper Admin hesabı sadece sistem yöneticileri tarafından oluşturulabilir.');
        }

        // Use manager's branchId if available
        const branchId = req.user.branchId || req.body.branchId || null;

        // If email is provided, we create a User account for login
        if (email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) return res.badRequest('Bu e-posta adresi zaten kullanımda.');

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    role,
                    branchId,
                    permissions: permissions ? JSON.stringify(permissions) : '{}',
                    // Default password can be 123456 or handled by a reset later
                    password: await require('bcryptjs').hash('123456', 10)
                }
            });

            await createAuditLog('User', newUser.id, 'CREATE_STAFF', req.user ? req.user.id : null, null, newUser);
            return res.success(newUser, "Personel hesabı başarıyla oluşturuldu.", 201);
        }

        // Otherwise create as offline Employee
        const newEmployee = await prisma.employee.create({
            data: {
                name,
                role,
                phone,
                status: status || 'Aktif',
                rating: parseFloat(rating) || 5.0,
                branchId
            }
        });
        await createAuditLog('Employee', newEmployee.id, 'CREATE', req.user ? req.user.id : null, null, newEmployee);
        res.success(newEmployee, "Saha personeli başarıyla oluşturuldu.", 201);
    } catch (error) {
        res.error(error.message, 500);
    }
});

// Update employee or user account
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, phone, status, rating, email, permissions } = req.body;

        // Try to find in User table first
        let currentRecord = await prisma.user.findUnique({ where: { id } });
        let isUser = true;

        if (!currentRecord) {
            currentRecord = await prisma.employee.findUnique({ where: { id } });
            isUser = false;
        }

        if (!currentRecord) return res.notFound('Personel bulunamadı.');

        // Branch Isolation Check
        if (req.user.role !== 'admin' && currentRecord.branchId && currentRecord.branchId !== req.user.branchId) {
            return res.forbidden('Bu personeli güncelleme yetkiniz yok.');
        }

        // Role Assignment Validation
        if (role === 'admin' && req.user.role !== 'admin') {
            return res.forbidden('Bir personeli Süper Admin yapma yetkiniz yok.');
        }

        let updatedRecord;
        if (isUser) {
            updatedRecord = await prisma.user.update({
                where: { id },
                data: {
                    name,
                    role,
                    email,
                    permissions: permissions ? JSON.stringify(permissions) : currentRecord.permissions
                }
            });
        } else {
            updatedRecord = await prisma.employee.update({
                where: { id },
                data: {
                    name,
                    role,
                    phone,
                    status,
                    rating: parseFloat(rating)
                }
            });
        }

        await createAuditLog(isUser ? 'User' : 'Employee', id, 'UPDATE', req.user ? req.user.id : null, currentRecord, updatedRecord);
        res.success(updatedRecord);
    } catch (error) {
        res.error(error.message, 500);
    }
});

// Delete employee or user account
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        let currentRecord = await prisma.user.findUnique({ where: { id } });
        let isUser = true;

        if (!currentRecord) {
            currentRecord = await prisma.employee.findUnique({ where: { id } });
            isUser = false;
        }

        if (!currentRecord) return res.notFound('Personel bulunamadı.');

        // Branch Isolation Check
        if (req.user.role !== 'admin' && currentRecord.branchId && currentRecord.branchId !== req.user.branchId) {
            return res.forbidden('Bu personeli silme yetkiniz yok.');
        }

        if (isUser) {
            // Users are usually not soft deleted in current setup or we can use deletedAt if schema supports
            // But for now let's just delete or set role to 'deleted'
            await prisma.user.delete({ where: { id } });
        } else {
            await prisma.employee.softDelete(id);
        }

        await createAuditLog({
            entityType: isUser ? 'User' : 'Employee',
            entityId: id,
            action: 'DELETE',
            description: `Personel silindi: ${currentRecord.name}`,
            req
        });

        res.success(null, 'Personel başarıyla silindi.');
    } catch (error) {
        res.error(error.message, 500);
    }
});

module.exports = router;
