import db from '../models/index.js';

const parseJsonFields = (payload) => {
  const hotelData = { ...payload };
  const jsonFields = ['amenities', 'policies', 'images', 'nearby_attractions', 'public_transport'];

  jsonFields.forEach((field) => {
    if (typeof hotelData[field] === 'string') {
      try {
        hotelData[field] = JSON.parse(hotelData[field]);
      } catch {
        hotelData[field] = hotelData[field] ? [hotelData[field]] : null;
      }
    }
  });

  return hotelData;
};

export const listHotels = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, sort } = req.query;
    const where = { status: 'approved' };
    if (q) where.name = db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('name')), 'LIKE', `%${q.toLowerCase()}%`);
    if (minPrice) where.price = { ...(where.price || {}), [db.Sequelize.Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [db.Sequelize.Op.lte]: Number(maxPrice) };
    const order = sort === 'price_asc' ? [['price', 'ASC']] : sort === 'price_desc' ? [['price', 'DESC']] : [['id', 'DESC']];
    const hotels = await db.Hotel.findAll({ where, order });
    res.json(hotels);
  } catch (e) { next(e); }
};

export const listAllHotels = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, sort, status } = req.query;
    const where = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) where.status = status;
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
    const hotelData = parseJsonFields(req.body);
    hotelData.status = 'pending';
    hotelData.approved_by = null;
    hotelData.approved_at = null;
    hotelData.approval_note = null;
    const created = await db.Hotel.create(hotelData);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await db.Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Not found' });

    const hotelData = parseJsonFields(req.body);
    const statusChangedToApproved = hotelData.status === 'approved' && hotel.status !== 'approved';
    const statusChangedToPending = hotelData.status === 'pending';
    const statusChangedToRejected = hotelData.status === 'rejected';

    if (statusChangedToApproved) {
      hotelData.approved_by = req.user?.id || hotel.approved_by;
      hotelData.approved_at = new Date();
    } else if (statusChangedToPending) {
      hotelData.approved_by = null;
      hotelData.approved_at = null;
    } else if (statusChangedToRejected) {
      hotelData.approved_by = req.user?.id || null;
      hotelData.approved_at = new Date();
    }

    await hotel.update(hotelData);
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


