import React, { useState } from 'react';
import {
    User,
    Phone,
    MapPin,
    Star,
    MoreVertical,
    Plus,
    Search,
    Filter,
    Briefcase,
    Mail,
    Shield,
    Zap,
    CheckCircle2,
    X,
    Edit3,
    Trash2,
    Activity,
    Users,
    Building2,
    ArrowUpDown,
    Save
} from 'lucide-react';
import {
    usePersonnel,
    useCreatePersonnel,
    useUpdatePersonnel,
    useDeletePersonnel,
    useResetPersonnelPassword,
    useBranches,
    Personnel as PersonnelType
} from '../hooks';
import { useAuth } from '../context/AuthContext';
import PremiumPanel from './ui/PremiumPanel';
import EmptyState from './EmptyState';
import { TableSkeleton } from './Skeleton';

const Personnel: React.FC = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        name: '', role: 'user', phone: '', email: '', status: 'Active', branchId: '',
        permissions: { orders: true, customers: true, reports: true, inventory: true, accounting: true, settings: true, personnel: true }
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

    const [roleFilter, setRoleFilter] = useState('all');
    const [branchFilter, setBranchFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    const { data: employees = [], isLoading: loading, refetch } = usePersonnel({
        search: searchTerm,
        role: roleFilter === 'all' ? undefined : roleFilter as any,
        branchId: user?.role === 'manager' ? user.branchId : (branchFilter === 'all' ? undefined : branchFilter)
    });

    const createMutation = useCreatePersonnel();
    const updateMutation = useUpdatePersonnel();
    const deleteMutation = useDeletePersonnel();
    const resetPasswordMutation = useResetPersonnelPassword();
    const { data: branches = [] } = useBranches();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateMutation.mutateAsync({ id: editingId, ...formData });
            } else {
                await createMutation.mutateAsync(formData);
            }
            closeForm();
        } catch (error) { }
    };

    const openCreateForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            role: 'user',
            phone: '',
            email: '',
            status: 'Active',
            branchId: user?.role === 'manager' ? user.branchId : '',
            permissions: { orders: true, customers: true, reports: true, inventory: true, accounting: true, settings: true, personnel: true }
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: '', role: 'user', phone: '', email: '', status: 'Active', branchId: '', permissions: { orders: true, customers: true, reports: true, inventory: true, accounting: true, settings: true, personnel: true } });
    };

    const handleResetPassword = async (id: string, name: string) => {
        if (!window.confirm(`${name} isimli personelin şifresi sıfırlanacak (Varsayılan: 123456). Onaylıyor musunuz?`)) return;
        try {
            await resetPasswordMutation.mutateAsync({ id, newPassword: '123456' });
        } catch (error) { }
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteTarget({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
        } catch (error) { }
    };

    const handleEdit = (employee: PersonnelType) => {
        setEditingId(employee.id);
        setFormData({
            name: employee.name,
            role: employee.role,
            phone: employee.phone,
            email: (employee as any).email || '',
            status: employee.status || 'Active',
            branchId: employee.branchId || '',
            permissions: (employee as any).permissions || { orders: true, customers: true, reports: true, inventory: true, accounting: true, settings: true, personnel: true }
        });
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-1 w-12 bg-primary/20 rounded-full"></div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">İnsan Kaynakları & Operasyon</span>
                    </div>
                    <h1 className="text-4xl font-black text-theme-main tracking-tight uppercase">Ekip <span className="text-primary italic">Yönetimi</span></h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={() => refetch()}
                        className="p-4 bg-theme-card border border-theme rounded-2xl text-theme-muted hover:text-primary transition-all shadow-xl"
                    >
                        <Activity size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={openCreateForm}
                        className="px-8 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Yeni Personel
                    </button>
                </div>
            </div>

            {/* Inline Entry Form Panel - Positioned at Top */}
            {isFormOpen && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in slide-in-from-top-5 duration-300">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-8 py-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                        <Users size={20} className="text-primary" />
                                    </div>
                                    {editingId ? 'Personel Güncelle' : 'Yeni Personel Ekle'}
                                </h2>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 ml-13">Personel bilgilerini sisteme kaydedin</p>
                            </div>
                            <button
                                onClick={closeForm}
                                className="p-3 bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 hover:text-red-500 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {/* Name */}
                            <div className="space-y-2 xl:col-span-2">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">İsim Soyisim</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ad ve soyadı girin..."
                                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Rol</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <select
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        {user?.role === 'admin' && <option value="admin">Süper Admin</option>}
                                        {(user?.role === 'admin' || user?.role === 'owner') && <option value="owner">Firma Sahibi</option>}
                                        {(user?.role === 'admin' || user?.role === 'owner' || user?.role === 'manager') && <option value="manager">Yönetici</option>}
                                        <option value="user">Personel</option>
                                        <option value="servis">Servis (Saha)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Telefon</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="05XX XXX XXXX"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Branch */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Şube</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <select
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-not-allowed disabled:opacity-70"
                                        value={formData.branchId}
                                        disabled={user?.role === 'manager'}
                                        onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                                    >
                                        <option value="">Şube Seçin...</option>
                                        {branches
                                            .filter(b => user?.role !== 'manager' || b.id === user.branchId)
                                            .map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Durum</label>
                                <select
                                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Aktif</option>
                                    <option value="Inactive">Pasif</option>
                                </select>
                            </div>
                        </div>

                        {/* Email - Full Width Row */}
                        <div className="mt-6 space-y-2">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">E-Posta (Opsiyonel)</label>
                            <div className="relative max-w-md">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Yetki Paketi (Only for Managers) */}
                        {formData.role === 'manager' && (
                            <div className="mt-10 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Yetki Paketi (Modül Erişimi)</h3>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Yöneticinin hangi modülleri görebileceğini seçin</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { id: 'orders', label: 'Siparişler', icon: <Zap size={14} /> },
                                        { id: 'customers', label: 'Müşteriler', icon: <Users size={14} /> },
                                        { id: 'reports', label: 'Raporlar', icon: <Star size={14} /> },
                                        { id: 'inventory', label: 'Envanter', icon: <Briefcase size={14} /> },
                                        { id: 'accounting', label: 'Muhasebe', icon: <Activity size={14} /> },
                                        { id: 'settings', label: 'Ayarlar', icon: <Building2 size={14} /> },
                                        { id: 'personnel', label: 'Personel', icon: <User size={14} /> },
                                    ].map(mod => (
                                        <label key={mod.id} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-primary/20 transition-all group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-lg border-2 border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                                checked={formData.permissions?.[mod.id] !== false}
                                                onChange={e => setFormData({
                                                    ...formData,
                                                    permissions: { ...formData.permissions, [mod.id]: e.target.checked }
                                                })}
                                            />
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter">
                                                    {mod.icon} {mod.label}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 group-hover:text-primary transition-colors">Modül Erişimi</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm uppercase tracking-wider transition-all"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {(createMutation.isPending || updateMutation.isPending) ? <Activity className="animate-spin" size={16} /> : <Save size={16} />}
                                {editingId ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Quick Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-theme-card p-8 rounded-[2.5rem] border border-theme shadow-xl group hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Users size={22} />
                        </div>
                        <span className="text-[9px] font-black text-theme-muted uppercase tracking-widest">Aktif Kadro</span>
                    </div>
                    <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest mb-1">Toplam Personel</p>
                    <h3 className="text-3xl font-black text-theme-main italic underline decoration-4 decoration-primary underline-offset-8">{employees.length}</h3>
                </div>
                <div className="bg-theme-card p-8 rounded-[2.5rem] border border-theme shadow-xl group hover:border-emerald-500/20 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <Shield size={22} />
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Erişim Kontrol</span>
                    </div>
                    <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest mb-1">Yetkili Sayısı</p>
                    <h3 className="text-3xl font-black text-emerald-500 italic underline decoration-4 decoration-emerald-500/30 underline-offset-8">
                        {employees.filter(e => e.role === 'admin' || e.role === 'manager').length}
                    </h3>
                </div>
                <div className="bg-theme-card p-8 rounded-[2.5rem] border border-theme shadow-xl group hover:border-amber-500/20 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Zap size={22} />
                        </div>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Performans</span>
                    </div>
                    <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest mb-1">Hizmet Puanı</p>
                    <h3 className="text-3xl font-black text-amber-500 italic underline decoration-4 decoration-amber-500/30 underline-offset-8">4.9</h3>
                </div>
                <div className="bg-navy-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Star size={80} />
                    </div>
                    <p className="text-steel-400 text-[9px] font-black uppercase tracking-widest mb-1">Ayın Elemanı</p>
                    <h3 className="text-xl font-black tracking-tight mt-2">Ahmet K.</h3>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Çevrimiçi</span>
                    </div>
                </div>
            </div>

            {/* List Control Panel */}
            <div className="glass-panel p-10 rounded-[3rem] border border-white/20 shadow-premium space-y-8">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-8 border-b border-theme/10">
                    <div>
                        <h2 className="text-3xl font-black text-navy-900 tracking-tight italic">Ekip <span className="text-primary">Kadro Listesi</span></h2>
                        <p className="text-[10px] font-bold text-theme-muted uppercase tracking-[0.2em] mt-1">Personel Rol, Şube ve İletişim Verileri</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group w-full md:w-64">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="İsim ile ara..."
                                className="w-full pl-14 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-theme-main outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-bold text-[10px] uppercase tracking-widest text-navy-900 cursor-pointer"
                        >
                            <option value="all">Tüm Roller</option>
                            <option value="manager">Yönetici</option>
                            <option value="servis">Servis</option>
                            <option value="user">Personel</option>
                        </select>
                        {(user?.role === 'admin' || user?.role === 'owner') && (
                            <select
                                value={branchFilter}
                                onChange={(e) => setBranchFilter(e.target.value)}
                                className="px-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-bold text-[10px] uppercase tracking-widest text-navy-900 cursor-pointer"
                            >
                                <option value="all">Tüm Şubeler</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 rounded-2xl">
                                <th className="px-8 py-5 text-[10px] font-black text-theme-muted uppercase tracking-widest">İsim Soyisim</th>
                                <th className="px-8 py-5 text-[10px] font-black text-theme-muted uppercase tracking-widest">Rol & Pozisyon</th>
                                <th className="px-8 py-5 text-[10px] font-black text-theme-muted uppercase tracking-widest">Bağlı Firma</th>
                                <th className="px-8 py-5 text-[10px] font-black text-theme-muted uppercase tracking-widest">Durum</th>
                                <th className="px-8 py-5 text-[10px] font-black text-theme-muted uppercase tracking-widest text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-theme/50">
                            {loading ? (
                                <tr><td colSpan={5} className="py-20"><TableSkeleton rows={5} cols={5} /></td></tr>
                            ) : employees.length === 0 ? (
                                <tr><td colSpan={5} className="py-20 text-center text-theme-muted uppercase font-black text-xs opacity-40 italic">Kayıtlı personel bulunamadı.</td></tr>
                            ) : employees.map(employee => (
                                <tr key={employee.id} className="group hover:bg-white/40 transition-all">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white border-2 border-gray-50 rounded-[1.5rem] flex items-center justify-center text-lg font-black text-navy-900 shadow-sm group-hover:border-primary/30 group-hover:shadow-primary/10 transition-all">
                                                {employee.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-navy-900 text-sm group-hover:text-primary transition-colors">{employee.name}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-theme-muted uppercase tracking-[0.1em]">
                                                        <Phone size={10} className="text-primary" /> {employee.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2.5 bg-primary/5 px-4 py-2 rounded-xl w-fit">
                                            <Briefcase size={12} className="text-primary" />
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                                {employee.role === 'admin' ? 'Süper Admin' :
                                                    employee.role === 'owner' ? 'Firma Sahibi' :
                                                        employee.role === 'manager' ? 'Yönetici' :
                                                            (employee.role === 'servis' || employee.role === 'courier') ? 'Saha Operasyon' :
                                                                employee.role === 'user' ? 'Personel' : employee.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <Building2 size={16} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-navy-900 uppercase tracking-widest">
                                                    {employee.branchName || 'Genel Merkez'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${employee.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${employee.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            {employee.status === 'Active' ? 'Aktif' : 'Pasif'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button onClick={() => handleResetPassword(employee.id, employee.name)} title="Şifre Sıfırla" className="p-3 bg-white border border-gray-100 rounded-xl text-theme-muted hover:text-amber-500 hover:border-amber-100 transition-all shadow-sm">
                                                <Shield size={16} />
                                            </button>
                                            <button onClick={() => handleEdit(employee)} className="p-3 bg-white border border-gray-100 rounded-xl text-theme-muted hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(employee.id, employee.name)} className="p-3 bg-white border border-gray-100 rounded-xl text-theme-muted hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Premium Panel */}
            <PremiumPanel
                isOpen={isDeleteModalOpen && !!deleteTarget}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Personeli Sil"
                subtitle="Personel kaydı ve ilişkili tüm veriler kalıcı olarak silinecektir."
                icon={Trash2}
                variant="center"
                maxWidth="sm"
                category="Kritik İşlem"
            >
                {deleteTarget && (
                    <div className="space-y-8">
                        <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100 text-center relative overflow-hidden group">
                            {/* Background Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-red-500/10 flex items-center justify-center text-red-600 mb-6 group-hover:rotate-12 transition-transform">
                                    <User size={32} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl font-black text-navy-900 mb-2 uppercase tracking-tight italic">
                                    {deleteTarget.name}
                                </h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
                                    Sistem Personeli
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="w-full py-5 bg-red-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? (
                                    <Activity className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <Trash2 size={18} strokeWidth={3} />
                                        Evet, Sil
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-full py-5 bg-gray-50 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                )}
            </PremiumPanel>
        </div>
    );
};

export default Personnel;
