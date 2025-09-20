// "use client";
// import React from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";

// const testimonials = [
//   {
//     text: "It is an awesome program that makes one to focus on learning industry standard Blockchain Development, without having to worry about basic amenities. I had an awesome experience during the cohort V.",
//     name: "John Odey",
//     role: "Blockchain Developer - Netherminds",
//   },
//   {
//     text: "The mentorship and guidance were top-notch. I got hands-on experience and learned how to work on real-world blockchain projects.",
//     name: "Sarah Lee",
//     role: "Smart Contract Engineer - ConsenSys",
//   },
//   {
//     text: "The community is amazing. I made lifelong friends while leveling up my skills in blockchain development.",
//     name: "Michael Chen",
//     role: "Blockchain Architect - Polygon",
//   },
//   {
//     text: "This program gave me the confidence to work in blockchain professionally. The environment is very supportive.",
//     name: "Aisha Bello",
//     role: "Solidity Developer - Chainlink Labs",
//   },
// ];

// export default function TestimonialSlider() {
//   const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
//     Autoplay({ delay: 4000, stopOnInteraction: false }),
//   ]);

//   return (
//     <div className="w-full overflow-hidden  pb-20" ref={emblaRef}>
//       <div className="flex">
//         {testimonials.map((t, i) => (
//           <div
//             key={i}
//             className="flex-[0_0_90%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] p-4"
//           >
//             <div className="h-full rounded-xl border border-neutral-800 bg-black/40 p-6 shadow-lg backdrop-blur-sm transition hover:shadow-xl hover:border-neutral-600">
//               <p className="text-neutral-300 leading-relaxed mb-4">{t.text}</p>
//               <h4 className="font-semibold text-white">{t.name}</h4>
//               <p className="text-sm text-neutral-400">{t.role}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";
import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

const testimonials = [
  {
    quote:
      "Custos has revolutionized how we handle our legal agreements. The blockchain integration gives us peace of mind.",
    name: "Sarah Johnson",
    title: "Legal Tech Consultant",
  },
  {
    quote:
      "The AI lawyer feature is groundbreaking. It's like having a legal expert available 24/7.",
    name: "Michael Chen",
    title: "Startup Founder",
  },
  {
    quote:
      "Crime recording on blockchain is exactly what our community needed. Transparency and security in one platform.",
    name: "David Williams",
    title: "Community Safety Advocate",
  },
  {
    quote:
      "Smart contract integration for agreements is brilliant. It's made our business processes so much more efficient.",
    name: "Amanda Rodriguez",
    title: "Business Operations Director",
  },
  {
    quote:
      "The platform's user experience is exceptional. Even complex legal processes feel straightforward.",
    name: "James Mitchell",
    title: "Digital Innovation Lead",
  },
];

export function InfiniteMovingCardsDemo() {
  return (
    <div className="pb-20 rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden ">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        pauseOnHover={true}
      />
    </div>
  );
}
