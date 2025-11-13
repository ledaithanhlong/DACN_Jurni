import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultOrder = {
  items: [
    {
      id: 'FL-001',
      name: 'Vé máy bay khứ hồi TP.HCM ⇄ Hà Nội',
      type: 'flight',
      quantity: 1,
      price: 1950000,
    },
    {
      id: 'HT-102',
      name: 'Khách sạn Hanoi Central Boutique (3 đêm)',
      type: 'hotel',
      quantity: 1,
      price: 1650000,
    },
  ],
  currency: 'VND',
  booking: null,
};

const formatCurrency = (value = 0, currency = 'VND') => {
  const number = Number(value) || 0;
  return `${new Intl.NumberFormat('vi-VN').format(number)} ${currency}`;
};

export default function PaymentPage() {
  const { state } = useLocation();
  const order = state?.order || defaultOrder;
  const [config, setConfig] = useState({ paymentMethods: [], currency: 'VND', bankAccount: null });
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [form, setForm] = useState({
    fullName: state?.customer?.name || '',
    email: state?.customer?.email || '',
    phone: state?.customer?.phone || '',
    notes: '',
    paymentMethod: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    walletPhone: '',
    bankReference: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '', reference: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API}/payments/config`);
        if (!mounted) return;
        setConfig(res.data);
        setForm((prev) => ({
          ...prev,
          paymentMethod: state?.preferredMethod || res.data?.paymentMethods?.[0]?.id || '',
        }));
      } catch (err) {
        if (!mounted) return;
        setStatus({
          type: 'error',
          message: err.response?.data?.error || 'Không thể tải cấu hình thanh toán. Vui lòng thử lại.',
        });
      } finally {
        if (mounted) setLoadingConfig(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [state?.preferredMethod]);

  const subtotal = useMemo(() => {
    if (!order?.items?.length) return 0;
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [order]);

  const selectedMethod = useMemo(
    () => config.paymentMethods?.find((method) => method.id === form.paymentMethod),
    [config.paymentMethods, form.paymentMethod],
  );

  const methodFee = useMemo(() => {
    if (!selectedMethod) return 0;
    const percentFee = subtotal * (selectedMethod.feePercent || 0);
    const fixedFee = selectedMethod.feeFixed || 0;
    return Math.round(percentFee + fixedFee);
  }, [selectedMethod, subtotal]);

  const total = subtotal + methodFee;

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedMethod) {
      setStatus({ type: 'error', message: 'Vui lòng chọn phương thức thanh toán.', reference: '' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: null, message: '', reference: '' });

    try {
      const payload = {
        amount: total,
        currency: config.currency || order.currency || 'VND',
        paymentMethod: selectedMethod.id,
        customer: {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
        },
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        booking: order.booking,
        metadata: {
          notes: form.notes,
          methodFee,
        },
      };

      const res = await axios.post(`${API}/payments/checkout`, payload);
      setStatus({
        type: 'success',
        message: res.data?.message || 'Thanh toán thành công!',
        reference: res.data?.payment?.reference || '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.error || 'Thanh toán thất bại. Vui lòng kiểm tra lại thông tin.',
        reference: '',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderMethodExtras = () => {
    if (!selectedMethod) return null;

    if (selectedMethod.type === 'card') {
      return (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-blue-900">Số thẻ</label>
            <input
              value={form.cardNumber}
              onChange={handleChange('cardNumber')}
              placeholder="XXXX XXXX XXXX XXXX"
              className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-900">Ngày hết hạn</label>
            <input
              value={form.cardExpiry}
              onChange={handleChange('cardExpiry')}
              placeholder="MM/YY"
              className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-900">Mã bảo mật (CVV)</label>
            <input
              value={form.cardCvc}
              onChange={handleChange('cardCvc')}
              placeholder="123"
              className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              inputMode="numeric"
              maxLength={4}
            />
          </div>
        </div>
      );
    }

    if (selectedMethod.type === 'ewallet') {
      return (
        <div>
          <label className="text-sm font-medium text-blue-900">Số điện thoại ví</label>
          <input
            value={form.walletPhone}
            onChange={handleChange('walletPhone')}
            placeholder="Nhập số điện thoại đã đăng ký ví"
            className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      );
    }

    if (selectedMethod.type === 'bank') {
      return (
        <div>
          <label className="text-sm font-medium text-blue-900">Nội dung chuyển khoản</label>
          <input
            value={form.bankReference}
            onChange={handleChange('bankReference')}
            placeholder="Ví dụ: JURNI {HỌ TÊN}"
            className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-blue-500">Thanh toán</span>
          <h1 className="mt-2 text-3xl font-semibold text-blue-900">Hoàn tất đặt dịch vụ của bạn</h1>
          <p className="mt-2 text-sm text-blue-700/80 max-w-2xl">
            Điền thông tin thanh toán để hoàn tất đặt chỗ. Dữ liệu của bạn được bảo vệ bằng chuẩn bảo mật PCI-DSS.
          </p>
        </div>

        {status.type && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
              status.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {status.type === 'success' ? 'Thanh toán thành công' : 'Có lỗi xảy ra'}
                </p>
                <p className="mt-1 text-xs leading-5">{status.message}</p>
              </div>
              {status.reference && (
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                  Mã giao dịch: {status.reference}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-xl shadow-blue-100/40 backdrop-blur"
          >
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-blue-900">Thông tin liên hệ</h2>
                <span className="text-xs text-blue-600/70">* Bắt buộc</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-blue-900">Họ và tên *</label>
                  <input
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    placeholder="Nhập họ và tên của bạn"
                    className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-900">Số điện thoại *</label>
                  <input
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder="Nhập số điện thoại"
                    className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-blue-900">Email nhận hóa đơn *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-blue-900">Ghi chú cho đơn đặt (không bắt buộc)</label>
                <textarea
                  value={form.notes}
                  onChange={handleChange('notes')}
                  rows={3}
                  placeholder="Thông tin bổ sung cho đội ngũ Jurni..."
                  className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900">Phương thức thanh toán</h2>
              {loadingConfig ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-sm text-blue-700/80">
                  Đang tải cấu hình thanh toán...
                </div>
              ) : (
                <div className="space-y-3">
                  {config.paymentMethods?.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-3 transition ${
                        form.paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50/80 shadow-lg shadow-blue-100/60'
                          : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-semibold text-blue-900">{method.name}</span>
                          <p className="mt-1 text-sm text-blue-700/80">{method.description}</p>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={form.paymentMethod === method.id}
                          onChange={handleChange('paymentMethod')}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-xs text-blue-600/70">
                        Phí xử lý: {(method.feePercent * 100).toFixed(1)}% +{' '}
                        {method.feeFixed ? formatCurrency(method.feeFixed, config.currency) : '0 VND'}
                      </p>
                    </label>
                  ))}
                </div>
              )}
              <div className="rounded-2xl border border-blue-100 bg-white/70 p-5">
                <h3 className="font-semibold text-blue-900">Thông tin bổ sung</h3>
                <div className="mt-4 space-y-4">{renderMethodExtras()}</div>
              </div>

              {selectedMethod?.type === 'bank' && config.bankAccount && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 text-sm text-blue-800">
                  <p className="font-semibold text-blue-900">Thông tin chuyển khoản</p>
                  <p className="mt-2">Ngân hàng: {config.bankAccount.bank}</p>
                  <p>Số tài khoản: <span className="font-semibold">{config.bankAccount.accountNumber}</span></p>
                  <p>Chủ tài khoản: {config.bankAccount.name}</p>
                  <p className="mt-2 text-xs text-blue-600/80">
                    Đơn hàng sẽ được xác nhận trong vòng 15 phút sau khi nhận được chuyển khoản.
                  </p>
                </div>
              )}
            </section>

            <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-5 text-white shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-white/80">Tổng thanh toán</p>
                  <p className="text-2xl font-semibold">{formatCurrency(total, config.currency)}</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition disabled:pointer-events-none disabled:opacity-60"
                >
                  {submitting ? 'Đang xử lý...' : 'Thanh toán & Hoàn tất đặt chỗ'}
                </button>
              </div>
              <p className="text-xs text-white/80">
                Khi chọn “Thanh toán”, bạn đồng ý với điều khoản sử dụng và chính sách hủy của Jurni.
              </p>
            </div>
          </form>

          <aside className="space-y-6 rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-xl shadow-blue-100/40 backdrop-blur">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Tóm tắt đơn đặt</h3>
              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-blue-50 bg-blue-50/50 px-4 py-3">
                    <div className="flex items-center justify-between text-sm text-blue-800">
                      <span className="font-semibold text-blue-900">{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                    <p className="mt-1 text-xs uppercase text-blue-600/70 tracking-wide">{item.type}</p>
                    <p className="mt-2 text-sm font-semibold text-blue-900">
                      {formatCurrency(item.price * item.quantity, config.currency || order.currency)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-50 bg-blue-50/60 px-4 py-3 text-sm text-blue-800">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold">{formatCurrency(subtotal, config.currency || order.currency)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Phí xử lý</span>
                <span className="font-semibold">{formatCurrency(methodFee, config.currency || order.currency)}</span>
              </div>
              <div className="mt-2 border-t border-blue-100 pt-2 flex items-center justify-between text-blue-900">
                <span className="font-semibold">Tổng thanh toán</span>
                <span className="text-lg font-semibold">{formatCurrency(total, config.currency || order.currency)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-4 text-xs text-blue-700/80">
              <p className="font-semibold text-blue-900">Cam kết Jurni</p>
              <ul className="mt-2 space-y-2">
                <li>✔︎ Hoàn tiền trong 48h nếu thanh toán thất bại.</li>
                <li>✔︎ Hỗ trợ trực tuyến 24/7 trong suốt hành trình.</li>
                <li>✔︎ Mã hóa tiêu chuẩn ngành, bảo mật tuyệt đối thông tin thẻ.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


