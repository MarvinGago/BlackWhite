// ===========================
// API FUNCTIONS - Sistema Black White
// Base de datos simulada con localStorage
// ===========================

console.log('🚀 Inicializando API Functions...');

// ===========================
// UTILIDADES GENERALES
// ===========================

/**
 * Inicializa la base de datos local si no existe
 */
function initializeDatabase() {
    const tables = [
        'clients',
        'users', 
        'appointments',
        'services',
        'invoices',
        'campaigns',
        'promotions',
        'coupons',
        'attendance',
        'incidents',
        'waitingList',
        'packages',
        'bitacora'
    ];

    tables.forEach(table => {
        if (!localStorage.getItem(table)) {
            localStorage.setItem(table, JSON.stringify([]));
        }
    });

    // Inicializar configuración
    if (!localStorage.getItem('config')) {
        const defaultConfig = {
            businessName: 'Black White',
            phone: '+506 2222-3333',
            email: 'info@blackwhite.com',
            hours: '9:00 AM - 8:00 PM',
            address: 'San José, Costa Rica',
            tax: 13,
            bufferMinutes: 15,
            bufferGlobal: 10,
            cashRegisterOpen: true
        };
        localStorage.setItem('config', JSON.stringify(defaultConfig));
    }

    // Datos iniciales de ejemplo
    initializeSampleData();
    
    console.log('✅ Base de datos inicializada');
}

/**
 * Genera un ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Obtiene todos los registros de una tabla
 */
function getAll(table) {
    try {
        const data = localStorage.getItem(table);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error al obtener datos de ${table}:`, error);
        return [];
    }
}

/**
 * Guarda todos los registros en una tabla
 */
function saveAll(table, data) {
    try {
        localStorage.setItem(table, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error al guardar datos en ${table}:`, error);
        return false;
    }
}

/**
 * Agrega un registro a una tabla
 */
function addRecord(table, record) {
    const records = getAll(table);
    record.id = record.id || generateId();
    record.createdAt = new Date().toISOString();
    records.push(record);
    saveAll(table, records);
    console.log(`➕ Registro agregado a ${table}:`, record.id);
    return record;
}

/**
 * Actualiza un registro en una tabla
 */
function updateRecord(table, id, updatedData) {
    const records = getAll(table);
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
        records[index] = { ...records[index], ...updatedData, updatedAt: new Date().toISOString() };
        saveAll(table, records);
        console.log(`✏️ Registro actualizado en ${table}:`, id);
        return records[index];
    }
    return null;
}

/**
 * Elimina un registro de una tabla
 */
function deleteRecord(table, id) {
    const records = getAll(table);
    const filtered = records.filter(r => r.id !== id);
    saveAll(table, filtered);
    console.log(`🗑️ Registro eliminado de ${table}:`, id);
    return filtered.length < records.length;
}

/**
 * Busca un registro por ID
 */
function findById(table, id) {
    const records = getAll(table);
    return records.find(r => r.id === id);
}

/**
 * Registra un evento en la bitácora
 */
function logEvent(user, action, details) {
    const log = {
        user: user,
        action: action,
        details: details,
        timestamp: new Date().toISOString()
    };
    addRecord('bitacora', log);
}

/**
 * Obtiene el usuario actual
 */
function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).userName : 'Sistema';
}

// ===========================
// CLIENTES
// ===========================

function apiGetClients() {
    return getAll('clients');
}

function apiAddClient(clientData) {
    const client = addRecord('clients', {
        ...clientData,
        totalServices: 0,
        status: 'active'
    });
    logEvent(getCurrentUser(), 'Cliente Registrado', `Cliente: ${client.name}`);
    return client;
}

function apiUpdateClient(id, clientData) {
    const updated = updateRecord('clients', id, clientData);
    if (updated) {
        logEvent(getCurrentUser(), 'Cliente Actualizado', `Cliente ID: ${id}`);
    }
    return updated;
}

function apiDeleteClient(id) {
    const client = findById('clients', id);
    if (deleteRecord('clients', id)) {
        logEvent(getCurrentUser(), 'Cliente Eliminado', `Cliente: ${client.name}`);
        return true;
    }
    return false;
}

function apiSearchClients(query) {
    const clients = getAll('clients');
    const lowerQuery = query.toLowerCase();
    return clients.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        (c.phone && c.phone.includes(query))
    );
}

// ===========================
// USUARIOS
// ===========================

function apiGetUsers() {
    return getAll('users');
}

function apiAddUser(userData) {
    const user = addRecord('users', {
        ...userData,
        status: 'active',
        permissions: []
    });
    logEvent(getCurrentUser(), 'Usuario Creado', `Usuario: ${user.userName}`);
    return user;
}

function apiUpdateUser(id, userData) {
    const updated = updateRecord('users', id, userData);
    if (updated) {
        logEvent(getCurrentUser(), 'Usuario Actualizado', `Usuario ID: ${id}`);
    }
    return updated;
}

function apiDeleteUser(id) {
    return deleteRecord('users', id);
}

function apiUpdatePermissions(userId, permissions) {
    const updated = updateRecord('users', userId, { permissions });
    if (updated) {
        logEvent(getCurrentUser(), 'Permisos Actualizados', `Usuario ID: ${userId}`);
    }
    return updated;
}

function apiLogin(email, password) {
    const users = getAll('users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        logEvent(user.userName, 'Inicio de Sesión', 'Login exitoso');
        return { success: true, user };
    }
    
    // Usuario admin por defecto
    if (email === 'admin@barberia.com' && password === 'admin123') {
        const adminUser = {
            id: 'admin',
            userName: 'Administrador',
            email: email,
            role: 'admin',
            permissions: ['all']
        };
        sessionStorage.setItem('currentUser', JSON.stringify(adminUser));
        logEvent('Administrador', 'Inicio de Sesión', 'Login exitoso');
        return { success: true, user: adminUser };
    }
    
    return { success: false, message: 'Credenciales incorrectas' };
}

function apiLogout() {
    const user = getCurrentUser();
    logEvent(user, 'Cierre de Sesión', 'Logout exitoso');
    sessionStorage.removeItem('currentUser');
}

// ===========================
// CITAS
// ===========================

function apiGetAppointments() {
    return getAll('appointments');
}

function apiAddAppointment(appointmentData) {
    const appointment = addRecord('appointments', {
        ...appointmentData,
        status: 'pending'
    });
    logEvent(getCurrentUser(), 'Cita Creada', `Cliente: ${appointmentData.clientName}, Fecha: ${appointmentData.date}`);
    return appointment;
}

function apiUpdateAppointment(id, appointmentData) {
    const updated = updateRecord('appointments', id, appointmentData);
    if (updated) {
        logEvent(getCurrentUser(), 'Cita Actualizada', `Cita ID: ${id}`);
    }
    return updated;
}

function apiDeleteAppointment(id) {
    const appointment = findById('appointments', id);
    if (deleteRecord('appointments', id)) {
        logEvent(getCurrentUser(), 'Cita Eliminada', `Cita ID: ${id}`);
        return true;
    }
    return false;
}

function apiGetAppointmentsByDate(date) {
    const appointments = getAll('appointments');
    return appointments.filter(a => a.date === date);
}

function apiGetAppointmentsByBarber(barber) {
    const appointments = getAll('appointments');
    return appointments.filter(a => a.barber === barber);
}

// ===========================
// SERVICIOS
// ===========================

function apiGetServices() {
    return getAll('services');
}

function apiAddService(serviceData) {
    const service = addRecord('services', {
        ...serviceData,
        status: 'active'
    });
    logEvent(getCurrentUser(), 'Servicio Creado', `Servicio: ${service.name}`);
    return service;
}

function apiUpdateService(id, serviceData) {
    const updated = updateRecord('services', id, serviceData);
    if (updated) {
        logEvent(getCurrentUser(), 'Servicio Actualizado', `Servicio ID: ${id}`);
    }
    return updated;
}

function apiDeleteService(id) {
    const service = findById('services', id);
    if (deleteRecord('services', id)) {
        logEvent(getCurrentUser(), 'Servicio Eliminado', `Servicio: ${service.name}`);
        return true;
    }
    return false;
}

// ===========================
// FACTURACIÓN
// ===========================

function apiGetInvoices() {
    return getAll('invoices');
}

function apiAddInvoice(invoiceData) {
    const invoices = getAll('invoices');
    const invoiceNumber = `F${String(invoices.length + 1).padStart(6, '0')}`;
    
    const invoice = addRecord('invoices', {
        ...invoiceData,
        invoiceNumber: invoiceNumber,
        status: 'paid',
        date: new Date().toISOString()
    });
    
    logEvent(getCurrentUser(), 'Factura Generada', `Factura: ${invoiceNumber}, Total: ₡${invoice.total}`);
    return invoice;
}

function apiGetInvoicesByDate(date) {
    const invoices = getAll('invoices');
    const targetDate = new Date(date).toDateString();
    return invoices.filter(inv => {
        const invDate = new Date(inv.date).toDateString();
        return invDate === targetDate;
    });
}

function apiGetInvoicesByDateRange(startDate, endDate) {
    const invoices = getAll('invoices');
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return invoices.filter(inv => {
        const invDate = new Date(inv.date).getTime();
        return invDate >= start && invDate <= end;
    });
}

// ===========================
// CAMPAÑAS Y MARKETING
// ===========================

function apiGetCampaigns() {
    return getAll('campaigns');
}

function apiAddCampaign(campaignData) {
    const campaign = addRecord('campaigns', {
        ...campaignData,
        status: 'active'
    });
    logEvent(getCurrentUser(), 'Campaña Creada', `Campaña: ${campaign.name}`);
    return campaign;
}

function apiGetPromotions() {
    return getAll('promotions');
}

function apiAddPromotion(promotionData) {
    const promotion = addRecord('promotions', {
        ...promotionData,
        status: 'active'
    });
    logEvent(getCurrentUser(), 'Promoción Creada', `Servicio: ${promotion.service}, Descuento: ${promotion.discount}%`);
    return promotion;
}

function apiDeletePromotion(id) {
    return deleteRecord('promotions', id);
}

function apiGetCoupons() {
    return getAll('coupons');
}

function apiAddCoupon(couponData) {
    const coupon = addRecord('coupons', {
        ...couponData,
        used: 0,
        status: 'active'
    });
    logEvent(getCurrentUser(), 'Cupón Creado', `Código: ${coupon.code}`);
    return coupon;
}

function apiDeleteCoupon(id) {
    return deleteRecord('coupons', id);
}

function apiValidateCoupon(code) {
    const coupons = getAll('coupons');
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.status === 'active');
    
    if (!coupon) return { valid: false, message: 'Cupón no válido' };
    
    const now = new Date();
    const expiry = new Date(coupon.expiry);
    
    if (now > expiry) {
        return { valid: false, message: 'Cupón expirado' };
    }
    
    return { valid: true, coupon };
}

// ===========================
// ASISTENCIAS
// ===========================

function apiGetAttendance() {
    return getAll('attendance');
}

function apiAddAttendance(attendanceData) {
    const attendance = addRecord('attendance', attendanceData);
    logEvent(getCurrentUser(), 'Asistencia Registrada', `Empleado: ${attendanceData.employee}`);
    return attendance;
}

function apiGetAttendanceByDate(date) {
    const attendance = getAll('attendance');
    return attendance.filter(a => a.date === date);
}

function apiGetIncidents() {
    return getAll('incidents');
}

function apiAddIncident(incidentData) {
    const incident = addRecord('incidents', incidentData);
    logEvent(getCurrentUser(), 'Incidencia Registrada', `Tipo: ${incident.type}, Empleado: ${incident.employee}`);
    return incident;
}

function apiUpdateIncident(id, incidentData) {
    return updateRecord('incidents', id, incidentData);
}

// ===========================
// LISTA DE ESPERA
// ===========================

function apiGetWaitingList() {
    return getAll('waitingList');
}

function apiAddToWaitingList(waitingData) {
    const waiting = addRecord('waitingList', {
        ...waitingData,
        status: 'waiting'
    });
    logEvent(getCurrentUser(), 'Cliente Agregado a Lista de Espera', `Cliente: ${waitingData.clientName}`);
    return waiting;
}

function apiDeleteFromWaitingList(id) {
    return deleteRecord('waitingList', id);
}

// ===========================
// PAQUETES
// ===========================

function apiGetPackages() {
    return getAll('packages');
}

function apiAddPackage(packageData) {
    const pkg = addRecord('packages', packageData);
    logEvent(getCurrentUser(), 'Paquete Creado', `Paquete: ${pkg.name}`);
    return pkg;
}

// ===========================
// CONFIGURACIÓN
// ===========================

function apiGetConfig() {
    const config = localStorage.getItem('config');
    return config ? JSON.parse(config) : {};
}

function apiUpdateConfig(configData) {
    localStorage.setItem('config', JSON.stringify(configData));
    logEvent(getCurrentUser(), 'Configuración Actualizada', 'Cambios en configuración general');
    return configData;
}

function apiToggleCashRegister() {
    const config = apiGetConfig();
    config.cashRegisterOpen = !config.cashRegisterOpen;
    apiUpdateConfig(config);
    logEvent(getCurrentUser(), 'Estado de Caja Cambiado', `Caja ${config.cashRegisterOpen ? 'ABIERTA' : 'CERRADA'}`);
    return config;
}

// ===========================
// BITÁCORA
// ===========================

function apiGetBitacora() {
    const logs = getAll('bitacora');
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ===========================
// DATOS DE EJEMPLO
// ===========================

function initializeSampleData() {
    // Solo inicializar si no hay datos
    if (getAll('clients').length === 0) {
        const sampleClients = [
            { name: 'Juan Pérez', email: 'juan@email.com', phone: '8888-1111', address: 'San José Centro', totalServices: 5 },
            { name: 'María González', email: 'maria@email.com', phone: '8888-2222', address: 'Heredia', totalServices: 3 },
            { name: 'Carlos Ramírez', email: 'carlos@email.com', phone: '8888-3333', address: 'Alajuela', totalServices: 8 }
        ];
        
        sampleClients.forEach(client => {
            addRecord('clients', { ...client, status: 'active' });
        });
        console.log('✅ Clientes de ejemplo creados');
    }

    if (getAll('services').length === 0) {
        const sampleServices = [
            { name: 'Corte Clásico', category: 'Corte', price: 8000, duration: 30, description: 'Corte tradicional con tijera y máquina', status: 'active' },
            { name: 'Corte + Barba', category: 'Combo', price: 12000, duration: 45, description: 'Corte completo con arreglo de barba', status: 'active' },
            { name: 'Afeitado Premium', category: 'Barba', price: 6500, duration: 25, description: 'Afeitado con navaja y toalla caliente', status: 'active' },
            { name: 'Corte Degradado', category: 'Corte', price: 10000, duration: 40, description: 'Corte moderno con degradado', status: 'active' }
        ];
        
        sampleServices.forEach(service => {
            addRecord('services', service);
        });
        console.log('✅ Servicios de ejemplo creados');
    }

    if (getAll('users').length === 0) {
        const sampleUsers = [
            { userName: 'Roberto Solís', email: 'roberto@barberia.com', role: 'barbero', password: 'barber123', status: 'active', permissions: ['citas', 'clientes'] },
            { userName: 'Mario López', email: 'mario@barberia.com', role: 'barbero', password: 'barber123', status: 'active', permissions: ['citas', 'clientes'] },
            { userName: 'Ana Mora', email: 'ana@barberia.com', role: 'recepcionista', password: 'recep123', status: 'active', permissions: ['citas', 'clientes', 'facturacion'] }
        ];
        
        sampleUsers.forEach(user => {
            addRecord('users', user);
        });
        console.log('✅ Usuarios de ejemplo creados');
    }
}

// Inicializar la base de datos al cargar
initializeDatabase();
console.log('✅ API Functions cargado correctamente');