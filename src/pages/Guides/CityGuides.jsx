import React from 'react';
import GuideLayout from './GuideLayout.jsx';
import headerImage from '../../assets/images/guides/city-guide.png';

import beijingImg from '../../assets/images/guides/cities/beijing.png';
import shanghaiImg from '../../assets/images/guides/cities/shanghai.png';
import guangzhouImg from '../../assets/images/guides/cities/guangzhou.png';
import shenzhenImg from '../../assets/images/guides/cities/shenzhen.png';
import chengduImg from '../../assets/images/guides/cities/chengdu.png';
import wuhanImg from '../../assets/images/guides/cities/wuhan.png';
import hangzhouImg from '../../assets/images/guides/cities/hangzhou.png';
import chongqingImg from '../../assets/images/guides/cities/chongqing.png';
import nanchangImg from '../../assets/images/guides/cities/nanchang.png';
import harbinImg from '../../assets/images/guides/cities/harbin.png';
import xianImg from '../../assets/images/guides/cities/xian.png';
import hefeiImg from '../../assets/images/guides/cities/hefei.png';

const cities = [
  {
    name: 'Beijing',
    chinese: '北京',
    tagline: 'The Cultural and Political Heart',
    description: 'Home to the Great Wall and top-tier universities like Peking and Tsinghua, Beijing offers a perfect blend of ancient history and rapid modernization.',
    features: ['World Heritage sites', 'Tech Hubs', 'Hutong Culture'],
    image: beijingImg
  },
  {
    name: 'Shanghai',
    chinese: '上海',
    tagline: 'Global Financial Hub',
    description: 'A city that never sleeps. Shanghai is the epicenter of international business and finance, offering a truly cosmopolitan lifestyle for students.',
    features: ['The Bund', 'International Business', 'Fashion Capital'],
    image: shanghaiImg
  },
  {
    name: 'Guangzhou',
    chinese: '广州',
    tagline: 'The Southern Tradewinds',
    description: 'The historic starting point of the Silk Road. Known for its world-renowned cuisine and warm climate, it is a hub for trade and manufacturing.',
    features: ['Cantonese Cuisine', 'Trade Fairs', 'Modern Skyline'],
    image: guangzhouImg
  },
  {
    name: 'Shenzhen',
    chinese: '深圳',
    tagline: 'Silicon Valley of the East',
    description: "China's first special economic zone. Shenzhen is a city of young innovators and explorers, perfect for engineering and tech students.",
    features: ['Hardware Innovation', 'Green Parks', 'Modernity'],
    image: shenzhenImg
  },
  {
    name: 'Chengdu',
    chinese: '成都',
    tagline: 'The Land of Abundance',
    description: 'Home of the Giant Pandas. Chengdu offers a relaxed lifestyle mixed with a booming tech and fashion scene.',
    features: ['Panda Base', 'Spicy Hotpot', 'Tea Cultures'],
    image: chengduImg
  },
  {
    name: 'Wuhan',
    chinese: '武汉',
    tagline: 'Metropolis of the Nine Provinces',
    description: 'A major education hub with one of the largest student populations in the world, sitting on the Yangtze River.',
    features: ['Wuhan University', 'Cherry Blossoms', 'Yellow Crane Tower'],
    image: wuhanImg
  },
  {
    name: 'Hangzhou',
    chinese: '杭州',
    tagline: 'Paradise on Earth',
    description: 'Headquarters of Alibaba. Hangzhou combines breathtaking natural beauty with high-tech digital innovation.',
    features: ['West Lake', 'Digital Economy', 'Tech Startups'],
    image: hangzhouImg
  },
  {
    name: 'Chongqing',
    chinese: '重庆',
    tagline: 'The Mountain City',
    description: 'A sprawling 3D metropolis famous for its futuristic terrain, misty mountains, and vibrant night life.',
    features: ['Cyberpunk Aesthetic', 'Spicy Cuisine', 'Yangtze Cruises'],
    image: chongqingImg
  },
  {
    name: 'Nanchang',
    chinese: '南昌',
    tagline: 'The Hero City',
    description: 'Capital of Jiangxi Province, rich in revolutionary history and natural beauty near the Poyang Lake.',
    features: ['Pavilion of Prince Teng', 'History', 'Affordability'],
    image: nanchangImg
  },
  {
    name: 'Harbin',
    chinese: '哈尔滨',
    tagline: 'The Ice City',
    description: 'Influenced by Russian architecture and famous worldwide for its spectacular Ice and Snow festival.',
    features: ['Ice Festival', 'Saint Sophia', 'Snow Sports'],
    image: harbinImg
  },
  {
    name: 'Xi\'an',
    chinese: '西安',
    tagline: 'Ancient Capital',
    description: 'The starting point of the Silk Road and home to the Terracotta Warriors. Xi’an is a living history book.',
    features: ['Terracotta Army', 'Muslim Quarter', 'City Wall'],
    image: xianImg
  },
  {
    name: 'Hefei',
    chinese: '合肥',
    tagline: 'Science and Technology City',
    description: 'An emerging innovation hub and home to the University of Science and Technology of China (USTC).',
    features: ['Research & R&D', 'Affordable Living', 'USTC'],
    image: hefeiImg
  }
];

const CityGuides = () => {
  return (
    <GuideLayout 
      title="Chinese City Guides"
      subtitle="Discover your future home. From the imperial grandeur of Beijing to the neon-lit streets of Shanghai, find the city that matches your ambition."
      image={headerImage}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {cities.map((city) => (
          <div key={city.name} className="group flex flex-col bg-gray-50 rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500">
            <div className="h-72 overflow-hidden relative">
              <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl flex flex-col items-center shadow-lg border border-white/20">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{city.chinese}</span>
                <span className="text-xl font-bold text-gray-900 leading-none mt-1">{city.name}</span>
              </div>
            </div>
            <div className="p-10 flex-1">
              <span className="text-orange-600 font-black uppercase tracking-widest text-[9px] mb-2 block">{city.tagline}</span>
              <p className="text-gray-600 leading-relaxed mb-8 flex-1">
                {city.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                {city.features.map(f => (
                  <span key={f} className="px-3 py-1 bg-white text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-gray-100">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GuideLayout>
  );
};

export default CityGuides;
