
const About = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Hero Section */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">About SUPERIOR.EG</h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        We are an Egyptian brand dedicated to delivering premium streetwear with exceptional quality and accessible pricing
                    </p>
                </div>

                {/* Story Section */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Our Story</h2>
                        <p className="text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                            SUPERIOR.EG started as a simple dream to create modern streetwear that reflects the personality of Egyptian youth.
                            We believe that fashion isn't just clothing, but an expression of identity and self-confidence.
                        </p>
                        <p className="text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                            From the beginning, we focused on quality and distinctive design. Every piece we create goes through
                            precise stages of design and production to ensure the best results.
                        </p>
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                            Today, we're proud to be one of the leading brands in Egypt,
                            constantly striving to develop our products and services to meet our customers' expectations.
                        </p>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-6 sm:p-8 order-1 lg:order-2">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Our Vision</h3>
                        <ul className="space-y-3 sm:space-y-4">
                            <li className="flex items-start">
                                <span className="text-white font-bold mr-3 text-lg">•</span>
                                <span className="text-gray-300 text-base sm:text-lg">Deliver modern clothing with international quality</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-white font-bold mr-3 text-lg">•</span>
                                <span className="text-gray-300 text-base sm:text-lg">Support local Egyptian industry</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-white font-bold mr-3 text-lg">•</span>
                                <span className="text-gray-300 text-base sm:text-lg">Sustainability in production and manufacturing</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-white font-bold mr-3 text-lg">•</span>
                                <span className="text-gray-300 text-base sm:text-lg">Outstanding customer service</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Values Section */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
                    <div className="text-center bg-gray-900 rounded-lg p-6 sm:p-8 hover:bg-gray-800 transition-colors">
                        <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">🎯</div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Quality</h3>
                        <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                            We use the finest materials and techniques to ensure the quality of our products
                        </p>
                    </div>

                    <div className="text-center bg-gray-900 rounded-lg p-6 sm:p-8 hover:bg-gray-800 transition-colors">
                        <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">⚡</div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Speed</h3>
                        <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                            Fast delivery and 24/7 customer service availability
                        </p>
                    </div>

                    <div className="text-center bg-gray-900 rounded-lg p-6 sm:p-8 hover:bg-gray-800 transition-colors sm:col-span-2 lg:col-span-1">
                        <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">💎</div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Excellence</h3>
                        <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                            Unique designs that keep up with the latest global fashion trends
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Our Team</h2>
                    <p className="text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 text-base sm:text-lg lg:text-xl leading-relaxed px-4">
                        Our team consists of a group of creatives and specialists in fashion and design,
                        working together to achieve our vision of delivering the best products to our customers.
                    </p>

                    <div className="bg-gray-900 rounded-lg p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">Join the SUPERIOR.EG Family</h3>
                        <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                            Follow us on social media and discover the latest collections and exclusive offers
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                            <a 
                                href="https://www.instagram.com/superior.eg?igsh=YWV2MDZ5Z2hveGx1" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-gray-200 transition-colors text-sm sm:text-base font-semibold"
                            >
                                Instagram
                            </a>
                            <a 
                                href="https://wa.me/201092045566" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-gray-200 transition-colors text-sm sm:text-base font-semibold"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;