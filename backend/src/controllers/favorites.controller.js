import db from '../models/index.js';

export const addFavorite = async (req, res, next) => {
  try {
    const { service_type, service_id } = req.body;
    const created = await db.Favorite.create({ user_id: req.user.id, service_type, service_id });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const listFavorites = async (req, res, next) => {
  try {
    const rows = await db.Favorite.findAll({ where: { user_id: req.user.id }, order: [['id', 'DESC']] });
    res.json(rows);
  } catch (e) { next(e); }
};


