const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

// 1. Authenticate Middleware (Kimlik Doğrulama)
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Erişim reddedildi. Token bulunamadı.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id: '...', role: 'admin', ... }
        next();
    } catch (error) {
        console.error(`[AUTH ERROR] Token verification failed (TraceID: ${req.traceId}):`, error.message);
        return res.status(403).json({
            error: 'Geçersiz veya süresi dolmuş token.',
            code: 'TOKEN_INVALID_OR_EXPIRED',
            details: error.message,
            traceId: req.traceId
        });
    }
};

// 2. Authorize Middleware (Yetkilendirme)
// Kullanım: router.post('/delete', authenticate, authorize(['admin']), ...);
const authorize = (roles = []) => {
    // roles parametresi string ise array'e çevir
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Kullanıcı oturumu bulunamadı.' });
        }

        // Eğer izin verilen roller listesinde kullanıcının rolü yoksa
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz yok.' });
        }

        next();
    };
};

module.exports = { authenticate, authorize };
