function FacilityList({ facilities = [], max = 2 }) {
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {facilities.slice(0, max).map((facility, idx) => (
        <span
          key={idx}
          className="bg-blue-50 text-blue-400 text-xs px-2 py-1 rounded"
        >
          {facility}
        </span>
      ))}
      {facilities.length > max && (
        <span className="text-xs text-gray-500">
          +{facilities.length - max}
        </span>
      )}
    </div>
  );
}
export default FacilityList;
