"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, TrendingUp, Calendar, Trophy, Zap, DollarSign } from 'lucide-react';
import Navbar from '@/components/navbar';

export default function TestedBetPrompts() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const testedBets = [
    {
      category: "Price Predictions",
      icon: <TrendingUp className="h-5 w-5" />,
      bets: [
        "@funnyorfud @alice I bet you 0.1 ETH that Bitcoin will be above $100,000 by January 31, 2025",
        "@funnyorfud @bob I bet you 0.05 ETH that NEAR token will increase by 20% within 7 days from now",
        "@funnyorfud @charlie I bet you 0.2 ETH that Ethereum will reach $5,000 before March 1, 2025",
        "@funnyorfud @dave I bet you 0.08 ETH that Solana will outperform Bitcoin in the next 30 days"
      ]
    },
    {
      category: "Sports Events",
      icon: <Trophy className="h-5 w-5" />,
      bets: [
        "@funnyorfud @eve I bet you 0.15 ETH that the Lakers will beat the Warriors in their next matchup",
        "@funnyorfud @frank I bet you 0.1 ETH that Messi will score in Argentina's next World Cup qualifier",
        "@funnyorfud @grace I bet you 0.12 ETH that the Chiefs will win the Super Bowl 2025",
        "@funnyorfud @henry I bet you 0.07 ETH that Djokovic will win his next Grand Slam match"
      ]
    },
    {
      category: "Market Events",
      icon: <DollarSign className="h-5 w-5" />,
      bets: [
        "@funnyorfud @iris I bet you 0.2 ETH that the S&P 500 will close above 6000 by February 28, 2025",
        "@funnyorfud @jack I bet you 0.09 ETH that Tesla stock will hit $300 within the next 2 weeks",
        "@funnyorfud @kate I bet you 0.11 ETH that Gold will reach $2,200/oz before April 1, 2025",
        "@funnyorfud @leo I bet you 0.06 ETH that oil prices will be below $60/barrel by end of March"
      ]
    },
    {
      category: "Tech & Innovation",
      icon: <Zap className="h-5 w-5" />,
      bets: [
        "@funnyorfud @maya I bet you 0.13 ETH that OpenAI will release GPT-5 before July 2025",
        "@funnyorfud @nick I bet you 0.08 ETH that Apple will announce a foldable iPhone in 2025",
        "@funnyorfud @olivia I bet you 0.16 ETH that Twitter/X will have more than 1 billion active users by December 2025",
        "@funnyorfud @paul I bet you 0.04 ETH that SpaceX will successfully land on Mars within 18 months"
      ]
    },
    {
      category: "Weather & Events",
      icon: <Calendar className="h-5 w-5" />,
      bets: [
        "@funnyorfud @quinn I bet you 0.07 ETH that it will snow in New York City before February 15, 2025",
        "@funnyorfud @ruby I bet you 0.14 ETH that there will be more than 15 named hurricanes in the 2025 Atlantic season",
        "@funnyorfud @sam I bet you 0.05 ETH that the next volcanic eruption will occur in Iceland within 6 months",
        "@funnyorfud @tina I bet you 0.09 ETH that a magnitude 7+ earthquake will hit the Pacific Ring of Fire by August 2025"
      ]
    }
  ];

  const allBets = testedBets.flatMap(category => 
    category.bets.map(bet => ({ ...category, bet }))
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testedBets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testedBets.length) % testedBets.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Battle-Tested Bet Formats
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            These are the proven prompts that work flawlessly with our AI system. 
            Use these formats to ensure crystal-clear terms and automatic resolution.
          </p>
          
          {/* Important Note */}
          <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-amber-800/50 rounded-lg p-6 mb-12">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                  Format Your Bets Like These Examples
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  To ensure successful automatic resolution, structure your bets with these key elements: 
                  <span className="text-purple-400 font-medium"> specific conditions</span>, 
                  <span className="text-purple-400 font-medium"> clear deadlines</span>, 
                  <span className="text-purple-400 font-medium"> measurable outcomes</span>, and 
                  <span className="text-purple-400 font-medium"> exact stake amounts</span>. 
                  Avoid vague terms like "soon," "might," or "probably."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Slider */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-zinc-100">
            Featured Bet Categories
          </h2>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-xl">
              <div 
                ref={sliderRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testedBets.map((category, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-8 h-96">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-purple-900/30 rounded-full text-purple-400">
                          {category.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100">
                          {category.category}
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        {category.bets.slice(0, 3).map((bet, betIndex) => (
                          <div key={betIndex} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                            <p className="text-sm text-zinc-300 leading-relaxed">
                              {bet}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <span className="text-xs text-zinc-500">
                          {category.bets.length} tested formats in this category
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-600 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-600 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {testedBets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-purple-400' : 'bg-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Complete List */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-zinc-100">
            Complete List of Tested Prompts
          </h2>
          
          <div className="max-w-5xl mx-auto">
            {testedBets.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-100">
                    {category.category}
                  </h3>
                  <div className="flex-1 h-px bg-zinc-800"></div>
                  <span className="text-sm text-zinc-500">
                    {category.bets.length} prompts
                  </span>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {category.bets.map((bet, betIndex) => (
                    <div key={betIndex} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 hover:bg-zinc-900/70 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-purple-400">
                            {betIndex + 1}
                          </span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-sm">
                          {bet}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 py-12 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-800/30">
          <h2 className="text-3xl font-bold mb-4 text-zinc-100">
            Ready to Create Your Own Bet?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Use these proven formats as templates for your own bets. Remember: be specific, set clear deadlines, and choose measurable outcomes.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Launch Smol Bets App
          </button>
        </section>
      </main>
    </div>
  );
}