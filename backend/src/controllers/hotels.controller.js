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
    const user = req.user;
    const userRole = req.userRole;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate required fields
    const {
      name,
      description,
      stars,
      type,
      address,
      city,
      latitude,
      longitude,
      phone,
      email,
      website,
      amenities,
      checkIn,
      checkOut,
      policyCancel,
      policyChildren,
      policyPet,
      images,
      status
    } = req.body;

    // Required fields validation
    if (!name || !description || !address || !city || !phone || !email) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Missing required fields: name, description, address, city, phone, email'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    // GPS validation
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      return res.status(400).json({ error: 'Invalid latitude (must be between -90 and 90)' });
    }
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      return res.status(400).json({ error: 'Invalid longitude (must be between -180 and 180)' });
    }

    // Stars validation
    if (stars !== undefined && (stars < 1 || stars > 5)) {
      return res.status(400).json({ error: 'Stars must be between 1 and 5' });
    }

    // Status and role logic
    let finalStatus = 'pending';
    if (userRole === 'admin') {
      // Admin can set status
      if (status && (status === 'pending' || status === 'approved')) {
        finalStatus = status;
      }
    } else if (userRole === 'admin2') {
      // Admin2 can only create with pending status
      if (status && status !== 'pending') {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Admin Level 2 cannot set status other than "pending"'
        });
      }
      finalStatus = 'pending';
    } else {
      return res.status(403).json({ error: 'Forbidden', message: 'Admin or Admin Level 2 access required' });
    }

    // Prepare hotel data
    const hotelData = {
      name,
      description,
      stars: stars ? parseInt(stars) : null,
      type: type || null,
      address,
      city,
      location: city, // Keep for backward compatibility
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      phone,
      email,
      website: website || null,
      amenities: amenities || [],
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      policyCancel: policyCancel || null,
      policyChildren: policyChildren || null,
      policyPet: policyPet || null,
      thumbnailUrl: images?.thumbnail || null,
      galleryUrls: images?.gallery || [],
      image_url: images?.thumbnail || null, // Keep for backward compatibility
      status: finalStatus,
      createdBy: user.id,
      approvedBy: finalStatus === 'approved' ? user.id : null,
      price: req.body.price || 0, // Default price
      rating: req.body.rating || null
    };

    const created = await db.Hotel.create(hotelData);
    
    // Load with associations
    const hotel = await db.Hotel.findByPk(created.id, {
      include: [
        { model: db.User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: db.User, as: 'approver', attributes: ['id', 'name', 'email'], required: false }
      ]
    });

    res.status(201).json(hotel);
  } catch (e) {
    console.error('createHotel error:', e);
    next(e);
  }
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


