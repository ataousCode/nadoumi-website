import React from 'react';

function CampusGallery({ images = [] }) {
  const validImages = Array.isArray(images) ? images.filter(img => {
    const url = typeof img === 'string' ? img : img?.url;
    return !!url;
  }) : [];

  if (validImages.length === 0) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-gray-900 tracking-tight">
        Campus <span className="text-orange-600">Life</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {validImages.map((img, idx) => {
          const url = typeof img === 'string' ? img : img.url;
          const title = typeof img === 'string' ? `Campus Image #${idx + 1}` : (img.title || `Gallery #${idx + 1}`);
          
          if (!url) return null;

          return (
            <div 
              key={idx} 
              className="group relative h-72 rounded-[32px] overflow-hidden cursor-zoom-in"
            >
              <img 
                src={url} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <div className="bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl w-full">
                  <p className="text-white text-xs font-black uppercase tracking-widest truncate">{title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CampusGallery;
