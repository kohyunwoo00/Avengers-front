import { MapPin, Star, Heart, Share2 } from "lucide-react";
import TagList from "./TagList";
import FacilityList from "./FacilityList";
import { useNavigate } from "react-router-dom";
import BookMark from "./BookMark";
import { AuthContext } from "../../../components/Context/AuthContext";

function DestinationGrid({ destinations }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {destinations.map((dest) => {
        const id = dest.travelNo;
        const imageUrl = dest.imageList?.[0]?.imageUrl || "/placeholder.svg";
        const category = dest.categoryName || "기타";
        const location = dest.address || dest.guName || "미정";
        const rating = dest.rating?.toFixed(1) || "0.0";
        const tags =
          dest.tagListForView?.map((t) => t.tagName || t.themaName) || [];
        const facilities =
          dest.optionListForView?.map((o) => o.optionName) || [];

        return (
          <div
            key={id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={imageUrl}
                alt={dest.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-blue-400 text-white text-xs px-2 py-1 rounded">
                  {category}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                <span className="inline-block bg-blue-50 text-blue-400 border border-blue-200 text-sm px-3 py-1 rounded-full font-medium">
                  조회수 : {dest.viewCount}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2">{dest.title}</h3>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{location}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
              <TagList tags={tags} />
              <FacilityList facilities={facilities} />
              <button
                onClick={() => navigate(`/travels/detail/${id}`)}
                className="w-full bg-gradient-to-r from-[#73b3df] via-[#61a0d4] to-[#76d9e4] text-white py-2 rounded-md hover:opacity-90 active:scale-95 transition-all text-sm font-medium"
              >
                상세보기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DestinationGrid;
