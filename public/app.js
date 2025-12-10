// ========== FUNCIONES DE UTILIDAD ==========

// Mostrar notificación con Bootstrap Toast
function showNotification(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    
    let bgClass = 'bg-info';
    let icon = 'bi-info-circle';
    
    if (type === 'success') {
        bgClass = 'bg-success';
        icon = 'bi-check-circle';
    } else if (type === 'error') {
        bgClass = 'bg-danger';
        icon = 'bi-exclamation-circle';
    } else if (type === 'warning') {
        bgClass = 'bg-warning';
        icon = 'bi-exclamation-triangle';
    }
    
    const toastHtml = `
        <div class="toast align-items-center text-white ${bgClass} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi ${icon} me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Modal de confirmación
function showConfirm(title, message, onConfirm) {
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalBody').textContent = message;
    
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const confirmBtn = document.getElementById('confirmModalBtn');
    
    // Remover listeners previos
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    
    newBtn.addEventListener('click', () => {
        onConfirm();
        modal.hide();
    });
    
    modal.show();
}

// Modal de información
function showInfo(title, message) {
    document.getElementById('infoModalTitle').textContent = title;
    document.getElementById('infoModalBody').textContent = message;
    
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
}

// Establecer fecha actual en inputs tipo date
function setTodayDate(inputId) {
    const today = new Date().toISOString().split('T')[0];
    const input = document.getElementById(inputId);
    if (input) {
        input.value = today;
        input.min = today;
    }
}

// Establecer hora actual en inputs tipo time
function setCurrentTime(inputId) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const input = document.getElementById(inputId);
    if (input) {
        input.value = `${hours}:${minutes}`;
    }
}

// Mostrar mensaje de tabla vacía
function showEmptyTable(tableBodyId, message = 'No hay registros para mostrar', colspan = 6) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr>
            <td colspan="${colspan}" class="text-center py-5">
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p class="mb-0">${message}</p>
                </div>
            </td>
        </tr>
    `;
}

// Mostrar mensaje de gráfico vacío
function showEmptyChart(containerId, message = 'No hay datos suficientes para generar el gráfico') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="chart-placeholder">
            <i class="bi bi-bar-chart-line d-block"></i>
            <p class="mb-0">${message}</p>
        </div>
    `;
}

// ========== FUNCIONES DE NAVEGACIÓN ==========

// LOGIN
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (email === 'admin@barberia.com' && password === 'admin123') {
            showNotification('¡Bienvenido al sistema!', 'success');
            
            setTimeout(() => {
                document.getElementById('loginView').classList.add('hidden');
                document.getElementById('menuView').classList.remove('hidden');
            }, 1000);
        } else {
            showNotification('Credenciales incorrectas', 'error');
        }
    });
}

// LOGOUT
function logout() {
    showConfirm('Cerrar Sesión', '¿Está seguro que desea cerrar sesión?', () => {
        showNotification('Cerrando sesión...', 'info');
        
        setTimeout(() => {
            document.getElementById('menuView').classList.add('hidden');
            document.getElementById('clientesView').classList.add('hidden');
            document.getElementById('administrativoView').classList.add('hidden');
            document.getElementById('citasView').classList.add('hidden');
            document.getElementById('facturacionView').classList.add('hidden');
            document.getElementById('reportesView').classList.add('hidden');
            document.getElementById('marketingView').classList.add('hidden');
            document.getElementById('serviciosView').classList.add('hidden');
            document.getElementById('asistenciasView').classList.add('hidden');
            document.getElementById('loginView').classList.remove('hidden');
            document.getElementById('loginForm').reset();
        }, 1000);
    });
}

// Abrir módulos
function openModule(moduleName) {
    document.getElementById('menuView').classList.add('hidden');
    
    if (moduleName === 'clientes') {
        document.getElementById('clientesView').classList.remove('hidden');
        loadClients();
        loadClientSelect();
    } else if (moduleName === 'administrativo') {
        document.getElementById('administrativoView').classList.remove('hidden');
        loadUsers();
        loadUserSelect();
        loadBitacora();
    } else if (moduleName === 'citas') {
        document.getElementById('citasView').classList.remove('hidden');
        loadAppointments();
        loadClientsForAppointments();
        setTodayDate('appointmentDate');
        setCurrentTime('appointmentTime');
    } else if (moduleName === 'facturacion') {
        document.getElementById('facturacionView').classList.remove('hidden');
        loadInvoices();
        loadClientsForInvoice();
    } else if (moduleName === 'reportes') {
        document.getElementById('reportesView').classList.remove('hidden');
        setTodayDate('incomeStartDate');
        setTodayDate('incomeEndDate');
    } else if (moduleName === 'marketing') {
        document.getElementById('marketingView').classList.remove('hidden');
        loadPromotions();
        loadCoupons();
        setTodayDate('campaignStart');
        setTodayDate('promoValidUntil');
        setTodayDate('couponExpiry');
    } else if (moduleName === 'servicios') {
        document.getElementById('serviciosView').classList.remove('hidden');
        loadServices();
        loadBarbers();
    } else if (moduleName === 'asistencias') {
        document.getElementById('asistenciasView').classList.remove('hidden');
        loadAttendance();
        loadEmployeesForAttendance();
        setTodayDate('attendanceDate');
        setCurrentTime('attendanceEntryTime');
        setTodayDate('incidentDate');
    } else {
        showNotification(`Módulo de ${moduleName} en desarrollo`, 'info');
        document.getElementById('menuView').classList.remove('hidden');
    }
}

// Volver al menú
function backToMenu() {
    document.getElementById('clientesView').classList.add('hidden');
    document.getElementById('administrativoView').classList.add('hidden');
    document.getElementById('citasView').classList.add('hidden');
    document.getElementById('facturacionView').classList.add('hidden');
    document.getElementById('reportesView').classList.add('hidden');
    document.getElementById('marketingView').classList.add('hidden');
    document.getElementById('serviciosView').classList.add('hidden');
    document.getElementById('asistenciasView').classList.add('hidden');
    document.getElementById('menuView').classList.remove('hidden');
}

// ========== FUNCIONES MÓDULO ADMINISTRATIVO ==========

// Crear usuario
function setupCreateUserForm() {
    const form = document.getElementById('createUserForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const role = document.getElementById('userRole').value;

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            showNotification('El correo ya está registrado', 'error');
            return;
        }

        const newUser = {
            id: nextUserId++,
            name: name,
            email: email,
            role: role,
            status: 'activo',
            permissions: []
        };

        users.push(newUser);
        showNotification('Usuario creado exitosamente', 'success');
        addBitacoraEvent('Crear usuario', `Usuario ${name} creado con rol ${role}`);
        
        this.reset();
        loadUsers();
        loadUserSelect();
    });
}

// Cargar usuarios
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (users.length === 0) {
        showEmptyTable('usersTableBody', 'No hay usuarios registrados', 4);
        return;
    }
    
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        const statusBadge = user.status === 'activo' 
            ? '<span class="badge badge-activo">ACTIVO</span>' 
            : '<span class="badge badge-inactivo">INACTIVO</span>';
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td><span class="badge bg-secondary">${user.role}</span></td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-dorado me-1" onclick="viewUserDetails(${user.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="selectUserForEdit(${user.id})">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar select de usuarios
function loadUserSelect() {
    const select = document.getElementById('selectUserPermissions');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccione un usuario...</option>';
    
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.name} - ${user.role}`;
        select.appendChild(option);
    });
}

// Ver detalles de usuario
function viewUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        showInfo('Detalles de Usuario', `Usuario: ${user.name}\nRol: ${user.role}\nEstado: ${user.status}\nPermisos: ${user.permissions.join(', ') || 'Ninguno'}`);
    }
}

// Seleccionar usuario para editar
function selectUserForEdit(userId) {
    const select = document.getElementById('selectUserPermissions');
    if (select) {
        select.value = userId;
        select.dispatchEvent(new Event('change'));
        
        // Activar tab de permisos
        const permTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#admin-permisos"]'));
        permTab.show();
    }
}

// Agregar evento a bitácora
function addBitacoraEvent(accion, detalles) {
    const now = new Date();
    const fecha = now.toLocaleString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });

    const evento = {
        id: nextBitacoraId++,
        fecha: fecha,
        usuario: 'Admin Principal',
        accion: accion,
        detalles: detalles
    };

    bitacora.unshift(evento);
    loadBitacora();
}

// Cargar bitácora
function loadBitacora() {
    const tbody = document.getElementById('bitacoraTableBody');
    if (!tbody) return;
    
    if (bitacora.length === 0) {
        showEmptyTable('bitacoraTableBody', 'No hay eventos registrados', 4);
        return;
    }
    
    tbody.innerHTML = '';

    bitacora.slice(0, 10).forEach(evento => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evento.fecha}</td>
            <td>${evento.usuario}</td>
            <td><span class="badge bg-info">${evento.accion}</span></td>
            <td>${evento.detalles}</td>
        `;
        tbody.appendChild(row);
    });
}

// Funciones vacías para módulos en desarrollo (evitar errores)
function loadAppointments() { console.log('loadAppointments - en desarrollo'); }
function loadClientsForAppointments() { console.log('loadClientsForAppointments - en desarrollo'); }
function loadInvoices() { console.log('loadInvoices - en desarrollo'); }
function loadClientsForInvoice() { console.log('loadClientsForInvoice - en desarrollo'); }
function loadPromotions() { console.log('loadPromotions - en desarrollo'); }
function loadCoupons() { console.log('loadCoupons - en desarrollo'); }
function loadServices() { console.log('loadServices - en desarrollo'); }
function loadBarbers() { console.log('loadBarbers - en desarrollo'); }
function loadAttendance() { console.log('loadAttendance - en desarrollo'); }
function loadEmployeesForAttendance() { console.log('loadEmployeesForAttendance - en desarrollo'); }

// ========== INICIALIZACIÓN DE EVENTOS ==========

function setupAllEventListeners() {
    setupLoginForm();
    setupCreateUserForm();
    
    // Modificar permisos - mostrar campos
    const selectUserPerms = document.getElementById('selectUserPermissions');
    if (selectUserPerms) {
        selectUserPerms.addEventListener('change', function(e) {
            const userId = parseInt(e.target.value);
            
            if (!userId) {
                document.getElementById('permissionsFields')?.classList.add('hidden');
                return;
            }

            const user = users.find(u => u.id === userId);
            if (user) {
                document.getElementById('permissionsFields')?.classList.remove('hidden');
                
                const permClientes = document.getElementById('permClientes');
                const permCitas = document.getElementById('permCitas');
                const permFacturacion = document.getElementById('permFacturacion');
                const permReportes = document.getElementById('permReportes');
                
                if (permClientes) permClientes.checked = user.permissions.includes('clientes');
                if (permCitas) permCitas.checked = user.permissions.includes('citas');
                if (permFacturacion) permFacturacion.checked = user.permissions.includes('facturacion');
                if (permReportes) permReportes.checked = user.permissions.includes('reportes');
            }
        });
    }
    
    // Modificar permisos - guardar
    const permForm = document.getElementById('modifyPermissionsForm');
    if (permForm) {
        permForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = parseInt(document.getElementById('selectUserPermissions').value);
            const user = users.find(u => u.id === userId);
            
            if (!user) {
                showNotification('Seleccione un usuario', 'error');
                return;
            }

            user.permissions = [];
            if (document.getElementById('permClientes')?.checked) user.permissions.push('clientes');
            if (document.getElementById('permCitas')?.checked) user.permissions.push('citas');
            if (document.getElementById('permFacturacion')?.checked) user.permissions.push('facturacion');
            if (document.getElementById('permReportes')?.checked) user.permissions.push('reportes');

            showNotification('Permisos actualizados correctamente', 'success');
            addBitacoraEvent('Modificar permisos', `Permisos del usuario ${user.name} actualizados`);
            loadUsers();
        });
    }
    
    // Configuración general
    const configForm = document.getElementById('generalConfigForm');
    if (configForm) {
        configForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Configuración guardada correctamente', 'success');
            addBitacoraEvent('Actualizar configuración', 'Configuración general del sistema actualizada');
        });
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAllEventListeners);
} else {
    setupAllEventListeners();
}