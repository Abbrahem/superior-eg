import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'Message Sent!',
      text: 'Thank you for contacting us, we will reply as soon as possible',
      icon: 'success',
      background: '#1f1f1f',
      color: '#ffffff'
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">Contact Us</h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're here to answer all your questions and help you anytime
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Form */}
          <div className="bg-gray-900 rounded-lg p-6 sm:p-8 lg:p-10 order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 text-sm sm:text-base"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 text-sm sm:text-base"
                />
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base"
                >
                  <option value="">Select Subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Inquiry</option>
                  <option value="return">Return or Exchange</option>
                  <option value="complaint">Complaint</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <textarea
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 text-sm sm:text-base"
              />
              
              <button
                type="submit"
                className="w-full bg-white text-black py-3 sm:py-4 rounded font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            <div className="bg-gray-900 rounded-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Contact Information</h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl mr-3 sm:mr-4 mt-1">📍</div>
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Address</h4>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Cairo, Egypt<br />
                      Tahrir Street, Downtown
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl mr-3 sm:mr-4 mt-1">📞</div>
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Phone</h4>
                    <p className="text-gray-300 text-sm sm:text-base">
                      +20 100 123 4567<br />
                      +20 111 987 6543
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl mr-3 sm:mr-4 mt-1">✉️</div>
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Email</h4>
                    <p className="text-gray-300 text-sm sm:text-base">
                      info@superior.eg<br />
                      support@superior.eg
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl mr-3 sm:mr-4 mt-1">🕒</div>
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Working Hours</h4>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Saturday - Thursday: 9:00 AM - 10:00 PM<br />
                      Friday: 2:00 PM - 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-900 rounded-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">FAQ</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">How long does delivery take?</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Cairo & Giza: 1-2 business days<br />
                    Other governorates: 3-5 business days
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Can I return products?</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Yes, you can return products within 14 days of delivery
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">What payment methods are available?</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Cash on delivery, Visa, Mastercard, Vodafone Cash
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-900 rounded-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Follow Us</h3>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <a 
                  href="https://www.instagram.com/superior.eg?igsh=YWV2MDZ5Z2hveGx1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base text-center"
                >
                  Instagram
                </a>
                <a 
                  href="https://wa.me/201092045566" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white py-2 sm:py-3 rounded font-semibold hover:bg-green-600 transition-colors text-sm sm:text-base text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;