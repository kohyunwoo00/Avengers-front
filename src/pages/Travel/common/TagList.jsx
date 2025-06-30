function TagList({ tags = [], max = 3 }) {
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {tags.slice(0, max).map((tag, idx) => (
        <span
          key={idx}
          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
export default TagList;
