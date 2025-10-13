'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function CountryGallery({ images }: { images: string[] }) {
  const gallery = Array.isArray(images) && images.length > 0 ? images : [
    '/images/gallery/booth1.jpg',
    '/images/gallery/booth2.jpg',
    '/images/gallery/booth3.jpg',
    '/images/gallery/booth4.jpg',
    '/images/gallery/booth5.jpg',
  ];

  return (
    <section className="w-full py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Exhibition Booth Highlights</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {gallery.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="overflow-hidden rounded-2xl shadow-lg h-[260px]">
              <img
                src={src}
                alt={`Exhibition booth ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .swiper-button-prev, .swiper-button-next { color: #e11d74; transition: color .3s ease; }
        .swiper-button-prev:hover, .swiper-button-next:hover { color: #f1558e; }
      `}</style>
    </section>
  );
}


