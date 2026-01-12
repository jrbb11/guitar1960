import { SEO } from '../components/common/SEO';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="About Us"
        description="Learn about Guitar1960's legacy. A tradition of quality apparel since 1960, founded by Mr. Choa Bengtong."
      />
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">About Guitar1960</h1>
          <p className="text-xl text-center mt-4 text-gray-300">A Legacy of Quality Since 1960</p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Quote and Images */}
              <div>
                <div className="border-2 border-gray-900 p-6 mb-6 text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    Guitar is the brand that synonymous with quality.
                  </p>
                </div>

                <div className="space-y-6">
                  <img
                    src="/images/about/about1.png"
                    alt="Guitar1960 Factory Building"
                    className="w-full h-auto"
                  />
                  <img
                    src="/images/about/about3.png"
                    alt="Guitar1960 Workers"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Right Column - Image and History */}
              <div>
                <img
                  src="/images/about/about2.png"
                  alt="Guitar1960 Manufacturing"
                  className="w-full h-auto mb-8"
                />

                <h2 className="text-3xl font-bold text-center mb-8 uppercase tracking-wide">A Brief History</h2>

                <div className="space-y-6 text-justify">
                  <p className="text-gray-700 leading-relaxed">
                    Established in 1960 by the late Mr. Choa Bengtong, this tradition has been passed on to the new generation who incorporates the strict adherence to quality while injecting vibrant and innovative ideas to their product lines.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    What began as a small business venture became one of the most enduring products still preferred even by second and third generation whose father wore this brand of shirts.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    The company's classic t-shirt is still the favourite casuals and is considered as a must wear for all generations popularized by Hollywood legends during the 1950's. It transcended its status from a mere undergarment to a necessity like denim jeans which is being paired with almost anything.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 bg-white border-t border-b border-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left Column - Large Title */}
              <div className="flex items-center justify-center">
                <h2 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
                  VISION &<br />MISSION
                </h2>
              </div>

              {/* Right Column - Vision, Mission, and Logo */}
              <div className="space-y-8">
                {/* Vision */}
                <div>
                  <div className="inline-block bg-gray-700 text-white px-8 py-2 rounded-full mb-4">
                    <span className="font-semibold">Vision</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Guitar aims to become a domestic leader in Philippine textile industry. It aims to achieve customer satisfaction through quality garments, fast and accurate deliveries with competitive cost and excellence in service. It also aims to make Guitar a household name that will be recognized for generations and will instill a sense of pride and inspiration to the Filipino people.
                  </p>
                </div>

                {/* Logo in center */}
                <div className="flex justify-center py-6">
                  <img
                    src="/images/logo/guitar logo.png"
                    alt="Guitar Apparel Est 1960"
                    className="h-24 w-auto"
                  />
                </div>

                {/* Mission */}
                <div>
                  <div className="inline-block bg-gray-700 text-white px-8 py-2 rounded-full mb-4">
                    <span className="font-semibold">Mission</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Guitar Apparel's mission is to design a distinct comfort and lifestyle driven by superior quality products at par with global standards. It also committed to achieve excellence in marketing, advertising and product innovation by continuously improving its core business functions. It aims to further develop and be more progressive in its value of customer's service, social responsibility and fair business ethics in all aspects of operation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Line Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left Column - Product Collage Image */}
              <div className="relative w-full">
                <img
                  src="/images/products/Collage.jpg"
                  alt="Guitar Product Line"
                  className="w-full h-auto"
                />
              </div>

              {/* Right Column - Product Line List */}
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-900 uppercase">
                  Product Line
                </h2>
                <ul className="space-y-4 text-xl">
                  <li className="flex items-start">
                    <span className="mr-3 text-gray-900 font-bold">•</span>
                    <span className="font-serif text-gray-800">DE HIILO SERIES</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-gray-900 font-bold">•</span>
                    <span className="font-serif text-gray-800">800 SERIES</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-gray-900 font-bold">•</span>
                    <span className="font-serif text-gray-800">900 SERIES</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-gray-900 font-bold">•</span>
                    <span className="font-serif text-gray-800">UNDERWEAR SERIES</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-gray-900 font-bold">•</span>
                    <span className="font-serif text-gray-800">UNIFORMS</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's New Section */}
      <section className="py-16 bg-white border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase">
              What's New in Guitar?
            </h2>
            <div className="flex justify-center">
              <img
                src="/images/products/whats-new.png"
                alt="What's New in Guitar"
                className="w-full max-w-4xl h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Ambassador Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight uppercase">
                  NEW BRAND<br />AMBASSADOR
                </h2>
                <ul className="space-y-4 text-xl">
                  <li className="flex items-start">
                    <span className="mr-3 text-gray-900 font-bold">•</span>
                    <span className="font-bold text-gray-900">LEXI GONZALES</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-gray-900 font-bold">•</span>
                    <span className="font-bold text-gray-900">KRISTOFFER MARTIN</span>
                  </li>
                </ul>
              </div>

              {/* Right Column - Image */}
              <div>
                <img
                  src="/images/about/brand-ambassador.png"
                  alt="Guitar Brand Ambassadors - Lexi Gonzales and Kristoffer Martin"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
