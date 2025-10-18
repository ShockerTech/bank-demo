import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: '🔐',
      title: 'Secure Banking',
      description: 'Bank-grade security with JWT authentication and encrypted transactions'
    },
    {
      icon: '⚡',
      title: 'Instant Transfers',
      description: 'Send money instantly to anyone, anytime, anywhere'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Bank on the go with our responsive platform'
    },
    {
      icon: '💳',
      title: 'Multiple Accounts',
      description: 'Checking, savings, and business accounts all in one place'
    },
    {
      icon: '📊',
      title: 'Real-time Updates',
      description: 'Track your finances with live balance updates'
    },
    {
      icon: '🎯',
      title: 'Easy Management',
      description: 'Intuitive dashboard for effortless money management'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content: 'DemoBank has transformed how I manage my business finances. The interface is intuitive and transfers are instant!',
      rating: 5,
      image: '/images/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Freelancer',
      content: 'Finally, a banking platform that understands modern needs. Love the mobile experience!',
      rating: 5,
      image: '/images/michael.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Tech Entrepreneur',
      content: 'Security and speed combined. DemoBank is exactly what I needed for my growing startup.',
      rating: 5,
      image: '/images/emily.jpg'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '$2B+', label: 'Transferred' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        ></div>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                 Demo Application 
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Banking Made
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Simple</span>
              </h1>
              <p className="text-xl text-gray-600">
                Experience the future of digital banking. Secure, fast, and built for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg">
                  Create Free Account
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600">
                  Sign In
                </button>
              </div>
             <div className="flex items-center space-x-6 pt-4">
            <div className="flex -space-x-2">
              {[
               "/images/user2.jpg",  
               "/images/user3.jpg",  
               "/images/user1.jpg",  
               "/images/user4.jpg"   
              ].map((src, i) => (
              <img 
               key={i}
               src={`${src}?${i}`}  // Add cache buster to get different images
               alt="DemoBank user"
               className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
               onError={(e) => {
          // Fallback to gradient if image fails to load
          e.target.style.display = 'none';
          e.target.outerHTML = `<div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white"></div>`;
        }}
      />
    ))}
  </div>
  <div className="text-sm text-gray-600">
    <span className="font-bold text-gray-900">50,000+</span> users trust DemoBank
  </div>
</div>
            </div>

            {/* Hero Illustration */}
            <div className="relative" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              <div className="relative">
                {/* Floating Card 1 */}
                <div className="absolute top-0 right-0 bg-white p-6 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transfer Complete</p>
                      <p className="font-bold text-gray-900">$1,250.00</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">To: John's Savings</div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-10 left-0 bg-white p-6 rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-300">
                  <div className="text-sm text-gray-600 mb-2">Account Balance</div>
                  <div className="text-3xl font-bold text-gray-900 mb-3">$24,500</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <span>↑ 12.5%</span>
                    <span className="ml-2">this month</span>
                  </div>
                </div>

                {/* Main Card */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl shadow-2xl text-white transform hover:scale-105 transition-all duration-300 mt-20">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-blue-100 text-sm mb-2">CHECKING ACCOUNT</p>
                      <p className="text-3xl font-bold">$15,750.00</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-100">Account Number</span>
                      <span>•••• 4829</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-100">Valid Thru</span>
                      <span>12/25</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-blue-600 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to manage your money with ease
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to better banking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up with your email in less than 2 minutes' },
              { step: '2', title: 'Add Accounts', desc: 'Create checking, savings, or business accounts' },
              { step: '3', title: 'Start Banking', desc: 'Transfer money, track transactions, and more' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 relative bg-gray-50">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: 'url(/images/testimonial-bg.jpg)' }}
        ></div>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
              <div className="flex mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xl text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </p>
              <div className="flex items-center">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Testimonial Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users managing their finances smarter
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg text-lg"
          >
            Create Your Free Account
          </button>
          <p className="mt-4 text-blue-100 text-sm">
            No credit card required • Takes less than 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <img 
                  src="\images\logo.png" 
                  alt="DemoBank Logo" 
                  className="w-full h-full object-contain"
               />
                </div>
                <span className="text-xl font-bold text-white">DemoBank</span>
              </div>
              <p className="text-sm">
                Modern banking made simple, secure, and accessible for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Demo Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 DemoBank.</p>
            <p><a href='https://x.com/aoluwashocker?s=21&t=mxYGUH-ukPB9gtQaqidaeA' target='blank' rel='noopener noreferrer'>Designed by ShockerTech</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;