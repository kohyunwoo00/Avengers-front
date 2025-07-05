import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TagList from "./TagList";
import FacilityList from "./FacilityList";

function SliderSection({ items = [], title }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % items.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {items.map((item) => {
              const tags =
                item.tagListForView?.map((t) => t.tagName) ??
                item.themaListForView?.map((t) => t.themaName) ??
                [];
              const facilities =
                item.optionListForView?.map((o) => o.optionName) ?? [];

              return (
                <div key={item.travelNo} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden mx-2 md:flex">
                    <img
                      src={item.imageList?.[0]?.imageUrl || "/placeholder.jpg"}
                      alt={item.title}
                      className="w-full md:w-1/2 h-64 md:h-80 object-cover"
                    />
                    <div className="md:w-1/2 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          운영 중
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {item.rating || "0.0"}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{item.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">상시 운영</span>
                      </div>
                      <TagList tags={tags} />
                      <FacilityList facilities={facilities} />
                      <button
                        onClick={() =>
                          navigate(`/travels/detail/${item.travelNo}`)
                        }
                        className="w-full bg-gradient-to-r from-[#73b3df] via-[#61a0d4] to-[#76d9e4] text-white py-2 rounded-md hover:opacity-90 active:scale-95 transition-all text-sm font-medium"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>

        <div className="flex justify-center mt-4 gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === currentSlide ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SliderSection;
