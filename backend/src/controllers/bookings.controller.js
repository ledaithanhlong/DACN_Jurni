import db from '../models/index.js';

export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const payload = { ...req.body, user_id: userId };
    const created = await db.Booking.create(payload);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const getBooking = async (req, res, next) => {
  try {
    const row = await db.Booking.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    if (req.user?.role !== 'admin' && row.user_id !== req.user?.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(row);
  } catch (e) { next(e); }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Admin sees all bookings, regular users only see their own
    const whereClause = userRole === 'admin' ? {} : { user_id: userId };

    // Temporarily disabled User association due to configuration issue
    const rows = await db.Booking.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.json(rows);
  } catch (e) {
    console.error('Error getting bookings:', e);
    next(e);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await db.Booking.findByPk(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (e) { next(e); }
};


