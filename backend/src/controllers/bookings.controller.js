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
    const rows = await db.Booking.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.User, attributes: ['id', 'name', 'email'] } // Ensure User association exists or handle gracefully
      ]
    });
    res.json(rows);
  } catch (e) {
    // Fallback if association fails or generic error
    try {
      const rows = await db.Booking.findAll({ order: [['createdAt', 'DESC']] });
      res.json(rows);
    } catch (err) {
      next(err);
    }
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


