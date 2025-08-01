export default function HeroSection() {
  return (
    <section className="relative py-32 px-6 text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="absolute w-96 h-96 -top-20 -left-20">
          <path
            fill="#fff"
            d="M56.4,-60.6C71.6,-49.2,82.8,-29.5,82.7,-10.1C82.7,9.2,71.5,28.4,56.3,43.3C41.1,58.2,21.6,68.8,2.3,67.1C-17.1,65.4,-34.2,51.3,-49.6,36.2C-65,21.2,-78.7,5.2,-78.1,-11.2C-77.4,-27.6,-62.4,-44.4,-45.3,-56C-28.2,-67.6,-14.1,-74.1,3.4,-78.1C20.9,-82.1,41.7,-83.3,56.4,-60.6Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Main heading */}
        <h1 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Connect. Collaborate. Create.
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          DevConnect is a hub for developers to showcase their work, write blogs, and connect with like-minded tech enthusiasts.
        </p>

        {/* CTA Button */}
        <a
          href="/register"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
        >
          🚀 Join Now
        </a>
      </div>
    </section>
  );
}
