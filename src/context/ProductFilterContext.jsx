import { createContext, useContext, useState } from "react";

const ProductFilterContext = createContext();

export function ProductFilterProvider({ children }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua Kategori");

  return (
    <ProductFilterContext.Provider
      value={{ search, setSearch, category, setCategory }}
    >
      {children}
    </ProductFilterContext.Provider>
  );
}

export function useProductFilter() {
  return useContext(ProductFilterContext);
}