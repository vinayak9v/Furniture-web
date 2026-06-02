import React from 'react';

// Reusable component for the Reels-sized video cards
const VideoCard = ({ title, subtitle, videoSrc }) => {
  return (
    <div
      className="relative w-full max-w-[280px] aspect-[9/16] rounded-xl overflow-hidden cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Background Video with Autoplay */}
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 z-10 pointer-events-none"></div>

      {/* Play Button Icon (Optional: I commented this out since the video is autoplaying. Uncomment if you still want to show it) */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] border-2 border-white rounded-full bg-black/40 flex justify-center items-center z-20 pointer-events-none">
        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[15px] border-l-white ml-1"></div>
      </div> 
      */}

      {/* Card Text */}
      <div className="absolute bottom-6 inset-x-0 text-center text-white z-20 px-4 pointer-events-none">
        <h3 className="m-0 mb-1 text-[18px] font-semibold leading-tight">{title}</h3>
        <p className="m-0 text-[13px] font-light opacity-90">{subtitle}</p>
      </div>
    </div>
  );
};

// Main Page Component
export default function InspirationSection() {
  const videoData = [
    {
      id: 1,
      title: "Modern Living Room Ideas",
      subtitle: "Luxury & Comfort",
      // Dummy working video link
      videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", 
    },
    {
      id: 2,
      title: "Space Saving Dining Ideas",
      subtitle: "Stylish & Functional",
      videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 3,
      title: "Bedroom Makeover Ideas",
      subtitle: "Cozy & Elegant",
      videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-5 font-sans">
      <section className="max-w-[1000px] mx-auto">
        
        {/* Header with horizontal lines */}
        <div className="relative text-center mb-[40px]">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#ccc] z-0"></div>
          <h2 className="relative z-10 inline-block px-5 bg-[#fcfcfc] font-serif text-2xl text-[#333] m-0">
            WATCH & GET INSPIRED
          </h2>
        </div>

        {/* Row-wise Layout Container */}
        <div className="flex flex-row flex-wrap justify-center gap-6">
          {videoData.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              subtitle={video.subtitle}
              videoSrc={video.videoSrc}
            />
          ))}
        </div>

      </section>
    </div>
  );
}