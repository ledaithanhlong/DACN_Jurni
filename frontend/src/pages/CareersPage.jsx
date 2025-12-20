import React from 'react';
import { Briefcase, Heart, Globe, DollarSign, Award, Coffee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareersPage = () => {
    const positions = [
        {
            id: 1,
            title: 'Senior Frontend Engineer',
            department: 'Engineering',
            location: 'Hồ Chí Minh (Hybrid)',
            type: 'Full-time',
        },
        {
            id: 2,
            title: 'Product Designer (UI/UX)',
            department: 'Design',
            location: 'Hồ Chí Minh',
            type: 'Full-time',
        },
        {
            id: 3,
            title: 'Marketing Specialist',
            department: 'Marketing',
            location: 'Hà Nội (Remote)',
            type: 'Part-time',
        },
        {
            id: 4,
            title: 'Customer Success Manager',
            department: 'Operations',
            location: 'Đà Nẵng',
            type: 'Full-time',
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="bg-blue-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-800/50 backdrop-blur-sm z-0"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Cùng Jurni <span className="text-orange-400">Kiến Tạo</span> Tương Lai Du Lịch
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Chúng tôi không chỉ xây dựng một ứng dụng, chúng tôi đang kết nối mọi người với những trải nghiệm tuyệt vời nhất Việt Nam.
                    </p>
                    <a
                        href="#positions"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                        <Briefcase className="w-5 h-5" />
                        Xem vị trí tuyển dụng
                    </a>
                </div>
            </div>

            {/* Values Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Tại sao chọn Jurni?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tại Jurni, văn hóa là nền tảng của mọi thành công. Chúng tôi trân trọng sự sáng tạo và đam mê.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Globe className="w-8 h-8 text-blue-600" />,
                            title: "Tác Động Toàn Cầu",
                            desc: "Sản phẩm của bạn sẽ giúp hàng nghìn người khám phá và yêu mến vẻ đẹp của đất nước."
                        },
                        {
                            icon: <Heart className="w-8 h-8 text-red-500" />,
                            title: "Con Người Là Trên Hết",
                            desc: "Chúng tôi xây dựng môi trường làm việc cởi mở, hỗ trợ lẫn nhau và tôn trọng sự khác biệt."
                        },
                        {
                            icon: <Award className="w-8 h-8 text-orange-500" />,
                            title: "Phát Triển Không Ngừng",
                            desc: "Cơ hội học hỏi công nghệ mới và thăng tiến trong sự nghiệp luôn rộng mở với bạn."
                        }
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Phúc lợi hấp dẫn</h2>
                            <div className="space-y-6">
                                {[
                                    { icon: <DollarSign className="w-5 h-5" />, text: "Mức lương cạnh tranh & Thưởng hiệu quả" },
                                    { icon: <Coffee className="w-5 h-5" />, text: "Môi trường làm việc linh hoạt (Hybrid/Remote)" },
                                    { icon: <Globe className="w-5 h-5" />, text: "Tài trợ du lịch hàng năm 5.000.000đ" },
                                    { icon: <Heart className="w-5 h-5" />, text: "Bảo hiểm sức khỏe cao cấp cho nhân viên" },
                                ].map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                            {benefit.icon}
                                        </div>
                                        <span className="text-gray-700 font-medium">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-3xl p-8 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-bold text-blue-900 mb-4">"Làm hết sức, chơi hết mình"</h3>
                                <p className="text-blue-700 italic">
                                    Chúng tôi tin rằng những ý tưởng tuyệt vời nhất thường đến khi bạn thoải mái và hạnh phúc nhất.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Open Positions Section */}
            <div id="positions" className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Vị trí đang tuyển dụng</h2>
                <div className="space-y-4">
                    {positions.map((job) => (
                        <div key={job.id} className="bg-white border hover:border-blue-300 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between transition-colors shadow-sm cursor-pointer group">
                            <div className="mb-4 md:mb-0 text-center md:text-left">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{job.title}</h3>
                                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{job.department}</span>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                Ứng tuyển ngay <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">Không tìm thấy vị trí phù hợp?</p>
                    <a href="mailto:careers@jurni.vn" className="text-orange-600 font-bold hover:underline">
                        Gửi CV cho chúng tôi qua email
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CareersPage;
