const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { prisma, createAuditLog } = require('../prismaClient');
const { authenticate } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { customerSchema } = require('../schemas');

// GET /api/customers/me - Get current customer profile
router.get('/me', authenticate, async (req, res) => {
    try {
        const { branchId } = req.query;

        let customer = await prisma.customer.findFirst({
            where: {
                email: req.user.email,
                deletedAt: null,
                ...(branchId ? { branchId } : {})
            },
            include: {
                orders: {
                    where: {
                        deletedAt: null,
                        ...(branchId ? { branchId } : {})
                    },
                    include: {
                        items: true,
                        branch: { select: { name: true } }
                    },
                    orderBy: { date: 'desc' },
                    take: 50
                }
            }
        });

        if (!customer) {
            customer = await prisma.customer.findFirst({
                where: { email: req.user.email, deletedAt: null },
                include: {
                    orders: {
                        where: {
                            deletedAt: null,
                            ...(branchId ? { branchId } : {})
                        },
                        include: {
                            items: true,
                            branch: { select: { name: true } }
                        },
                        orderBy: { date: 'desc' },
                        take: 50
                    }
                }
            });
        }

        if (!customer) {
            return res.status(404).json({ error: 'Müşteri profili bulunamadı.' });
        }

        if (branchId) {
            const branchStats = await prisma.order.aggregate({
                where: {
                    customerId: customer.id,
                    branchId: branchId,
                    deletedAt: null
                },
                _count: { id: true },
                _sum: { amount: true }
            });
            customer.totalOrders = branchStats._count.id;
            customer.totalSpent = branchStats._sum.amount || 0;
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/customers - List customers with stats and branch info
router.get('/', authenticate, async (req, res) => {
    try {
        const { search, branchId: queryBranchId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let where = {};

        // Branch Isolation Logic
        let isolatedBranchId = queryBranchId;
        if (req.user.role !== 'admin' && req.user.branchId) {
            isolatedBranchId = req.user.branchId;
        }

        if (isolatedBranchId) {
            where.branchId = isolatedBranchId;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const total = await prisma.customer.count({ where });

        const customers = await prisma.customer.findMany({
            where,
            skip: req.query.page ? skip : undefined,
            take: req.query.page ? limit : undefined,
            include: {
                orders: {
                    include: {
                        items: true,
                        branch: { select: { id: true, name: true } }
                    },
                    orderBy: { date: 'desc' },
                    take: 50
                }
            },
            orderBy: { lastOrderDate: 'desc' }
        });

        const customerIds = customers.map(c => c.id);
        const branchStats = await prisma.order.groupBy({
            by: ['customerId'],
            where: {
                customerId: { in: customerIds },
                deletedAt: null,
                ...(isolatedBranchId ? { branchId: isolatedBranchId } : {})
            },
            _count: { id: true },
            _sum: { amount: true },
            _max: { date: true }
        });

        let customerBranchesMap = {};
        const allCustomerOrders = await prisma.order.findMany({
            where: { customerId: { in: customerIds }, deletedAt: null },
            select: { customerId: true, branch: { select: { name: true } } }
        });

        allCustomerOrders.forEach(o => {
            if (!o.branch) return;
            if (!customerBranchesMap[o.customerId]) customerBranchesMap[o.customerId] = new Set();
            customerBranchesMap[o.customerId].add(o.branch.name);
        });

        const statsMap = branchStats.reduce((acc, stat) => {
            acc[stat.customerId] = {
                count: stat._count.id,
                spent: stat._sum.amount || 0,
                lastDate: stat._max.date
            };
            return acc;
        }, {});

        const emails = customers.map(c => c.email).filter(Boolean);
        const users = await prisma.user.findMany({
            where: { email: { in: emails } },
            select: { email: true, googleId: true, role: true }
        });

        const userMap = users.reduce((acc, u) => {
            acc[u.email] = u;
            return acc;
        }, {});

        const formattedCustomers = customers.map(c => {
            const stats = statsMap[c.id] || { count: 0, spent: 0, lastDate: null };
            const branches = customerBranchesMap[c.id] ? Array.from(customerBranchesMap[c.id]) : [];
            const user = userMap[c.email];

            return {
                ...c,
                isGoogleUser: !!user?.googleId,
                hasAccount: !!user,
                totalOrders: stats.count,
                totalSpent: stats.spent,
                branches: branches,
                lastOrderDate: stats.lastDate ? new Date(stats.lastDate).toLocaleString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-',
                history: c.orders.map(o => ({
                    ...o,
                    branchName: o.branch?.name || '-',
                    date: new Date(o.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
                    dueDate: new Date(o.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
                }))
            };
        });

        if (req.query.page) {
            res.json({
                data: formattedCustomers,
                meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
            });
        } else {
            res.json(formattedCustomers);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/customers/:id - Get single customer details
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                orders: {
                    where: {
                        deletedAt: null,
                        ...(req.user.role !== 'admin' && req.user.branchId ? { branchId: req.user.branchId } : {})
                    },
                    include: { items: true, branch: { select: { name: true } } },
                    orderBy: { date: 'desc' },
                    take: 50
                }
            }
        });

        if (!customer) return res.status(404).json({ error: 'Müşteri bulunamadı.' });

        // Isolation Check
        if (req.user.role !== 'admin' && customer.branchId && customer.branchId !== req.user.branchId) {
            // Check if they have orders in this branch
            const hasOrderAtThisBranch = await prisma.order.findFirst({
                where: { customerId: id, branchId: req.user.branchId }
            });
            if (!hasOrderAtThisBranch) {
                return res.status(403).json({ error: 'Bu müşterinin bilgilerine erişim yetkiniz yok.' });
            }
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/customers - Create new customer
router.post('/', authenticate, validate(customerSchema), async (req, res) => {
    try {
        const { name, phone, address, email, branchId: reqBranchId } = req.body;

        let branchId = req.user.branchId || null;
        if (req.user.role === 'admin' && reqBranchId) {
            branchId = reqBranchId;
        }

        const newCustomer = await prisma.customer.create({
            data: { name, phone, address, email, branchId }
        });

        await createAuditLog('CUSTOMER', newCustomer.id, 'CREATE', req.user.id, null, newCustomer);
        res.json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', authenticate, validate(customerSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.customer.findUnique({ where: { id } });

        if (!existing) return res.status(404).json({ error: 'Müşteri bulunamadı.' });

        // Authorization Check
        if (req.user.role !== 'admin' && existing.branchId && existing.branchId !== req.user.branchId) {
            const hasOrderAtThisBranch = await prisma.order.findFirst({
                where: { customerId: id, branchId: req.user.branchId }
            });
            if (!hasOrderAtThisBranch) {
                return res.status(403).json({ error: 'Bu müşteriyi güncellemeye yetkiniz yok.' });
            }
        }

        const { name, phone, address, email, branchId: reqBranchId } = req.body;

        const updateData = { name, phone, address, email };

        // Allow admin to update branchId
        if (req.user.role === 'admin' && reqBranchId !== undefined) {
            updateData.branchId = reqBranchId;
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id },
            data: updateData
        });

        await createAuditLog('CUSTOMER', id, 'UPDATE', req.user.id, existing, updatedCustomer);
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/customers/:id - Delete customer
// DELETE /api/customers/:id - Delete customer
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { forceDelete } = req.body; // Check for force delete flag

        const customer = await prisma.customer.findUnique({
            where: { id },
            include: { _count: { select: { orders: true } } }
        });

        if (!customer) return res.status(404).json({ error: 'Müşteri bulunamadı.' });

        if (req.user.role !== 'admin' && customer.branchId && customer.branchId !== req.user.branchId) {
            return res.status(403).json({ error: 'Bu müşteriyi silmeye yetkiniz yok.' });
        }

        // Check for existing orders (only active ones)
        if (customer._count.orders > 0) {
            if (!forceDelete) {
                return res.status(400).json({
                    error: `Bu müşteriye ait aktif ${customer._count.orders} adet sipariş kaydı var. Müşteri silinemez.`,
                    requiresConfirmation: true,
                    orderCount: customer._count.orders
                });
            }

            // Soft delete everything in transaction
            await prisma.$transaction(async (tx) => {
                const affectedOrders = await tx.order.findMany({
                    where: { customerId: id },
                    select: { id: true }
                });
                const orderIds = affectedOrders.map(o => o.id);

                // Delete related transactions
                if (orderIds.length > 0) {
                    await tx.transaction.updateMany({
                        where: { orderId: { in: orderIds } },
                        data: { deletedAt: new Date() }
                    });
                }

                // Delete orders using the model method (which is now soft-delete)
                await tx.order.updateMany({
                    where: { customerId: id },
                    data: { deletedAt: new Date() }
                });

                // Delete customer
                await tx.customer.update({
                    where: { id },
                    data: { deletedAt: new Date() }
                });

                await createAuditLog({
                    entityType: 'CUSTOMER',
                    entityId: id,
                    action: 'FORCE_DELETE',
                    actionCategory: 'CRUD',
                    description: `Müşteri (${customer.name}) ve ${customer._count.orders} siparişi zorunlu olarak silindi.`,
                    req
                });
            });
            return res.json({ message: 'Müşteri ve ilişkili tüm siparişler başarıyla silindi.' });
        }

        // Normal soft delete using the extension
        await prisma.customer.softDelete(id);

        await createAuditLog({
            entityType: 'CUSTOMER',
            entityId: id,
            action: 'DELETE',
            actionCategory: 'CRUD',
            description: `Müşteri silindi: ${customer.name}`,
            req
        });

        res.json({ message: 'Müşteri başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- PASSWORD MANAGEMENT ---

// POST /api/customers/:id/reset-password - Reset customer password
router.post('/:id/reset-password', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body; // Optional: if empty, set default

        if (req.user.role === 'user' || req.user.role === 'courier') {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz yok.' });
        }

        const customer = await prisma.customer.findUnique({ where: { id } });
        if (!customer || !customer.email) {
            return res.status(404).json({ error: 'Müşteri veya e-posta adresi bulunamadı.' });
        }

        const userAccount = await prisma.user.findUnique({ where: { email: customer.email } });
        if (!userAccount) {
            return res.status(404).json({ error: 'Bu müşteriye ait bir kullanıcı hesabı bulunamadı.' });
        }

        const passwordToSet = newPassword || '123456';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordToSet, salt);

        await prisma.user.update({
            where: { id: userAccount.id },
            data: { password: hashedPassword }
        });

        await createAuditLog('USER_ACCOUNT', userAccount.id, 'PASSWORD_RESET', req.user.id, null, { target: customer.name });

        res.json({ message: `Şifre başarıyla sıfırlandı. Yeni şifre: ${passwordToSet}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
