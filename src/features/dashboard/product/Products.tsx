import React, { useEffect, useMemo, useState } from "react";
import CategorySelect from "../../../components/common/CategorySelect/CategorySelect";
import PriceRange from "../../../components/common/PriceRange/PriceRange";
import { Product } from "../../../types/ProductType";
import ProductService from "../../../services/gateway/ProductGateway/ProductGatewayService";
import CartService from "../../../services/common/CartService/CartService";
import ProductCard from "../../../components/common/Card/ProductCard";
import CategoryService from "../../../services/common/Category/CategoryService";
import { CategoryStats } from "../../../types/Category";
import { useNavigate } from "react-router-dom";
import SelectionFilter from "../../../components/common/SelectionFilter/SelectionFilter";
import BrandService from "../../../services/common/BrandService/BrandService";
import { BrandStats } from "../../../types/BrandType";
import { discountData, sizeData } from "../../../dummyData/dummyData";
import Pagination from "../../../components/common/Pagination/Pagination";
import { useToast } from "../../../context/ToasterContext";
import WishlistService from "../../../services/common/WishlistService/WishlistService";
import { AxiosError } from "axios";

type SortKey = "" | "price_asc" | "price_desc";

const LABEL_TO_SORT: Record<string, SortKey> = {
  "Price Low to High": "price_asc",
  "Price High to Low": "price_desc",
};

const perPage = 12;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    CategoryStats["categories"] | undefined
  >([]);
  const [brand, setBrand] = useState<BrandStats["brands"]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { showToast } = useToast();

  // Filter & Search states
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Debounce price range slider
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [priceRange]);

  // Fetch categories on mount
  useEffect(() => {
    (async () => {
      try {
        const responseCategories = await CategoryService.getAllCategories();
        setCategories(responseCategories?.data?.categories || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Fetch brands on mount
  useEffect(() => {
    (async () => {
      try {
        const response = await BrandService.getAllBrands();
        setBrand((response?.data as BrandStats)?.brands || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Main product fetch effect triggered by filter changes
  useEffect(() => {
    (async () => {
      try {
        const response = await ProductService.filterProducts({
          search: debouncedSearch || undefined,
          priceMin: debouncedPriceRange[0],
          priceMax: debouncedPriceRange[1],
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          brands: selectedBrands.length > 0 ? selectedBrands : undefined,
          sort: sortBy || undefined,
          page,
          limit: perPage,
        });

        // Backend response conforms to getPaginationMeta
        const data = response?.data as any;
        if (data) {
          setProducts((data.products as Product[]) || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    })();
  }, [debouncedSearch, debouncedPriceRange, selectedCategories, selectedBrands, sortBy, page]);

  const handleSortChange = (label: string) => {
    const key = LABEL_TO_SORT[label] ?? "";
    setSortBy(key);
    setPage(1);
    console.log("Selected sort:", label, "→", key);
  };

  const handleClearAll = () => {
    setSearchInput("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 50000]);
    setSortBy("");
    setPage(1);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const responseAddToCart = await CartService.addToCart(productId);
      showToast({
        title: `Added`,
        description: `Add Successfull`,
        type: "success",
      });
      console.log("Add to cart response:", responseAddToCart);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddWishlist = async (id: string, name: string) => {
    try {
      await WishlistService?.addWishlist(id);
      showToast({
        title: "Add Wishlist Success",
        description: `${name} added to wishlist successfully.`,
        type: "success",
      });
    } catch (err) {
      const error = err as AxiosError<{ code?: string; error?: string }>;
      showToast({
        title: error?.response?.data?.code,
        description: error?.response?.data?.error,
        type: "danger",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between gap-6">
      <div className="flex justify-between items-center p-[16px] bg-white dark:bg-[#19191C] shadow rounded-lg">
        <div className="flex items-center gap-4">
          <h6 className="text-[16px] text-[#212B37] dark:text-white font-bold rounded-full">
            Total{" "}
            <span className="text-[16px] text-[#E354D4] font-bold">
              {total}
            </span>{" "}
            Available
          </h6>
          {/* Search Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-64 pl-9 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-[#2d2d30] border border-slate-200 dark:border-slate-800 rounded-lg text-[#212B37] dark:text-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition"
            />
            <svg
              className="absolute left-3 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex justify-between">
          <SelectionFilter onSortChange={handleSortChange} />
        </div>
      </div>
      <div className="flex justify-between gap-6">
        <div className="w-[75%] h-fit flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((product, index) => (
              <ProductCard
                key={product._id || index}
                product={product}
                badgeIndex={index}
                userClick={{
                  addToCart: () => handleAddToCart(product?._id || ""),
                  quickView: () => alert(product.productId + " quick view"),
                  addToWishlist: () =>
                    handleAddWishlist(product._id || "", product?.name),
                  compare: () => alert(product.productId + " compare"),
                }}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="w-full flex justify-center items-center mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
                boundaryCount={2}
                siblingCount={1}
              />
            </div>
          )}
        </div>
        <div className="w-[25%] h-fit grid bg-white dark:bg-[#19191C] shadow rounded-lg">
          <div className="flex justify-between px-[16px] pt-[16px]">
            <h6 className="text-[16px] text-[#212B37] dark:text-white font-semibold">Filter</h6>
            <button
              className="text-[#FF5D9F] text-[13px] font-sans font-normal cursor-pointer underline"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
          <div className="w-full flex flex-col justify-between">
            <CategorySelect
              label="Categories"
              data={categories}
              selected={selectedCategories}
              onChange={(selected) => {
                setSelectedCategories(selected);
                setPage(1);
              }}
              accessors={{
                id: (x) => x._id || "",
                label: (x) => x.categoryName,
                count: (x) => x.productCount,
                disabled: (x) => x.productCount === 0,
              }}
            />
            <PriceRange
              label="Price Range"
              min={0}
              max={50000}
              step={0.01}
              value={priceRange}
              onChange={setPriceRange}
            />
            <CategorySelect
              label="Brand"
              data={brand}
              selected={selectedBrands}
              onChange={(selected) => {
                setSelectedBrands(selected);
                setPage(1);
              }}
              accessors={{
                id: (x) => x._id || "",
                label: (x) => x.name || "",
                count: (x) => x.productCount || 0,
                disabled: (x) => false,
              }}
            />
            <CategorySelect
              label="Discount"
              data={discountData}
              selected={[]}
              onChange={() => {}}
              accessors={{
                id: (x) => x.id || "",
                label: (x) => x.label || "",
                count: (x) => x.count || 0,
                disabled: (x) => x.disabled,
              }}
            />
            <CategorySelect
              label="Size"
              data={sizeData}
              selected={[]}
              onChange={() => {}}
              accessors={{
                id: (x) => x.id || "",
                label: (x) => x.label || "",
                count: (x) => x.count || 0,
                disabled: (x) => x.disabled,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
