const express = require('express');
const router = express.Router();
const { prisma, createAuditLog } = require('../prismaClient');
const { authenticate } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { branchSchema } = require('../schemas');

// @route   GET /api/branches/me
// @desc    Get current user's branch details
router.get('/me', authenticate, async (req, res) => {
    try {
        if (!req.user.branchId) {
            return res.status(404).json({ error: 'Kullanıcıya ait şube bulunamadı.' });
        }

        const branch = await prisma.branch.findUnique({
            where: { id: req.user.branchId },
            include: {
                _count: {
                    select: { orders: true, services: true }
                }
            }
        });

        if (!branch) {
            return res.status(404).json({ error: 'Şube kaydı bulunamadı.' });
        }

        res.json(branch);
    } catch (error) {
        console.error('Branch Me Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/branches
// @desc    Get all branches (Admin only or limited list)
router.get('/', authenticate, async (req, res) => {
    try {
        // Eğer admin değilse sadece aktif şubeleri veya boş liste döndürebiliriz
        // Ancak genelde şube listesi admin paneli içindir.
        // Dropdown için basit liste gerekiyorsa:

        let where = {};
        if (req.query.status) {
            where.status = req.query.status;
        } else {
            // Default: Only active branches for dropdowns/lists
            where.isActive = true;
        }

        // Rol Bazlı Şube İzolasyonu
        if (req.user.role !== 'admin') {
            if (!req.user.branchId) {
                return res.json([]);
            }

            if (req.user.role === 'owner') {
                // Owner: Kendi Şubesi (Merkez) ve Alt Şubeleri
                // Not: where objesi içine OR eklerken dikkatli olmalıyız, çakışma olmasın.
                where.OR = [
                    { id: req.user.branchId },
                    { parentId: req.user.branchId }
                ];
            } else {
                // Manager/User: Sadece Kendi Şubesi
                where.id = req.user.branchId;
            }
        }

        const branches = await prisma.branch.findMany({
            where,
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                city: true,
                district: true,
                status: true,
                phone: true,
                isActive: true,
                address: true,
                rating: true,
                minOrderAmount: true,
                servisModuleEnabled: true,
                latitude: true,
                longitude: true
            }
        });

        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/branches/all
// @desc    Get all branches detailed (Admin only)
router.get('/all', authenticate, async (req, res) => {
    try {
        // İzin kontrolü: Admin veya Owner
        if (req.user.role !== 'admin' && req.user.role !== 'owner') {
            return res.status(403).json({ error: 'Yetkisiz erişim.' });
        }

        let where = {}; // Admin için tüm şubeler

        // Owner ise sadece kendi şubesi ve varsa alt şubeleri
        if (req.user.role === 'owner') {
            const userBranchId = req.user.branchId;
            if (!userBranchId) {
                return res.status(400).json({ error: 'Kullanıcıya ait şube bulunamadı.' });
            }
            where = {
                OR: [
                    { id: userBranchId },
                    { parentId: userBranchId }
                ]
            };
        }

        const branches = await prisma.branch.findMany({
            where,
            include: {
                _count: {
                    select: { orders: true, services: true, customers: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/branches/:id/slots
// @desc    Get timeslots for a branch
router.get('/:id/slots', async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await prisma.branch.findUnique({ where: { id } });

        if (!branch) return res.status(404).json({ error: 'Şube bulunamadı' });

        // Basit saat dilimi üretimi (09:00 - 18:00 arası 1 saatlik)
        // Gerçek implementasyonda doluluk oranına bakılabilir
        const slots = [];
        const startHour = branch.servisHoursStart ? parseInt(branch.servisHoursStart.split(':')[0]) : 9;
        const endHour = branch.servisHoursEnd ? parseInt(branch.servisHoursEnd.split(':')[0]) : 18;

        for (let i = startHour; i < endHour; i++) {
            const time = `${i.toString().padStart(2, '0')}:00`;
            slots.push({ time, available: true });

            // Yarım saatlik eklemek isterseniz:
            // const timeHalf = `${i.toString().padStart(2, '0')}:30`;
            // slots.push({ time: timeHalf, available: true });
        }

        res.json(slots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/branches/:id
// @desc    Get single branch
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await prisma.branch.findUnique({
            where: { id },
            include: {
                financialConfig: true
            }
        });

        if (!branch) return res.status(404).json({ error: 'Şube bulunamadı' });

        // Yetki kontrolü (sadece admin veya o şubenin yetkilisi)
        if (req.user.role !== 'admin' && req.user.branchId !== id) {
            return res.status(403).json({ error: 'Bu şube detaylarını görme yetkiniz yok.' });
        }

        res.json(branch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/branches
// @desc    Create new branch (Admin only)
router.post('/', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Bu işlemi sadece sistem yöneticileri yapabilir.' });
        }

        // Admin creates a normal branch
        const branchData = {
            ...req.body,
            status: 'Aktif',
            isActive: true
        };

        const newBranch = await prisma.branch.create({
            data: branchData
        });

        await createAuditLog('BRANCH', newBranch.id, 'CREATE', req.user.id, null, newBranch);

        res.status(201).json(newBranch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /api/branches/:id
// @desc    Update branch details
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.branch.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Şube bulunamadı' });

        if (req.user.role !== 'admin' && req.user.branchId !== id) {
            return res.status(403).json({ error: 'Yetkisiz işlem.' });
        }

        const updatedBranch = await prisma.branch.update({
            where: { id },
            data: req.body
        });

        await createAuditLog('BRANCH', id, 'UPDATE', req.user.id, existing, updatedBranch);

        res.json(updatedBranch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
