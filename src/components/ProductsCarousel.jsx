import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import homeLoan from "../assets/Home Loan Icon.svg";
import businessLoan from "../assets/Krakenimages Unsplash 1.svg";
import educationLoan from "../assets/Img4 1.svg";

const products = [
  { img: homeLoan, title: "Home Loan" },
  { img: businessLoan, title: "Business Loan" },
  { img: educationLoan, title: "Education Loan" },
  { img: homeLoan, title: "Home Loan" },
  { img: businessLoan, title: "Business Loan" },
  { img: educationLoan, title: "Education Loan" },
  { img: homeLoan, title: "Home Loan" },
  { img: businessLoan, title: "Business Loan" },
  { img: educationLoan, title: "Education Loan" },
  { img: homeLoan, title: "Home Loan" },
  { img: businessLoan, title: "Business Loan" },
  { img: educationLoan, title: "Education Loan" },
];

const ProductsCarousel = () => {
  return (
    <div className="mt-[4rem] mx-auto text-center w-full px-4" id="products">
      <h2 className="text-[1.4rem] md:text-[1.8rem]">Explore Our Products</h2>
      <div className="m-4">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true} // Enables infinite scrolling
          speed={6000} // Smooth sliding speed
          autoplay={{
            delay: 0, // Continuous sliding without pauses
            disableOnInteraction: false, // Keeps autoplay running on user interaction
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index} className="text-center">
              <img src={product.img} alt={product.title} className="w-full" />
              <h2 className="mt-2">{product.title}</h2>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductsCarousel;
