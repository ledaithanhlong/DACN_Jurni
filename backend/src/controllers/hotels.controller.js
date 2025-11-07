import db from '../models/index.js';

export const listHotels = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, sort } = req.query;
    const where = {};
    if (q) where.name = db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('name')), 'LIKE', `%${q.toLowerCase()}%`);
    if (minPrice) where.price = { ...(where.price || {}), [db.Sequelize.Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [db.Sequelize.Op.lte]: Number(maxPrice) };
    const order = sort === 'price_asc' ? [['price', 'ASC']] : sort === 'price_desc' ? [['price', 'DESC']] : [['id', 'DESC']];
    const hotels = await db.Hotel.findAll({ where, order });
    res.json(hotels);
  } catch (e) { next(e); }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await db.Hotel.findByPk(req.params.id, { include: [{ model: db.Room, as: 'rooms' }] });
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    res.json(hotel);
  } catch (e) { next(e); }
};

export const createHotel = async (req, res, next) => {
  try {
    const created = await db.Hotel.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await db.Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    await hotel.update(req.body);
    res.json(hotel);
  } catch (e) { next(e); }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await db.Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    await hotel.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
};


