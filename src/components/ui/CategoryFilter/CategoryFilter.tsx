import type { Category } from "../../../types";

import SelectField from "../SelectField/SelectField";

import "./CategoryFilter.css";

interface CategoryFilterProps {
  categories: Category[];
  value: number | "";
  onChange: (categoryId: number | "") => void;
}

function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <SelectField
        id="category-filter"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      >
        <option value="">Todas as categorias</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </SelectField>
    </div>
  );
}

export default CategoryFilter;
