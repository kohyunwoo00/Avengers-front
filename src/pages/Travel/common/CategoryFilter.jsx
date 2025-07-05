function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.name)} // 이게 제대로 된 이름이어야 함
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.name
              ? "text-white bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)] shadow-md"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
