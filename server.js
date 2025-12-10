const express = require('express');
const path = require('path');
const { getPool, sql } = require('./db');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== RUTAS DE LA API - CLIENTES ==========

// Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                ClientId as id,
                CONCAT(FirstName, ' ', LastName) as name,
                Email as email,
                Phone as phone,
                Notes as address,
                0 as services
            FROM Clients
            WHERE FirstName IS NOT NULL
            ORDER BY ClientId DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener clientes:', err);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

// Crear un nuevo cliente
app.post('/api/clientes', async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Si el email está vacío, usar NULL; de lo contrario, usar el valor
        const emailValue = email && email.trim() !== '' ? email.trim() : null;
        const phoneValue = phone && phone.trim() !== '' ? phone.trim() : null;
        const addressValue = address && address.trim() !== '' ? address.trim() : null;
        
        const pool = await getPool();
        
        // 🔍 VALIDAR SI EL EMAIL YA EXISTE (solo si no es NULL)
        if (emailValue) {
            const checkEmail = await pool.request()
                .input('email', sql.NVarChar, emailValue)
                .query('SELECT ClientId FROM Clients WHERE Email = @email');
            
            if (checkEmail.recordset.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    error: 'Ya existe un cliente con ese correo electrónico' 
                });
            }
        }
        
        const result = await pool.request()
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('phone', sql.NVarChar, phoneValue)
            .input('email', sql.NVarChar, emailValue)
            .input('notes', sql.NVarChar, addressValue)
            .query(`
                INSERT INTO Clients (FirstName, LastName, Phone, Email, Notes, MarketingConsent)
                VALUES (@firstName, @lastName, @phone, @email, @notes, 0);
                SELECT SCOPE_IDENTITY() as ClientId;
            `);
        
        const newClientId = result.recordset[0].ClientId;
        
        res.json({ 
            success: true, 
            message: 'Cliente creado exitosamente',
            clientId: newClientId 
        });
    } catch (err) {
        console.error('Error al crear cliente:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error al crear cliente' 
        });
    }
});

// Actualizar cliente
app.put('/api/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Si el email está vacío, usar NULL; de lo contrario, usar el valor
        const emailValue = email && email.trim() !== '' ? email.trim() : null;
        const phoneValue = phone && phone.trim() !== '' ? phone.trim() : null;
        const addressValue = address && address.trim() !== '' ? address.trim() : null;
        
        const pool = await getPool();
        
        // 🔍 VALIDAR SI EL EMAIL YA EXISTE EN OTRO CLIENTE (solo si no es NULL)
        if (emailValue) {
            const checkEmail = await pool.request()
                .input('email', sql.NVarChar, emailValue)
                .input('clientId', sql.Int, id)
                .query('SELECT ClientId FROM Clients WHERE Email = @email AND ClientId != @clientId');
            
            if (checkEmail.recordset.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    error: 'Ya existe otro cliente con ese correo electrónico' 
                });
            }
        }
        
        await pool.request()
            .input('clientId', sql.Int, id)
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('phone', sql.NVarChar, phoneValue)
            .input('email', sql.NVarChar, emailValue)
            .input('notes', sql.NVarChar, addressValue)
            .query(`
                UPDATE Clients 
                SET FirstName = @firstName,
                    LastName = @lastName,
                    Phone = @phone,
                    Email = @email,
                    Notes = @notes
                WHERE ClientId = @clientId
            `);
        
        res.json({ success: true, message: 'Cliente actualizado' });
    } catch (err) {
        console.error('Error al actualizar cliente:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error al actualizar cliente' 
        });
    }
});

// Eliminar cliente
app.delete('/api/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getPool();
        
        await pool.request()
            .input('clientId', sql.Int, id)
            .query('DELETE FROM Clients WHERE ClientId = @clientId');
        
        res.json({ success: true, message: 'Cliente eliminado' });
    } catch (err) {
        console.error('Error al eliminar cliente:', err);
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
});

// ========== RUTAS DE LA API - SERVICIOS ==========

// Obtener todos los servicios
app.get('/api/servicios', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                ServiceId as id,
                Name as name,
                Description as description,
                DurationMin as duration,
                BasePrice as price,
                Active as active
            FROM Services
            WHERE Active = 1
            ORDER BY Name
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener servicios:', err);
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// Crear servicio
app.post('/api/servicios', async (req, res) => {
    try {
        const { name, description, duration, price } = req.body;
        
        const pool = await getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('duration', sql.Int, duration)
            .input('price', sql.Decimal(10, 2), price)
            .query(`
                INSERT INTO Services (Name, Description, DurationMin, BasePrice, Active)
                VALUES (@name, @description, @duration, @price, 1);
                SELECT SCOPE_IDENTITY() as ServiceId;
            `);
        
        res.json({ 
            success: true, 
            message: 'Servicio creado',
            serviceId: result.recordset[0].ServiceId 
        });
    } catch (err) {
        console.error('Error al crear servicio:', err);
        res.status(500).json({ error: 'Error al crear servicio' });
    }
});

// ========== RUTAS DE LA API - STAFF ==========

// Obtener staff (barberos)
app.get('/api/staff', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                StaffId as id,
                CONCAT(FirstName, ' ', LastName) as name,
                Role as role,
                IsActive as active
            FROM Staff
            WHERE IsActive = 1
            ORDER BY FirstName
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener staff:', err);
        res.status(500).json({ error: 'Error al obtener staff' });
    }
});

// ========== RUTAS DE LA API - CITAS ==========

// Obtener todas las citas
app.get('/api/citas', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                a.AppointmentId as id,
                CONCAT(c.FirstName, ' ', c.LastName) as clientName,
                CONCAT(s.FirstName, ' ', s.LastName) as staffName,
                a.ScheduledStart as scheduledStart,
                a.ScheduledEnd as scheduledEnd,
                a.Status as status,
                a.Notes as notes
            FROM Appointments a
            INNER JOIN Clients c ON a.ClientId = c.ClientId
            LEFT JOIN Staff s ON a.StaffId = s.StaffId
            ORDER BY a.ScheduledStart DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener citas:', err);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
});

// Crear cita
app.post('/api/citas', async (req, res) => {
    try {
        const { clientId, staffId, date, time, duration, notes } = req.body;
        
        // Combinar fecha y hora
        const scheduledStart = `${date} ${time}`;
        
        // Calcular hora de fin
        const startDate = new Date(scheduledStart);
        const endDate = new Date(startDate.getTime() + duration * 60000);
        const scheduledEnd = endDate.toISOString().slice(0, 19).replace('T', ' ');
        
        const pool = await getPool();
        const result = await pool.request()
            .input('clientId', sql.Int, clientId)
            .input('staffId', sql.Int, staffId)
            .input('scheduledStart', sql.DateTime2, scheduledStart)
            .input('scheduledEnd', sql.DateTime2, scheduledEnd)
            .input('notes', sql.NVarChar, notes)
            .query(`
                INSERT INTO Appointments (ClientId, StaffId, ScheduledStart, ScheduledEnd, Status, Notes)
                VALUES (@clientId, @staffId, @scheduledStart, @scheduledEnd, 'Scheduled', @notes);
                SELECT SCOPE_IDENTITY() as AppointmentId;
            `);
        
        res.json({ 
            success: true, 
            message: 'Cita creada',
            appointmentId: result.recordset[0].AppointmentId 
        });
    } catch (err) {
        console.error('Error al crear cita:', err);
        res.status(500).json({ error: 'Error al crear cita' });
    }
});

// Actualizar estado de cita
app.put('/api/citas/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const pool = await getPool();
        await pool.request()
            .input('appointmentId', sql.Int, id)
            .input('status', sql.NVarChar, status)
            .query(`
                UPDATE Appointments 
                SET Status = @status
                WHERE AppointmentId = @appointmentId
            `);
        
        res.json({ success: true, message: 'Estado actualizado' });
    } catch (err) {
        console.error('Error al actualizar cita:', err);
        res.status(500).json({ error: 'Error al actualizar cita' });
    }
});

// ========== RUTAS DE LA API - FACTURAS ==========

// Obtener todas las facturas
app.get('/api/facturas', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                i.InvoiceId as id,
                i.InvoiceNumber as invoiceNumber,
                i.IssuedAt as issuedAt,
                CONCAT(c.FirstName, ' ', c.LastName) as clientName,
                i.TotalAmount as total,
                i.Status as status
            FROM Invoices i
            INNER JOIN Clients c ON i.ClientId = c.ClientId
            ORDER BY i.IssuedAt DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener facturas:', err);
        res.status(500).json({ error: 'Error al obtener facturas' });
    }
});

// Crear factura
app.post('/api/facturas', async (req, res) => {
    try {
        const { clientId, appointmentId, services, subtotal, tax, total, paymentMethod } = req.body;
        
        const pool = await getPool();
        
        // Generar número de factura
        const seqResult = await pool.request().query('SELECT NEXT VALUE FOR InvoiceNumberSeq as NextVal');
        const invoiceNumber = `INV-${String(seqResult.recordset[0].NextVal).padStart(6, '0')}`;
        
        // Crear factura
        const invoiceResult = await pool.request()
            .input('invoiceNumber', sql.NVarChar, invoiceNumber)
            .input('clientId', sql.Int, clientId)
            .input('appointmentId', sql.Int, appointmentId)
            .input('total', sql.Decimal(10, 2), total)
            .query(`
                INSERT INTO Invoices (InvoiceNumber, ClientId, AppointmentId, IssuedAt, TotalAmount, Status)
                VALUES (@invoiceNumber, @clientId, @appointmentId, GETDATE(), @total, 'Paid');
                SELECT SCOPE_IDENTITY() as InvoiceId;
            `);
        
        const invoiceId = invoiceResult.recordset[0].InvoiceId;
        
        // Crear líneas de factura
        for (const service of services) {
            await pool.request()
                .input('invoiceId', sql.Int, invoiceId)
                .input('serviceId', sql.Int, service.serviceId)
                .input('description', sql.NVarChar, service.name)
                .input('quantity', sql.Int, 1)
                .input('unitPrice', sql.Decimal(10, 2), service.price)
                .input('lineTotal', sql.Decimal(10, 2), service.price)
                .query(`
                    INSERT INTO InvoiceLines (InvoiceId, ServiceId, Description, Quantity, UnitPrice, LineTotal)
                    VALUES (@invoiceId, @serviceId, @description, @quantity, @unitPrice, @lineTotal)
                `);
        }
        
        // Crear registro de pago
        await pool.request()
            .input('invoiceId', sql.Int, invoiceId)
            .input('amount', sql.Decimal(10, 2), total)
            .input('method', sql.NVarChar, paymentMethod)
            .query(`
                INSERT INTO Payments (InvoiceId, Amount, PaidAt, Method)
                VALUES (@invoiceId, @amount, GETDATE(), @method)
            `);
        
        res.json({ 
            success: true, 
            message: 'Factura creada',
            invoiceId: invoiceId,
            invoiceNumber: invoiceNumber
        });
    } catch (err) {
        console.error('Error al crear factura:', err);
        res.status(500).json({ error: 'Error al crear factura' });
    }
});

// ========== RUTAS DE LA API - ASISTENCIAS ==========

// Obtener asistencias
app.get('/api/asistencias', async (req, res) => {
    try {
        const { date } = req.query;
        const pool = await getPool();
        
        let query = `
            SELECT 
                a.AttendanceId as id,
                CONCAT(s.FirstName, ' ', s.LastName) as employeeName,
                a.DateWorked as date,
                a.CheckIn as checkIn,
                a.CheckOut as checkOut,
                a.BreakMinutes as breakMinutes
            FROM Attendance a
            INNER JOIN Staff s ON a.StaffId = s.StaffId
        `;
        
        if (date) {
            query += ` WHERE CAST(a.DateWorked AS DATE) = @date`;
        }
        
        query += ` ORDER BY a.DateWorked DESC, a.CheckIn DESC`;
        
        const request = pool.request();
        if (date) {
            request.input('date', sql.Date, date);
        }
        
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener asistencias:', err);
        res.status(500).json({ error: 'Error al obtener asistencias' });
    }
});

// Registrar asistencia
app.post('/api/asistencias', async (req, res) => {
    try {
        const { staffId, date, checkIn, checkOut, breakMinutes } = req.body;
        
        const pool = await getPool();
        const result = await pool.request()
            .input('staffId', sql.Int, staffId)
            .input('date', sql.Date, date)
            .input('checkIn', sql.DateTime2, `${date} ${checkIn}`)
            .input('checkOut', sql.DateTime2, checkOut ? `${date} ${checkOut}` : null)
            .input('breakMinutes', sql.Int, breakMinutes || 0)
            .query(`
                INSERT INTO Attendance (StaffId, DateWorked, CheckIn, CheckOut, BreakMinutes)
                VALUES (@staffId, @date, @checkIn, @checkOut, @breakMinutes);
                SELECT SCOPE_IDENTITY() as AttendanceId;
            `);
        
        res.json({ 
            success: true, 
            message: 'Asistencia registrada',
            attendanceId: result.recordset[0].AttendanceId 
        });
    } catch (err) {
        console.error('Error al registrar asistencia:', err);
        res.status(500).json({ error: 'Error al registrar asistencia' });
    }
});

// ========== RUTAS DE LA API - REPORTES ==========

// Reporte de ingresos
app.get('/api/reportes/ingresos', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const pool = await getPool();
        const result = await pool.request()
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .query(`
                SELECT 
                    COUNT(*) as totalFacturas,
                    SUM(TotalAmount) as totalIngresos,
                    AVG(TotalAmount) as promedioFactura
                FROM Invoices
                WHERE CAST(IssuedAt AS DATE) BETWEEN @startDate AND @endDate
                    AND Status = 'Paid'
            `);
        
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error al generar reporte:', err);
        res.status(500).json({ error: 'Error al generar reporte' });
    }
});

// Reporte de ventas por servicio
app.get('/api/reportes/servicios', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const pool = await getPool();
        const result = await pool.request()
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .query(`
                SELECT 
                    s.Name as servicio,
                    COUNT(il.InvoiceLineId) as cantidad,
                    SUM(il.LineTotal) as totalVentas
                FROM InvoiceLines il
                INNER JOIN Services s ON il.ServiceId = s.ServiceId
                INNER JOIN Invoices i ON il.InvoiceId = i.InvoiceId
                WHERE CAST(i.IssuedAt AS DATE) BETWEEN @startDate AND @endDate
                    AND i.Status = 'Paid'
                GROUP BY s.Name
                ORDER BY totalVentas DESC
            `);
        
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al generar reporte:', err);
        res.status(500).json({ error: 'Error al generar reporte' });
    }
});

// ========== RUTAS DE LA API - MARKETING ==========

// Obtener campañas
app.get('/api/marketing/campanas', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                CampaignId as id,
                Name as name,
                Channel as channel,
                StartDate as startDate,
                EndDate as endDate,
                Budget as budget
            FROM MarketingCampaigns
            ORDER BY StartDate DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener campañas:', err);
        res.status(500).json({ error: 'Error al obtener campañas' });
    }
});

// Crear campaña
app.post('/api/marketing/campanas', async (req, res) => {
    try {
        const { name, channel, startDate, endDate, budget } = req.body;
        
        const pool = await getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('channel', sql.NVarChar, channel)
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .input('budget', sql.Decimal(10, 2), budget)
            .query(`
                INSERT INTO MarketingCampaigns (Name, Channel, StartDate, EndDate, Budget)
                VALUES (@name, @channel, @startDate, @endDate, @budget);
                SELECT SCOPE_IDENTITY() as CampaignId;
            `);
        
        res.json({ 
            success: true, 
            message: 'Campaña creada',
            campaignId: result.recordset[0].CampaignId 
        });
    } catch (err) {
        console.error('Error al crear campaña:', err);
        res.status(500).json({ error: 'Error al crear campaña' });
    }
});

// Iniciar servidor y conectar a la base de datos
app.listen(port, async () => {
  console.log(`========================================`);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`========================================`);
  
  try {
      await getPool();
  } catch (err) {
      console.error('⚠️  No se pudo conectar a la base de datos al iniciar');
  }
});