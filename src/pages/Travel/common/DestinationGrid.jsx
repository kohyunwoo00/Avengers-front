import { MapPin, Star, Heart, Share2 } from "lucide-react";
import TagList from "./TagList";
import FacilityList from "./FacilityList";
import { useNavigate } from "react-router-dom";

function DestinationGrid({ destinations, favorites, toggleFavorite }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {destinations.map((dest) => (
        <div
          key={dest.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative">
            <img
              src={dest.image || "/placeholder.svg"}
              alt={dest.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                {dest.category}
              </span>
            </div>
            <div className="absolute top-3 right-3 flex gap-1">
              <button
                onClick={() => toggleFavorite(dest.id)}
                className={`p-1.5 rounded-full transition-colors ${
                  favorites.has(dest.id)
                    ? "bg-red-500 text-white"
                    : "bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100"
                }`}
              >
                <Heart className="h-4 w-4" />
              </button>
              <button className="p-1.5 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-800 mb-2">{dest.title}</h3>
            <div className="flex items-center gap-1 text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{dest.location}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{dest.rating}</span>
                <span className="text-xs text-gray-500">({dest.reviews})</span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {dest.price}
              </span>
            </div>
            <TagList tags={dest.tags} />
            <FacilityList facilities={dest.facilities} />
            <button
              onClick={() => navigate(`/travels/detail/${dest.id}`)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              상세보기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default DestinationGrid;
