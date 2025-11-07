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


