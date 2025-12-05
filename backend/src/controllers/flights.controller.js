import db from '../models/index.js';

export const listFlights = async (req, res, next) => {
  try {
    const { from, to, date, class: flightClass, sort } = req.query;
    const where = {};
    if (from) where.departure_city = from;
    if (to) where.arrival_city = to;
    if (flightClass) where.class = flightClass;
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      where.departure_time = {
        [db.Sequelize.Op.gte]: searchDate,
        [db.Sequelize.Op.lt]: nextDay
      };
    }
    const order = sort === 'price_asc' ? [['price', 'ASC']] : 
                  sort === 'price_desc' ? [['price', 'DESC']] : 
                  sort === 'duration_asc' ? [['duration', 'ASC']] :
                  [['departure_time', 'ASC']];
    const rows = await db.Flight.findAll({ where, order });
    res.json(rows);
  } catch (e) { next(e); }
};

export const getFlight = async (req, res, next) => {
  try {
    const flight = await db.Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Not found' });
    res.json(flight);
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


