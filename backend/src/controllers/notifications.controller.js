import db from '../models/index.js';

export const sendNotification = async (req, res, next) => {
  try {
    const { user_id, title, message } = req.body;
    const created = await db.Notification.create({ user_id, title, message });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const listNotifications = async (req, res, next) => {
  try {
    const rows = await db.Notification.findAll({ where: { user_id: req.user.id }, order: [['id', 'DESC']] });
    res.json(rows);
  } catch (e) { next(e); }
};


