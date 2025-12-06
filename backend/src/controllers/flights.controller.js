import db from '../models/index.js';

export const listFlights = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const where = {};
    if (from) where.departure_city = from;
    if (to) where.arrival_city = to;
    const rows = await db.Flight.findAll({ where, order: [['id', 'DESC']] });
    res.json(rows);
  } catch (e) { next(e); }
};

export const createFlight = async (req, res, next) => {
  try {
    const { 
      airline, 
      flight_number,
      departure_city, 
      arrival_city, 
      departure_time, 
      arrival_time, 
      price, 
      image_url,
      flight_type,
      amenities,
      policies,
      available_seats
    } = req.body;

    // Validation
    if (!airline || !departure_city || !arrival_city || !departure_time || !arrival_time || !price) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    if (departure_city === arrival_city) {
      return res.status(400).json({ error: 'Thành phố đi và đến không được giống nhau' });
    }

    const depTime = new Date(departure_time);
    const arrTime = new Date(arrival_time);

    if (depTime >= arrTime) {
      return res.status(400).json({ error: 'Giờ đến phải sau giờ khởi hành' });
    }

    if (price <= 0) {
      return res.status(400).json({ error: 'Giá vé phải lớn hơn 0' });
    }

    const created = await db.Flight.create({
      airline,
      flight_number: flight_number || null,
      departure_city,
      arrival_city,
      departure_time: depTime,
      arrival_time: arrTime,
      price: parseFloat(price),
      image_url: image_url || null,
      flight_type: flight_type || 'economy',
      amenities: amenities || null,
      policies: policies || null,
      available_seats: available_seats || 180
    });

    res.status(201).json(created);
  } catch (e) {
    if (e.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Dữ liệu không hợp lệ', details: e.errors });
    }
    next(e);
  }
};

export const createBulkFlights = async (req, res, next) => {
  try {
    const { 
      airline, 
      flight_number_prefix,
      departure_city, 
      arrival_city, 
      departure_time, 
      price, 
      image_url,
      flight_type,
      amenities,
      policies,
      available_seats,
      count,
      interval_hours = 2,
      interval_minutes = 10,
      flight_duration_hours = 2,
      flight_duration_minutes = 30
    } = req.body;

    // Validation
    if (!airline || !departure_city || !arrival_city || !departure_time || !price) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    if (departure_city === arrival_city) {
      return res.status(400).json({ error: 'Thành phố đi và đến không được giống nhau' });
    }

    if (!count || count < 1 || count > 50) {
      return res.status(400).json({ error: 'Số lượng vé phải từ 1 đến 50' });
    }

    if (price <= 0) {
      return res.status(400).json({ error: 'Giá vé phải lớn hơn 0' });
    }

    const baseDepTime = new Date(departure_time);
    // Tính thời gian bay (2h30p mặc định)
    const flightDurationMs = (flight_duration_hours * 60 + flight_duration_minutes) * 60 * 1000;
    // Khoảng cách giữa các chuyến bay
    const intervalMs = (interval_hours * 60 + interval_minutes) * 60 * 1000;

    const flights = [];

    for (let i = 0; i < count; i++) {
      const currentDepTime = new Date(baseDepTime.getTime() + (i * intervalMs));
      // Giờ đến = giờ khởi hành + thời gian bay (2h30p)
      const currentArrTime = new Date(currentDepTime.getTime() + flightDurationMs);
      
      const flightNumber = flight_number_prefix 
        ? `${flight_number_prefix}${String(i + 1).padStart(3, '0')}`
        : null;

      flights.push({
        airline,
        flight_number: flightNumber,
        departure_city,
        arrival_city,
        departure_time: currentDepTime,
        arrival_time: currentArrTime,
        price: parseFloat(price),
        image_url: image_url || null,
        flight_type: flight_type || 'economy',
        amenities: amenities || null,
        policies: policies || null,
        available_seats: available_seats || 180
      });
    }

    const created = await db.Flight.bulkCreate(flights);
    res.status(201).json({ 
      message: `Đã tạo thành công ${created.length} chuyến bay`,
      flights: created 
    });
  } catch (e) {
    if (e.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Dữ liệu không hợp lệ', details: e.errors });
    }
    next(e);
  }
};

export const updateFlight = async (req, res, next) => {
  try {
    const row = await db.Flight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Không tìm thấy chuyến bay' });

    const { 
      airline, 
      flight_number,
      departure_city, 
      arrival_city, 
      departure_time, 
      arrival_time, 
      price, 
      image_url,
      flight_type,
      amenities,
      policies,
      available_seats
    } = req.body;

    // Validation
    if (departure_city && arrival_city && departure_city === arrival_city) {
      return res.status(400).json({ error: 'Thành phố đi và đến không được giống nhau' });
    }

    if (departure_time && arrival_time) {
      const depTime = new Date(departure_time);
      const arrTime = new Date(arrival_time);
      if (depTime >= arrTime) {
        return res.status(400).json({ error: 'Giờ đến phải sau giờ khởi hành' });
      }
    }

    if (price !== undefined && price <= 0) {
      return res.status(400).json({ error: 'Giá vé phải lớn hơn 0' });
    }

    const updateData = {};
    if (airline) updateData.airline = airline;
    if (flight_number !== undefined) updateData.flight_number = flight_number || null;
    if (departure_city) updateData.departure_city = departure_city;
    if (arrival_city) updateData.arrival_city = arrival_city;
    if (departure_time) updateData.departure_time = new Date(departure_time);
    if (arrival_time) updateData.arrival_time = new Date(arrival_time);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (image_url !== undefined) updateData.image_url = image_url || null;
    if (flight_type) updateData.flight_type = flight_type;
    if (amenities !== undefined) updateData.amenities = amenities;
    if (policies !== undefined) updateData.policies = policies;
    if (available_seats !== undefined) updateData.available_seats = available_seats;

    await row.update(updateData);
    res.json(row);
  } catch (e) {
    if (e.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Dữ liệu không hợp lệ', details: e.errors });
    }
    next(e);
  }
};

export const deleteFlight = async (req, res, next) => {
  try {
    const row = await db.Flight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Không tìm thấy chuyến bay' });
    await row.destroy();
    res.json({ ok: true, message: 'Xóa chuyến bay thành công' });
  } catch (e) { next(e); }
};


