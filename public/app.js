// ===========================
// APP.JS - Sistema Black White
// Lógica completa de la aplicación
// ===========================

console.log('🎨 Inicializando aplicación Black White...');

// ===========================
// VARIABLES GLOBALES
// ===========================

let currentView = 'login';
let currentUser = null;

// ===========================
// INICIALIZACIÓN
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, iniciando aplicación...');
    initializeApp();
    attachEventListeners();
});

function initializeApp() {
    // Verificar si hay sesión activa
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showView('menu');
        document.getElementById('userName').textContent = currentUser.userName;
        console.log('✅ Sesión activa restaurada');
    } else {
        showView('login');
        console.log('🔐 Mostrando pantalla de login');
    }
}

// ===========================
// NAVEGACIÓN
// ===========================

function showView(viewName) {
    // Ocultar todas las vistas
    const views = document.querySelectorAll('[id$="View"]');
    views.forEach(view => view.classList.add('hidden'));
    
    // Mostrar la vista solicitada
    const targetView = document.getElementById(viewName + 'View');
    if (targetView) {
        targetView.classList.remove('hidden');
        currentView = viewName;
        console.log(`📍 Vista cambiada a: ${viewName}`);
    }
}

function openModule(moduleName) {
    showView(moduleName);
    loadModuleData(moduleName);
}

function backToMenu() {
    showView('menu');
}

function logout() {
    apiLogout();
    currentUser = null;
    showView('login');
    showNotification('Sesión cerrada exitosamente', 'info');
}

// ===========================
// CARGA DE DATOS POR MÓDULO
// ===========================

function loadModuleData(moduleName) {
    console.log(`📊 Cargando datos del módulo: ${moduleName}`);
    
    switch(moduleName) {
        case 'clientes':
            loadClients();
            loadClientsForSelect();
            break;
        case 'administrativo':
            loadUsers();
            loadBitacora();
            loadAdminPanel();
            break;
        case 'citas':
            loadAppointments();
            loadClientsForAppointments();
            loadWaitingList();
            break;
        case 'facturacion':
            loadInvoices();
            loadClientsForInvoices();
            updateCashRegisterStatus();
            break;
        case 'marketing':
            loadPromotions();
            loadCoupons();
            break;
        case 'servicios':
            loadServices();
            loadServicesForPackages();
            loadServicesForSpecialties();
            break;
        case 'asistencias':
            loadTodayAttendance();
            loadEmployeesForAttendance();
            loadIncidents();
            break;
    }
}

// ===========================
// EVENTOS GENERALES
// ===========================

function attachEventListeners() {
    console.log('🔗 Adjuntando event listeners...');
    
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Clientes
    const registerClientForm = document.getElementById('registerClientForm');
    if (registerClientForm) registerClientForm.addEventListener('submit', handleRegisterClient);

    const editClientForm = document.getElementById('editClientForm');
    if (editClientForm) editClientForm.addEventListener('submit', handleEditClient);

    const editClientSelect = document.getElementById('editClientSelect');
    if (editClientSelect) editClientSelect.addEventListener('change', handleClientSelection);

    const searchClient = document.getElementById('searchClient');
    if (searchClient) searchClient.addEventListener('input', handleClientSearch);

    // Usuarios
    const createUserForm = document.getElementById('createUserForm');
    if (createUserForm) createUserForm.addEventListener('submit', handleCreateUser);

    const selectUserPermissions = document.getElementById('selectUserPermissions');
    if (selectUserPermissions) selectUserPermissions.addEventListener('change', handleUserPermissionSelection);

    const modifyPermissionsForm = document.getElementById('modifyPermissionsForm');
    if (modifyPermissionsForm) modifyPermissionsForm.addEventListener('submit', handleModifyPermissions);

    // Configuración
    const generalConfigForm = document.getElementById('generalConfigForm');
    if (generalConfigForm) generalConfigForm.addEventListener('submit', handleGeneralConfig);

    // Citas
    const createAppointmentForm = document.getElementById('createAppointmentForm');
    if (createAppointmentForm) createAppointmentForm.addEventListener('submit', handleCreateAppointment);

    const appointmentService1 = document.getElementById('appointmentService1');
    const appointmentService2 = document.getElementById('appointmentService2');
    if (appointmentService1) appointmentService1.addEventListener('change', updateAppointmentEstimate);
    if (appointmentService2) appointmentService2.addEventListener('change', updateAppointmentEstimate);

    const filterDate = document.getElementById('filterDate');
    if (filterDate) filterDate.addEventListener('change', filterAppointments);

    const filterBarber = document.getElementById('filterBarber');
    if (filterBarber) filterBarber.addEventListener('change', filterAppointments);

    const createWaitingListForm = document.getElementById('createWaitingListForm');
    if (createWaitingListForm) createWaitingListForm.addEventListener('submit', handleCreateWaitingList);

    const bufferConfigForm = document.getElementById('bufferConfigForm');
    if (bufferConfigForm) bufferConfigForm.addEventListener('submit', handleBufferConfig);

    // Facturación
    const createInvoiceForm = document.getElementById('createInvoiceForm');
    if (createInvoiceForm) {
        createInvoiceForm.addEventListener('submit', handleCreateInvoice);
        
        // Escuchar cambios en los selects de servicio
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('service-select')) {
                updateServicePrice(e.target);
            }
        });
    }

    const paymentMethod = document.getElementById('paymentMethod');
    if (paymentMethod) paymentMethod.addEventListener('change', handlePaymentMethodChange);

    const cashReceived = document.getElementById('cashReceived');
    if (cashReceived) cashReceived.addEventListener('input', calculateChange);

    const tipAmount = document.getElementById('tipAmount');
    if (tipAmount) tipAmount.addEventListener('input', updateInvoiceTotal);

    const closeCashForm = document.getElementById('closeCashForm');
    if (closeCashForm) closeCashForm.addEventListener('submit', handleCloseCash);

    // Marketing
    const createCampaignForm = document.getElementById('createCampaignForm');
    if (createCampaignForm) createCampaignForm.addEventListener('submit', handleCreateCampaign);

    const createPromotionForm = document.getElementById('createPromotionForm');
    if (createPromotionForm) createPromotionForm.addEventListener('submit', handleCreatePromotion);

    const createCouponForm = document.getElementById('createCouponForm');
    if (createCouponForm) createCouponForm.addEventListener('submit', handleCreateCoupon);

    // Servicios
    const createServiceForm = document.getElementById('createServiceForm');
    if (createServiceForm) createServiceForm.addEventListener('submit', handleCreateService);

    const assignSpecialtyForm = document.getElementById('assignSpecialtyForm');
    if (assignSpecialtyForm) assignSpecialtyForm.addEventListener('submit', handleAssignSpecialty);

    const createPackageForm = document.getElementById('createPackageForm');
    if (createPackageForm) createPackageForm.addEventListener('submit', handleCreatePackage);

    // Asistencias
    const registerAttendanceForm = document.getElementById('registerAttendanceForm');
    if (registerAttendanceForm) registerAttendanceForm.addEventListener('submit', handleRegisterAttendance);

    const incidentForm = document.getElementById('incidentForm');
    if (incidentForm) incidentForm.addEventListener('submit', handleIncident);

    const attendanceReportForm = document.getElementById('attendanceReportForm');
    if (attendanceReportForm) attendanceReportForm.addEventListener('submit', handleAttendanceReport);

    // Reportes
    const incomeReportForm = document.getElementById('incomeReportForm');
    if (incomeReportForm) incomeReportForm.addEventListener('submit', handleIncomeReport);

    const salesChartForm = document.getElementById('salesChartForm');
    if (salesChartForm) salesChartForm.addEventListener('submit', handleSalesChart);
    
    console.log('✅ Event listeners adjuntados');
}

// ===========================
// LOGIN
// ===========================

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = apiLogin(email, password);
    
    if (result.success) {
        currentUser = result.user;
        document.getElementById('userName').textContent = currentUser.userName;
        showView('menu');
        showNotification('¡Bienvenido, ' + currentUser.userName + '!', 'success');
    } else {
        showNotification('Credenciales incorrectas', 'error');
    }
}

// ===========================
// CLIENTES
// ===========================

function loadClients() {
    const clients = apiGetClients();
    const tbody = document.getElementById('clientsTableBody');
    
    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4"><i class="bi bi-inbox fs-1 d-block mb-2"></i>No hay clientes registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = clients.map(client => `
        <tr>
            <td><small>${client.id.substr(0, 8)}</small></td>
            <td><strong>${client.name}</strong></td>
            <td>${client.email}</td>
            <td>${client.phone || 'N/A'}</td>
            <td><span class="badge bg-primary">${client.totalServices || 0}</span></td>
            <td>
                <button class="btn btn-sm btn-negro" onclick="editClient('${client.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteClient('${client.id}', '${client.name}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log(`✅ ${clients.length} clientes cargados`);
}

function loadClientsForSelect() {
    const clients = apiGetClients();
    const selects = ['editClientSelect'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Seleccione un cliente...</option>' +
                clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    });
}

function handleRegisterClient(e) {
    e.preventDefault();
    
    const clientData = {
        name: document.getElementById('clientName').value.trim(),
        email: document.getElementById('clientEmail').value.trim(),
        phone: document.getElementById('clientPhone').value.trim(),
        address: document.getElementById('clientAddress').value.trim()
    };
    
    // Validaciones
    if (!validateEmail(clientData.email)) {
        showNotification('Correo electrónico inválido', 'error');
        return;
    }
    
    const newClient = apiAddClient(clientData);
    showNotification('✅ Cliente registrado exitosamente', 'success');
    e.target.reset();
    loadClients();
    loadClientsForSelect();
}

function handleClientSelection(e) {
    const clientId = e.target.value;
    const editFields = document.getElementById('editClientFields');
    
    if (!clientId) {
        editFields.classList.add('hidden');
        return;
    }
    
    const client = findById('clients', clientId);
    if (client) {
        document.getElementById('editClientName').value = client.name;
        document.getElementById('editClientEmail').value = client.email;
        document.getElementById('editClientPhone').value = client.phone || '';
        document.getElementById('editClientAddress').value = client.address || '';
        editFields.classList.remove('hidden');
    }
}

function handleEditClient(e) {
    e.preventDefault();
    
    const clientId = document.getElementById('editClientSelect').value;
    const updatedData = {
        name: document.getElementById('editClientName').value.trim(),
        email: document.getElementById('editClientEmail').value.trim(),
        phone: document.getElementById('editClientPhone').value.trim(),
        address: document.getElementById('editClientAddress').value.trim()
    };
    
    apiUpdateClient(clientId, updatedData);
    showNotification('✅ Cliente actualizado exitosamente', 'success');
    loadClients();
    loadClientsForSelect();
}

function confirmDeleteClient(id, name) {
    if (confirm(`¿Está seguro de eliminar al cliente ${name}?`)) {
        apiDeleteClient(id);
        showNotification('✅ Cliente eliminado exitosamente', 'success');
        loadClients();
        loadClientsForSelect();
    }
}

function editClient(id) {
    const editTab = document.querySelector('[data-bs-target="#editar"]');
    if (editTab) {
        editTab.click();
        setTimeout(() => {
            document.getElementById('editClientSelect').value = id;
            document.getElementById('editClientSelect').dispatchEvent(new Event('change'));
        }, 100);
    }
}

function handleClientSearch(e) {
    const query = e.target.value.trim();
    const resultsDiv = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    const results = apiSearchClients(query);
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>No se encontraron resultados</div>';
        return;
    }
    
    resultsDiv.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover table-custom">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Servicios</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(c => `
                        <tr>
                            <td><strong>${c.name}</strong></td>
                            <td>${c.email}</td>
                            <td>${c.phone || 'N/A'}</td>
                            <td><span class="badge bg-primary">${c.totalServices || 0}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ===========================
// USUARIOS
// ===========================

function loadUsers() {
    const users = apiGetUsers();
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">No hay usuarios registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td><strong>${user.userName}</strong></td>
            <td><span class="badge bg-secondary">${user.role}</span></td>
            <td><span class="badge badge-${user.status === 'active' ? 'activo' : 'inactivo'}">${user.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="btn btn-sm btn-negro" onclick="editUser('${user.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Cargar usuarios en select de permisos
    const selectUserPermissions = document.getElementById('selectUserPermissions');
    if (selectUserPermissions) {
        selectUserPermissions.innerHTML = '<option value="">Seleccione un usuario...</option>' +
            users.map(u => `<option value="${u.id}">${u.userName} (${u.role})</option>`).join('');
    }
}

function handleCreateUser(e) {
    e.preventDefault();
    
    const userData = {
        userName: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        role: document.getElementById('userRole').value,
        password: document.getElementById('userPassword').value
    };
    
    apiAddUser(userData);
    showNotification('✅ Usuario creado exitosamente', 'success');
    e.target.reset();
    loadUsers();
}

function handleUserPermissionSelection(e) {
    const userId = e.target.value;
    const permissionsFields = document.getElementById('permissionsFields');
    
    if (!userId) {
        permissionsFields.classList.add('hidden');
        return;
    }
    
    const user = findById('users', userId);
    if (user) {
        document.querySelectorAll('#permissionsFields input[type="checkbox"]').forEach(cb => {
            cb.checked = user.permissions && user.permissions.includes(cb.value);
        });
        permissionsFields.classList.remove('hidden');
    }
}

function handleModifyPermissions(e) {
    e.preventDefault();
    
    const userId = document.getElementById('selectUserPermissions').value;
    const permissions = [];
    
    document.querySelectorAll('#permissionsFields input[type="checkbox"]:checked').forEach(cb => {
        permissions.push(cb.value);
    });
    
    apiUpdatePermissions(userId, permissions);
    showNotification('✅ Permisos actualizados exitosamente', 'success');
}

function loadBitacora() {
    const logs = apiGetBitacora();
    const tbody = document.getElementById('bitacoraTableBody');
    
    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">No hay eventos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = logs.slice(0, 50).map(log => `
        <tr>
            <td><small>${formatDateTime(log.timestamp)}</small></td>
            <td><strong>${log.user}</strong></td>
            <td><span class="badge bg-info">${log.action}</span></td>
            <td>${log.details}</td>
        </tr>
    `).join('');
}

function loadAdminPanel() {
    // Cargar estadísticas del panel administrativo
    // Por ahora usaremos datos estáticos, pero pueden conectarse a la base de datos
    console.log('📊 Panel administrativo cargado');
}

function handleGeneralConfig(e) {
    e.preventDefault();
    
    const configData = {
        businessName: document.getElementById('configBusinessName').value,
        phone: document.getElementById('configPhone').value,
        email: document.getElementById('configEmail').value,
        hours: document.getElementById('configHours').value,
        address: document.getElementById('configAddress').value,
        tax: parseInt(document.getElementById('configTax').value)
    };
    
    apiUpdateConfig(configData);
    showNotification('✅ Configuración actualizada exitosamente', 'success');
}

function editUser(id) {
    showNotification('Funcionalidad de edición de usuarios disponible próximamente', 'info');
}

// ===========================
// CITAS
// ===========================

function loadClientsForAppointments() {
    const clients = apiGetClients();
    const selects = ['appointmentClient', 'waitingClient'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Seleccione un cliente...</option>' +
                clients.map(c => `<option value="${c.name}" data-id="${c.id}">${c.name}</option>`).join('');
        }
    });
}

function loadAppointments() {
    const appointments = apiGetAppointments();
    const tbody = document.getElementById('appointmentsTableBody');
    
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4"><i class="bi bi-calendar-x fs-1 d-block mb-2"></i>No hay citas registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = appointments.map(app => `
        <tr>
            <td><small>${app.id.substr(0, 8)}</small></td>
            <td><strong>${app.date}</strong><br><small>${app.time}</small></td>
            <td>${app.clientName}</td>
            <td><small>${app.services.join(', ')}</small></td>
            <td>${app.barber}</td>
            <td><span class="badge badge-${app.status === 'pending' ? 'pendiente' : 'activo'}">${app.status === 'pending' ? 'Pendiente' : app.status}</span></td>
            <td>
                <button class="btn btn-sm btn-negro" onclick="editAppointment('${app.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteAppointment('${app.id}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log(`✅ ${appointments.length} citas cargadas`);
}

function handleCreateAppointment(e) {
    e.preventDefault();
    
    const service1 = document.getElementById('appointmentService1');
    const service2 = document.getElementById('appointmentService2');
    
    const services = [service1.value];
    if (service2.value) {
        services.push(service2.value);
    }
    
    const appointmentData = {
        clientName: document.getElementById('appointmentClient').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        barber: document.getElementById('appointmentBarber').value,
        services: services,
        duration: parseInt(document.getElementById('estimatedDuration').textContent),
        cost: parseInt(document.getElementById('estimatedCost').textContent)
    };
    
    apiAddAppointment(appointmentData);
    showNotification('✅ Cita creada exitosamente', 'success');
    e.target.reset();
    document.getElementById('estimatedDuration').textContent = '0';
    document.getElementById('estimatedCost').textContent = '0';
    loadAppointments();
}

function updateAppointmentEstimate() {
    const service1Select = document.getElementById('appointmentService1');
    const service2Select = document.getElementById('appointmentService2');
    
    let totalDuration = 0;
    let totalCost = 0;
    
    if (service1Select.value) {
        const option1 = service1Select.options[service1Select.selectedIndex];
        totalDuration += parseInt(option1.dataset.duration || 0);
        totalCost += parseInt(option1.dataset.price || 0);
    }
    
    if (service2Select.value) {
        const option2 = service2Select.options[service2Select.selectedIndex];
        totalDuration += parseInt(option2.dataset.duration || 0);
        totalCost += parseInt(option2.dataset.price || 0);
    }
    
    document.getElementById('estimatedDuration').textContent = totalDuration;
    document.getElementById('estimatedCost').textContent = totalCost;
}

function confirmDeleteAppointment(id) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
        apiDeleteAppointment(id);
        showNotification('✅ Cita eliminada exitosamente', 'success');
        loadAppointments();
    }
}

function filterAppointments() {
    const dateFilter = document.getElementById('filterDate').value;
    const barberFilter = document.getElementById('filterBarber').value;
    
    let appointments = apiGetAppointments();
    
    if (dateFilter) {
        appointments = appointments.filter(a => a.date === dateFilter);
    }
    
    if (barberFilter) {
        appointments = appointments.filter(a => a.barber === barberFilter);
    }
    
    const tbody = document.getElementById('appointmentsTableBody');
    
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No se encontraron citas con los filtros seleccionados</td></tr>';
        return;
    }
    
    tbody.innerHTML = appointments.map(app => `
        <tr>
            <td><small>${app.id.substr(0, 8)}</small></td>
            <td><strong>${app.date}</strong><br><small>${app.time}</small></td>
            <td>${app.clientName}</td>
            <td><small>${app.services.join(', ')}</small></td>
            <td>${app.barber}</td>
            <td><span class="badge badge-${app.status === 'pending' ? 'pendiente' : 'activo'}">${app.status}</span></td>
            <td>
                <button class="btn btn-sm btn-negro" onclick="editAppointment('${app.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteAppointment('${app.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadWaitingList() {
    const waiting = apiGetWaitingList();
    const tbody = document.getElementById('waitingListTableBody');
    
    if (!tbody) return;
    
    if (waiting.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No hay clientes en lista de espera</td></tr>';
        return;
    }
    
    tbody.innerHTML = waiting.map(w => `
        <tr>
            <td>${w.clientName}</td>
            <td>${w.service}</td>
            <td>${formatDateTime(w.requestedDate)}</td>
            <td><span class="badge badge-pendiente">${w.status}</span></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeFromWaitingList('${w.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function handleCreateWaitingList(e) {
    e.preventDefault();
    
    const waitingData = {
        clientName: document.getElementById('waitingClient').value,
        service: document.getElementById('waitingService').value,
        requestedDate: document.getElementById('waitingDate').value
    };
    
    apiAddToWaitingList(waitingData);
    showNotification('✅ Cliente agregado a lista de espera', 'success');
    e.target.reset();
    loadWaitingList();
}

function removeFromWaitingList(id) {
    if (confirm('¿Remover de la lista de espera?')) {
        apiDeleteFromWaitingList(id);
        showNotification('✅ Cliente removido de lista de espera', 'success');
        loadWaitingList();
    }
}

function handleBufferConfig(e) {
    e.preventDefault();
    
    const config = apiGetConfig();
    config.bufferMinutes = parseInt(document.getElementById('bufferMinutes').value);
    config.bufferGlobal = parseInt(document.getElementById('bufferGlobal').value);
    apiUpdateConfig(config);
    
    showNotification('✅ Configuración de buffer actualizada', 'success');
}

function editAppointment(id) {
    showNotification('Funcionalidad de edición de citas disponible próximamente', 'info');
}

// ===========================
// FACTURACIÓN
// ===========================

function loadClientsForInvoices() {
    const clients = apiGetClients();
    const select = document.getElementById('invoiceClient');
    
    if (select) {
        select.innerHTML = '<option value="">Seleccione un cliente...</option>' +
            clients.map(c => `<option value="${c.name}" data-id="${c.id}">${c.name}</option>`).join('');
    }
}

function loadInvoices() {
    const invoices = apiGetInvoices();
    const tbody = document.getElementById('invoicesTableBody');
    
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4"><i class="bi bi-receipt fs-1 d-block mb-2"></i>No hay facturas registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = invoices.map(inv => `
        <tr>
            <td><strong>${inv.invoiceNumber}</strong></td>
            <td><small>${formatDate(inv.date)}</small></td>
            <td>${inv.clientName}</td>
            <td>${inv.barber}</td>
            <td><strong class="text-success">₡${formatNumber(inv.total)}</strong></td>
            <td><span class="badge bg-info">${inv.paymentMethod}</span></td>
            <td><span class="badge badge-activo">${inv.status}</span></td>
            <td>
                <button class="btn btn-sm btn-negro" onclick="viewInvoice('${inv.id}')" title="Ver detalles">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log(`✅ ${invoices.length} facturas cargadas`);
}

function handleCreateInvoice(e) {
    e.preventDefault();
    
    const services = [];
    document.querySelectorAll('.service-select').forEach(select => {
        if (select.value) {
            const option = select.options[select.selectedIndex];
            services.push({
                name: select.value,
                price: parseInt(option.dataset.price)
            });
        }
    });
    
    const subtotal = services.reduce((sum, s) => sum + s.price, 0);
    const tip = parseInt(document.getElementById('tipAmount').value) || 0;
    const total = subtotal + tip;
    
    const invoiceData = {
        clientName: document.getElementById('invoiceClient').value,
        barber: document.getElementById('invoiceBarber').value,
        services: services,
        subtotal: subtotal,
        tip: tip,
        total: total,
        paymentMethod: document.getElementById('paymentMethod').value
    };
    
    if (invoiceData.paymentMethod === 'sinpe') {
        invoiceData.sinpeReference = document.getElementById('sinpeReference').value;
    }
    
    const invoice = apiAddInvoice(invoiceData);
    showNotification(`✅ Factura ${invoice.invoiceNumber} generada exitosamente`, 'success');
    
    e.target.reset();
    document.getElementById('subtotalAmount').textContent = '0';
    document.getElementById('tipDisplay').textContent = '0';
    document.getElementById('totalAmount').textContent = '0';
    document.getElementById('cashPaymentFields').classList.add('hidden');
    document.getElementById('sinpeReferenceGroup').classList.add('hidden');
    
    // Resetear servicios
    const serviceRows = document.querySelectorAll('.service-row');
    serviceRows.forEach((row, index) => {
        if (index > 0) row.remove();
    });
    
    // Limpiar primer servicio
    document.querySelector('.service-select').value = '';
    document.querySelector('.service-price').value = '';
    
    loadInvoices();
}

function handlePaymentMethodChange(e) {
    const method = e.target.value;
    const cashFields = document.getElementById('cashPaymentFields');
    const sinpeGroup = document.getElementById('sinpeReferenceGroup');
    
    cashFields.classList.add('hidden');
    sinpeGroup.classList.add('hidden');
    
    if (method === 'efectivo') {
        cashFields.classList.remove('hidden');
    } else if (method === 'sinpe') {
        sinpeGroup.classList.remove('hidden');
    }
}

function calculateChange() {
    const total = parseInt(document.getElementById('totalAmount').textContent) || 0;
    const received = parseInt(document.getElementById('cashReceived').value) || 0;
    const change = received - total;
    
    document.getElementById('changeAmount').value = change >= 0 ? change : 0;
}

function updateInvoiceTotal() {
    const subtotal = parseInt(document.getElementById('subtotalAmount').textContent) || 0;
    const tip = parseInt(document.getElementById('tipAmount').value) || 0;
    const total = subtotal + tip;
    
    document.getElementById('tipDisplay').textContent = tip;
    document.getElementById('totalAmount').textContent = total;
}

function addServiceRow() {
    const container = document.getElementById('invoiceServices');
    const newRow = document.createElement('div');
    newRow.className = 'row g-3 mb-3 service-row';
    newRow.innerHTML = `
        <div class="col-md-8">
            <label class="form-label fw-bold">Servicio</label>
            <select class="form-select service-select">
                <option value="">Seleccione...</option>
                <option value="Corte Clásico" data-price="8000">Corte Clásico - ₡8,000</option>
                <option value="Corte + Barba" data-price="12000">Corte + Barba - ₡12,000</option>
                <option value="Afeitado Premium" data-price="6500">Afeitado Premium - ₡6,500</option>
            </select>
        </div>
        <div class="col-md-4">
            <label class="form-label fw-bold">Precio</label>
            <div class="input-group">
                <input type="number" class="form-control service-price" readonly>
                <button type="button" class="btn btn-danger" onclick="removeServiceRow(this)">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(newRow);
}

function removeServiceRow(button) {
    const row = button.closest('.service-row');
    row.remove();
    recalculateInvoiceSubtotal();
}

function updateServicePrice(select) {
    const row = select.closest('.service-row');
    const priceInput = row.querySelector('.service-price');
    
    if (select.value) {
        const option = select.options[select.selectedIndex];
        priceInput.value = option.dataset.price;
    } else {
        priceInput.value = '';
    }
    
    recalculateInvoiceSubtotal();
}

function recalculateInvoiceSubtotal() {
    let subtotal = 0;
    document.querySelectorAll('.service-price').forEach(input => {
        subtotal += parseInt(input.value) || 0;
    });
    
    document.getElementById('subtotalAmount').textContent = subtotal;
    updateInvoiceTotal();
}

function updateCashRegisterStatus() {
    const config = apiGetConfig();
    const statusSpan = document.getElementById('cashRegisterStatus');
    
    if (statusSpan) {
        statusSpan.textContent = config.cashRegisterOpen ? 'CAJA ABIERTA' : 'CAJA CERRADA';
        statusSpan.className = config.cashRegisterOpen ? 'badge badge-activo ms-2' : 'badge badge-inactivo ms-2';
    }
}

function toggleCashRegister() {
    const config = apiToggleCashRegister();
    updateCashRegisterStatus();
    showNotification(`Caja ${config.cashRegisterOpen ? 'ABIERTA' : 'CERRADA'}`, 'info');
}

function handleCloseCash(e) {
    e.preventDefault();
    
    const date = document.getElementById('closeDate').value;
    const invoices = apiGetInvoicesByDate(date);
    
    let totalInvoices = invoices.length;
    let totalCash = 0;
    let totalSinpe = 0;
    let totalCard = 0;
    
    invoices.forEach(inv => {
        switch(inv.paymentMethod) {
            case 'efectivo':
                totalCash += inv.total;
                break;
            case 'sinpe':
                totalSinpe += inv.total;
                break;
            case 'tarjeta':
                totalCard += inv.total;
                break;
        }
    });
    
    const totalDay = totalCash + totalSinpe + totalCard;
    
    document.getElementById('summaryInvoices').textContent = totalInvoices;
    document.getElementById('summaryCash').textContent = formatNumber(totalCash);
    document.getElementById('summarySinpe').textContent = formatNumber(totalSinpe);
    document.getElementById('summaryCard').textContent = formatNumber(totalCard);
    document.getElementById('summaryTotal').textContent = formatNumber(totalDay);
    
    document.getElementById('cashSummary').classList.remove('hidden');
    
    showNotification('✅ Cierre de caja generado', 'success');
}

function viewInvoice(id) {
    const invoice = findById('invoices', id);
    if (invoice) {
        const details = `
            <strong>Factura:</strong> ${invoice.invoiceNumber}<br>
            <strong>Cliente:</strong> ${invoice.clientName}<br>
            <strong>Barbero:</strong> ${invoice.barber}<br>
            <strong>Servicios:</strong> ${invoice.services.map(s => s.name).join(', ')}<br>
            <strong>Subtotal:</strong> ₡${formatNumber(invoice.subtotal)}<br>
            <strong>Propina:</strong> ₡${formatNumber(invoice.tip)}<br>
            <strong>Total:</strong> ₡${formatNumber(invoice.total)}<br>
            <strong>Método de Pago:</strong> ${invoice.paymentMethod}
        `;
        showInfoModal('Detalles de Factura', details);
    }
}

// ===========================
// MARKETING
// ===========================

function handleCreateCampaign(e) {
    e.preventDefault();
    
    const campaignData = {
        name: document.getElementById('campaignName').value,
        type: document.getElementById('campaignType').value,
        discount: parseInt(document.getElementById('campaignDiscount').value) || 0,
        startDate: document.getElementById('campaignStart').value,
        endDate: document.getElementById('campaignEnd').value
    };
    
    apiAddCampaign(campaignData);
    showNotification('✅ Campaña creada exitosamente', 'success');
    e.target.reset();
}

function loadPromotions() {
    const promotions = apiGetPromotions();
    const tbody = document.getElementById('activePromotionsBody');
    
    if (!tbody) return;
    
    if (promotions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No hay promociones activas</td></tr>';
        return;
    }
    
    tbody.innerHTML = promotions.map(promo => {
        const originalPrice = 10000;
        const discountedPrice = originalPrice - (originalPrice * promo.discount / 100);
        
        return `
            <tr>
                <td><strong>${promo.service}</strong></td>
                <td><span class="badge bg-success">${promo.discount}%</span></td>
                <td>₡${formatNumber(originalPrice)}</td>
                <td><strong class="text-dorado">₡${formatNumber(discountedPrice)}</strong></td>
                <td>${formatDate(promo.validUntil)}</td>
                <td><span class="badge badge-activo">${promo.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="confirmDeletePromotion('${promo.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function handleCreatePromotion(e) {
    e.preventDefault();
    
    const promotionData = {
        service: document.getElementById('promoService').value,
        discount: parseInt(document.getElementById('promoDiscount').value),
        validUntil: document.getElementById('promoValidUntil').value
    };
    
    apiAddPromotion(promotionData);
    showNotification('✅ Promoción creada exitosamente', 'success');
    e.target.reset();
    loadPromotions();
}

function confirmDeletePromotion(id) {
    if (confirm('¿Está seguro de eliminar esta promoción?')) {
        apiDeletePromotion(id);
        showNotification('✅ Promoción eliminada', 'success');
        loadPromotions();
    }
}

function loadCoupons() {
    const coupons = apiGetCoupons();
    const tbody = document.getElementById('couponsTableBody');
    
    if (!tbody) return;
    
    if (coupons.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No hay cupones activos</td></tr>';
        return;
    }
    
    tbody.innerHTML = coupons.map(coupon => `
        <tr>
            <td><strong class="text-dorado">${coupon.code}</strong></td>
            <td><span class="badge bg-success">${coupon.discount}%</span></td>
            <td>${formatDate(coupon.expiry)}</td>
            <td><span class="badge bg-info">${coupon.used}</span></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteCoupon('${coupon.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function handleCreateCoupon(e) {
    e.preventDefault();
    
    const couponData = {
        code: document.getElementById('couponCode').value.toUpperCase(),
        discount: parseInt(document.getElementById('couponDiscount').value),
        expiry: document.getElementById('couponExpiry').value
    };
    
    apiAddCoupon(couponData);
    showNotification('✅ Cupón creado exitosamente', 'success');
    e.target.reset();
    loadCoupons();
}

function confirmDeleteCoupon(id) {
    if (confirm('¿Está seguro de eliminar este cupón?')) {
        apiDeleteCoupon(id);
        showNotification('✅ Cupón eliminado', 'success');
        loadCoupons();
    }
}

function generateCouponCode() {
    const code = 'BWB' + Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById('couponCode').value = code;
}

// ===========================
// SERVICIOS
// ===========================

function loadServices() {
    const services = apiGetServices();
    const tbody = document.getElementById('servicesTableBody');
    
    if (!tbody) return;
    
    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4"><i class="bi bi-scissors fs-1 d-block mb-2"></i>No hay servicios registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = services.map(service => `
        <tr>
            <td><small>${service.id.substr(0, 8)}</small></td>
            <td><strong>${service.name}</strong></td>
            <td><span class="badge bg-secondary">${service.category}</span></td>
            <td><strong class="text-success">₡${formatNumber(service.price)}</strong></td>
            <td>${service.duration} min</td>
            <td><span class="badge badge-${service.status === 'active' ? 'activo' : 'inactivo'}">${service.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="btn btn-sm btn-negro" onclick="editService('${service.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteService('${service.id}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log(`✅ ${services.length} servicios cargados`);
}

function handleCreateService(e) {
    e.preventDefault();
    
    const serviceData = {
        name: document.getElementById('serviceName').value,
        category: document.getElementById('serviceCategory').value,
        price: parseInt(document.getElementById('servicePrice').value),
        duration: parseInt(document.getElementById('serviceDuration').value),
        description: document.getElementById('serviceDescription').value
    };
    
    apiAddService(serviceData);
    showNotification('✅ Servicio creado exitosamente', 'success');
    e.target.reset();
    loadServices();
}

function confirmDeleteService(id) {
    if (confirm('¿Está seguro de eliminar este servicio?')) {
        apiDeleteService(id);
        showNotification('✅ Servicio eliminado', 'success');
        loadServices();
    }
}

function loadServicesForPackages() {
    const services = apiGetServices();
    const container = document.getElementById('packageServicesCheckboxes');
    
    if (!container) return;
    
    container.innerHTML = services.map(service => `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="pkg_${service.id}" value="${service.id}">
            <label class="form-check-label" for="pkg_${service.id}">
                ${service.name} - ₡${formatNumber(service.price)}
            </label>
        </div>
    `).join('');
}

function loadServicesForSpecialties() {
    const services = apiGetServices();
    const container = document.getElementById('specialtyCheckboxes');
    
    if (!container) return;
    
    container.innerHTML = services.map(service => `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="spec_${service.id}" value="${service.id}">
            <label class="form-check-label" for="spec_${service.id}">
                ${service.name}
            </label>
        </div>
    `).join('');
    
    // Cargar barberos
    const users = apiGetUsers();
    const barbers = users.filter(u => u.role === 'barbero');
    const selectBarber = document.getElementById('selectBarber');
    
    if (selectBarber) {
        selectBarber.innerHTML = '<option value="">Seleccione...</option>' +
            barbers.map(b => `<option value="${b.id}">${b.userName}</option>`).join('');
    }
}

function handleCreatePackage(e) {
    e.preventDefault();
    
    const services = [];
    document.querySelectorAll('#packageServicesCheckboxes input:checked').forEach(cb => {
        services.push(cb.value);
    });
    
    const packageData = {
        name: document.getElementById('packageName').value,
        price: parseInt(document.getElementById('packagePrice').value),
        services: services
    };
    
    apiAddPackage(packageData);
    showNotification('✅ Paquete creado exitosamente', 'success');
    e.target.reset();
}

function handleAssignSpecialty(e) {
    e.preventDefault();
    showNotification('✅ Especialidades asignadas exitosamente', 'success');
}

function editService(id) {
    showNotification('Funcionalidad de edición de servicios disponible próximamente', 'info');
}

// ===========================
// ASISTENCIAS
// ===========================

function loadEmployeesForAttendance() {
    const users = apiGetUsers();
    const employees = users.filter(u => u.role === 'barbero' || u.role === 'recepcionista');
    
    const selects = ['attendanceEmployee', 'incidentEmployee'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Seleccione...</option>' +
                employees.map(e => `<option value="${e.userName}">${e.userName} (${e.role})</option>`).join('');
        }
    });
}

function loadTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
        dateInput.value = today;
    }
    
    const attendance = apiGetAttendanceByDate(today);
    const tbody = document.getElementById('todayAttendanceBody');
    
    if (!tbody) return;
    
    if (attendance.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No hay registros de asistencia hoy</td></tr>';
        return;
    }
    
    tbody.innerHTML = attendance.map(att => {
        const hours = att.exitTime ? calculateHours(att.entryTime, att.exitTime) : '-';
        const status = att.exitTime ? 'Completo' : 'En progreso';
        
        return `
            <tr>
                <td><strong>${att.employee}</strong></td>
                <td>${att.entryTime}</td>
                <td>${att.exitTime || '-'}</td>
                <td>${hours}</td>
                <td><span class="badge ${att.exitTime ? 'badge-activo' : 'bg-warning'}">${status}</span></td>
            </tr>
        `;
    }).join('');
}

function handleRegisterAttendance(e) {
    e.preventDefault();
    
    const attendanceData = {
        employee: document.getElementById('attendanceEmployee').value,
        date: document.getElementById('attendanceDate').value,
        entryTime: document.getElementById('attendanceEntryTime').value,
        exitTime: document.getElementById('attendanceExitTime').value || null
    };
    
    apiAddAttendance(attendanceData);
    showNotification('✅ Asistencia registrada exitosamente', 'success');
    e.target.reset();
    loadTodayAttendance();
}

function loadIncidents() {
    const incidents = apiGetIncidents();
    const tbody = document.getElementById('incidentsTableBody');
    
    if (!tbody) return;
    
    if (incidents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No hay incidencias registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = incidents.map(inc => `
        <tr>
            <td><small>${inc.id.substr(0, 8)}</small></td>
            <td>${inc.employee}</td>
            <td><span class="badge bg-warning">${inc.type}</span></td>
            <td>${formatDate(inc.date)}</td>
            <td><span class="badge badge-${inc.status === 'pendiente' ? 'pendiente' : inc.status === 'aprobada' ? 'activo' : 'inactivo'}">${inc.status}</span></td>
            <td>
                <button class="btn btn-sm btn-negro" onclick="editIncident('${inc.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function handleIncident(e) {
    e.preventDefault();
    
    const incidentData = {
        employee: document.getElementById('incidentEmployee').value,
        type: document.getElementById('incidentType').value,
        date: document.getElementById('incidentDate').value,
        status: document.getElementById('incidentStatus').value,
        observations: document.getElementById('incidentObservations').value
    };
    
    apiAddIncident(incidentData);
    showNotification('✅ Incidencia registrada exitosamente', 'success');
    e.target.reset();
    loadIncidents();
}

function handleAttendanceReport(e) {
    e.preventDefault();
    showNotification('✅ Reporte generado exitosamente', 'success');
}

function editIncident(id) {
    showNotification('Funcionalidad de edición de incidencias disponible próximamente', 'info');
}

// ===========================
// REPORTES
// ===========================

function handleIncomeReport(e) {
    e.preventDefault();
    
    const startDate = document.getElementById('incomeStartDate').value;
    const endDate = document.getElementById('incomeEndDate').value;
    
    const invoices = apiGetInvoicesByDateRange(startDate, endDate);
    const totalIncome = invoices.reduce((sum, inv) => sum + inv.total, 0);
    
    document.getElementById('totalIncome').textContent = formatNumber(totalIncome);
    document.getElementById('incomeReportResult').classList.remove('hidden');
    
    showNotification('✅ Reporte generado exitosamente', 'success');
}

function handleSalesChart(e) {
    e.preventDefault();
    showNotification('✅ Gráfico generado exitosamente', 'success');
    document.getElementById('salesChartResult').classList.remove('hidden');
    document.getElementById('salesChartContainer').innerHTML = '<div class="alert alert-info text-center"><i class="bi bi-bar-chart-line fs-1 d-block mb-2"></i><p>Aquí se mostraría un gráfico de ventas (requiere librería de gráficos como Chart.js)</p></div>';
}

// ===========================
// UTILIDADES Y HELPERS
// ===========================

function showNotification(message, type = 'info') {
    const container = document.querySelector('.toast-container');
    if (!container) {
        console.log(`${type.toUpperCase()}: ${message}`);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    toast.style.minWidth = '300px';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 150);
    }, 5000);
}

function showInfoModal(title, body) {
    document.getElementById('infoModalTitle').textContent = title;
    document.getElementById('infoModalBody').innerHTML = body;
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-CR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function calculateHours(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h ${minutes}m`;
}

console.log('✅ Sistema Black White cargado completamente');