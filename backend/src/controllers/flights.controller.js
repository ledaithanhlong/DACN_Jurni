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
    const created = await db.Flight.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateFlight = async (req, res, next) => {
  try {
    const row = await db.Flight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.update(req.body);
    res.json(row);
  } catch (e) { next(e); }
};

export const deleteFlight = async (req, res, next) => {
  try {
    const row = await db.Flight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
};


