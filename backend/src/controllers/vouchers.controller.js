import db from '../models/index.js';
import { Op } from 'sequelize';

export const listVouchers = async (req, res, next) => {
  try {
    const now = new Date();
    const rows = await db.Voucher.findAll({ where: { expiry_date: { [Op.gte]: now } }, order: [['expiry_date', 'ASC']] });
    res.json(rows);
  } catch (e) { next(e); }
};

export const createVoucher = async (req, res, next) => {
  try {
    const created = await db.Voucher.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const deleteVoucher = async (req, res, next) => {
  try {
    const row = await db.Voucher.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
};


