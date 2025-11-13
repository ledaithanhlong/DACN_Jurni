import db from '../models/index.js';

const paymentMethods = [
  {
    id: 'card',
    name: 'Thẻ quốc tế (Visa / Mastercard)',
    type: 'card',
    feePercent: 0.018,
    feeFixed: 0,
    description: 'Thanh toán tức thời với thẻ Visa, Mastercard hoặc JCB.',
  },
  {
    id: 'momo',
    name: 'Ví điện tử MoMo',
    type: 'ewallet',
    feePercent: 0.012,
    feeFixed: 2000,
    description: 'Quét mã QR hoặc xác nhận trên ứng dụng MoMo.',
  },
  {
    id: 'zalopay',
    name: 'Ví ZaloPay',
    type: 'ewallet',
    feePercent: 0.01,
    feeFixed: 1500,
    description: 'Xác nhận giao dịch qua ứng dụng ZaloPay.',
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    type: 'bank',
    feePercent: 0,
    feeFixed: 0,
    description: 'Miễn phí. Hoàn tất trong vòng 15 phút kể từ khi nhận tiền.',
  },
];

export const getPaymentConfig = async (req, res, next) => {
  try {
    res.json({
      currency: 'VND',
      paymentMethods,
      bankAccount: {
        name: 'CÔNG TY TNHH DU LỊCH JURNI',
        bank: 'Vietcombank - CN Tân Định',
        accountNumber: '0451 2345 6789',
      },
      notes: 'Phí giao dịch có thể thay đổi tùy theo ngân hàng phát hành.',
    });
  } catch (e) {
    next(e);
  }
};

export const processPayment = async (req, res, next) => {
  try {
    const {
      amount,
      currency = 'VND',
      paymentMethod,
      customer,
      items = [],
      booking,
    } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Số tiền thanh toán không hợp lệ.' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Vui lòng chọn phương thức thanh toán.' });
    }

    const method = paymentMethods.find((m) => m.id === paymentMethod);
    if (!method) {
      return res.status(400).json({ error: 'Phương thức thanh toán không được hỗ trợ.' });
    }

    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ error: 'Thiếu thông tin liên hệ của khách hàng.' });
    }

    const amountNumber = Number(amount);
    const fee = amountNumber * method.feePercent + method.feeFixed;
    const transactionReference = `PAY-${Date.now()}`;

    let bookingRecord = null;
    if (booking?.service_type && booking?.service_id) {
      const userId = req.user?.id || booking.user_id;
      if (userId) {
        bookingRecord = await db.Booking.create({
          user_id: userId,
          service_type: booking.service_type,
          service_id: booking.service_id,
          total_price: amountNumber,
          status: 'confirmed',
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thanh toán thành công. Hóa đơn đã được gửi tới email của bạn.',
      payment: {
        reference: transactionReference,
        status: 'succeeded',
        method: method.id,
        amount: amountNumber,
        currency,
        fee: Number(fee.toFixed(0)),
        processedAt: new Date().toISOString(),
      },
      booking: bookingRecord,
      customer,
      items,
    });
  } catch (e) {
    next(e);
  }
};


