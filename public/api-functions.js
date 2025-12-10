// ========== CONFIGURACIÓN DE LA API ==========
const API_URL = '/api';

// ========== VARIABLES GLOBALES ==========
let clients = [];
let users = [];
let services = [];
let staff = [];
let appointments = [];
let invoices = [];
let attendance = [];
let campaigns = [];

// ========== FUNCIONES DE API - CLIENTES ==========

async function fetchClients() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        if (response.ok) {
            clients = await response.json();
            console.log('✅ Clientes cargados:', clients.length);
            return clients;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}

async function createClient(clientData) {
    try {
        const response = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

async function updateClient(clientId, clientData) {
    try {
        const response = await fetch(`${API_URL}/clientes/${clientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

async function deleteClientAPI(clientId) {
    try {
        const response = await fetch(`${API_URL}/clientes/${clientId}`, {
            method: 'DELETE'
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ========== FUNCIONES DE API - SERVICIOS ==========

async function fetchServices() {
    try {
        const response = await fetch(`${API_URL}/servicios`);
        if (response.ok) {
            services = await response.json();
            console.log('✅ Servicios cargados:', services.length);
            return services;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}

async function createService(serviceData) {
    try {
        const response = await fetch(`${API_URL}/servicios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ========== FUNCIONES DE API - STAFF ==========

async function fetchStaff() {
    try {
        const response = await fetch(`${API_URL}/staff`);
        if (response.ok) {
            staff = await response.json();
            console.log('✅ Staff cargado:', staff.length);
            return staff;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}

// ========== FUNCIONES DE API - CITAS ==========

async function fetchAppointments() {
    try {
        const response = await fetch(`${API_URL}/citas`);
        if (response.ok) {
            appointments = await response.json();
            console.log('✅ Citas cargadas:', appointments.length);
            return appointments;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}

async function createAppointment(appointmentData) {
    try {
        const response = await fetch(`${API_URL}/citas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

async function updateAppointmentStatus(appointmentId, status) {
    try {
        const response = await fetch(`${API_URL}/citas/${appointmentId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ========== FUNCIONES DE API - FACTURAS ==========

async function fetchInvoices() {
    try {
        const response = await fetch(`${API_URL}/facturas`);
        if (response.ok) {
            invoices = await response.json();
            console.log('✅ Facturas cargadas:', invoices.length);
            return invoices;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}

async function createInvoice(invoiceData) {
    try {
        const response = await fetch(`${API_URL}/facturas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoiceData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ========== FUNCIONES DE API - ASISTENCIAS ==========

async function fetchAttendance(date = null) {
    try {
        let url = `${API_URL}/asistencias`;
        if (date) url += `?date=${date}`;
        
        const response = await fetch(url);
        if (response.ok) {
            attendance = await response.json();
            console.log('✅ Asistencias cargadas:', attendance.length);
            return attendance;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}

async function createAttendance(attendanceData) {
    try {
        const response = await fetch(`${API_URL}/asistencias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ========== FUNCIONES DE API - REPORTES ==========

async function fetchIncomeReport(startDate, endDate) {
    try {
        const response = await fetch(`${API_URL}/reportes/ingresos?startDate=${startDate}&endDate=${endDate}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

async function fetchServicesReport(startDate, endDate) {
    try {
        const response = await fetch(`${API_URL}/reportes/servicios?startDate=${startDate}&endDate=${endDate}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ========== FUNCIONES DE API - MARKETING ==========

async function fetchCampaigns() {
    try {
        const response = await fetch(`${API_URL}/marketing/campanas`);
        if (response.ok) {
            campaigns = await response.json();
            console.log('✅ Campañas cargadas:', campaigns.length);
            return campaigns;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}

async function createCampaign(campaignData) {
    try {
        const response = await fetch(`${API_URL}/marketing/campanas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campaignData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ========== FUNCIONES DE UI - CLIENTES ==========

async function loadClients() {
    await fetchClients();
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;
    
    if (clients.length === 0) {
        showEmptyTable('clientsTableBody', 'No hay clientes registrados', 6);
        return;
    }
    
    tbody.innerHTML = '';
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${client.id}</td>
            <td>${client.name}</td>
            <td>${client.email || 'N/A'}</td>
            <td>${client.phone || 'N/A'}</td>
            <td><span class="badge bg-primary">${client.services || 0}</span></td>
            <td>
                <button class="btn btn-sm btn-dorado me-1" onclick="viewClientHistory(${client.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary me-1" onclick="selectClientForEdit(${client.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function loadClientSelect() {
    await fetchClients();
    const select = document.getElementById('editClientSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccione un cliente...</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.name} - ${client.email}`;
        select.appendChild(option);
    });
}

function viewClientHistory(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (client) showInfo('Historial de Cliente', `${client.name} ha tenido ${client.services} servicios registrados`);
}

function selectClientForEdit(clientId) {
    const selectEl = document.getElementById('editClientSelect');
    if (selectEl) {
        selectEl.value = clientId;
        selectEl.dispatchEvent(new Event('change'));
        const editTab = new bootstrap.Tab(document.getElementById('editar-tab'));
        editTab.show();
    }
}

async function deleteClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    showConfirm('Eliminar Cliente', `¿Está seguro de eliminar al cliente ${client.name}?`, async () => {
        const result = await deleteClientAPI(clientId);
        if (result && result.success) {
            showNotification('Cliente eliminado correctamente', 'success');
            await loadClients();
            await loadClientSelect();
        } else {
            showNotification('Error al eliminar cliente', 'error');
        }
    });
}

// ========== EVENTOS DE FORMULARIOS - CLIENTES ==========

function setupRegisterClientForm() {
    const form = document.getElementById('registerClientForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const result = await createClient({
            name: document.getElementById('clientName').value.trim(),
            email: document.getElementById('clientEmail').value.trim(),
            phone: document.getElementById('clientPhone').value.trim(),
            address: document.getElementById('clientAddress').value.trim()
        });

        if (result && result.success) {
            showNotification('Cliente registrado exitosamente', 'success');
            this.reset();
            await loadClients();
            await loadClientSelect();
        } else {
            showNotification('Error al registrar cliente', 'error');
        }
    });
}

function setupEditClientSelect() {
    const select = document.getElementById('editClientSelect');
    if (!select) return;
    
    select.addEventListener('change', function(e) {
        const clientId = parseInt(e.target.value);
        if (!clientId) {
            document.getElementById('editClientFields')?.classList.add('hidden');
            return;
        }

        const client = clients.find(c => c.id === clientId);
        if (client) {
            document.getElementById('editClientFields')?.classList.remove('hidden');
            document.getElementById('editClientName').value = client.name;
            document.getElementById('editClientEmail').value = client.email || '';
            document.getElementById('editClientPhone').value = client.phone || '';
            document.getElementById('editClientAddress').value = client.address || '';
        }
    });
}

function setupEditClientForm() {
    const form = document.getElementById('editClientForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const clientId = parseInt(document.getElementById('editClientSelect').value);
        const result = await updateClient(clientId, {
            name: document.getElementById('editClientName').value.trim(),
            email: document.getElementById('editClientEmail').value.trim(),
            phone: document.getElementById('editClientPhone').value.trim(),
            address: document.getElementById('editClientAddress').value.trim()
        });

        if (result && result.success) {
            showNotification('Cliente actualizado exitosamente', 'success');
            await loadClients();
            await loadClientSelect();
            this.reset();
            document.getElementById('editClientFields')?.classList.add('hidden');
        } else {
            showNotification('Error al actualizar cliente', 'error');
        }
    });
}

function setupSearchClient() {
    const searchInput = document.getElementById('searchClient');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (!searchTerm) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }

        const results = clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            (client.email && client.email.toLowerCase().includes(searchTerm)) ||
            (client.phone && client.phone.includes(searchTerm))
        );

        const resultsDiv = document.getElementById('searchResults');
        if (results.length === 0) {
            resultsDiv.innerHTML = '<div class="empty-state"><i class="bi bi-search"></i><p class="mb-0">No se encontraron clientes</p></div>';
            return;
        }

        let html = '<div class="table-responsive mt-3"><table class="table table-hover table-custom"><thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Teléfono</th></tr></thead><tbody>';
        results.forEach(client => {
            html += `<tr><td>#${client.id}</td><td>${client.name}</td><td>${client.email || 'N/A'}</td><td>${client.phone || 'N/A'}</td></tr>`;
        });
        html += '</tbody></table></div>';
        resultsDiv.innerHTML = html;
    });
}

// ========== INICIALIZACIÓN ==========

async function initializeApp() {
    console.log('🚀 Sistema de Barbería Black White - SQL Server Conectado');
    
    await fetchClients();
    await fetchServices();
    await fetchStaff();
    
    setupRegisterClientForm();
    setupEditClientSelect();
    setupEditClientForm();
    setupSearchClient();
    
    console.log('✅ Aplicación inicializada correctamente');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}