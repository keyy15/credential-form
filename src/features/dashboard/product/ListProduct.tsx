import React, {
  useEffect,
  useState,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import ProductService from "../../../services/gateway/ProductGateway/ProductGatewayService";
import { Product } from "../../../types/ProductType";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../../../services/socket/socket";
import { DEFAULT_IMG, toAbs } from "../../../utils/image";
import {
  toolbarVariants,
  dropdownVariants,
} from "../../../animation/animation";
import { useNavigate } from "react-router-dom";
import FormInput from "../../../components/common/FormField/FormField";
import DynamicTable from "../../../components/common/DynamicTable/DynamicTable";
import CheckBox from "../../../components/common/CheckBox/CheckBox";
import SelectionFilter from "../../../components/common/SelectionFilter/SelectionFilter";

interface FormattedProduct {
  _id?: string;
  check?: ReactNode;
  product: { _id: string; name: string; image: string };
  category: string;
  price?: number | string;
  stock?: number;
  status: string;
  seller: { name: string; image: string };
  published: string;
}

type SortKey = "" | "price_asc" | "price_desc" | "sort_by" | "most_relevant";

const LABEL_TO_SORT: Record<string, SortKey> = {
  "Price Low to High": "price_asc",
  "Price High to Low": "price_desc",
  "Sort By": "sort_by",
  "Most Relevant": "most_relevant",
};

const ListProduct: React.FC = () => {
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPerPage, setTotalPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [changeStatus, setChangeStatus] = useState<boolean>(false);
  const [selectionToolbar, setSelectionToolbar] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState({
    query: "",
  });
  const [sort, setSort] = useState<string>("");

  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSearchRef = useRef<string>("");

  const navigate = useNavigate();

  const handleSelectProduct = (productId: string) => {
    setSelectedProductIds((prevSelected) => {
      if (prevSelected.includes(productId)) {
        const updated = prevSelected.filter((id) => id !== productId);
        setSelectionToolbar(updated.length > 0);
        return updated;
      } else {
        const updated = [...prevSelected, productId];
        setSelectionToolbar(true);
        return updated;
      }
    });
  };

  useEffect(() => {
    const handleCreated = (newProduct: Product) => {
      if (!newProduct || !newProduct._id || !newProduct.name) return; // Validate

      setProducts((prev: any) => {
        const exists = prev.some((p: any) => p._id === newProduct._id);
        if (exists) return prev;

        // Insert only on first page
        if (currentPage === 1) {
          return [newProduct, ...prev.slice(0, itemsPerPage - 1)];
        }

        return prev;
      });

      setTotalItems((prev) => prev + 1);
    };

    const handleProductUpdated = (
      updatedProduct: Partial<Product> & { _id: string }
    ) => {
      setProducts((prevProducts: any) =>
        prevProducts.map((p: any) =>
          p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p
        )
      );
    };

    const handleDeleted = (deletedId: string) => {
      setProducts((prev) => prev.filter((p) => p._id !== deletedId));
      setTotalItems((prev) => prev - 1);
    };

    socket.on("product:created", handleCreated);
    socket.on("product:edited", handleProductUpdated);
    socket.on("product:deleted", handleDeleted);

    return () => {
      socket.off("product:created", handleCreated);
      socket.off("product:edited", handleProductUpdated);
      socket.off("product:deleted", handleDeleted);
    };
  }, [currentPage, itemsPerPage]);

  const formatProducts = useCallback(
    (productList: Product[]): FormattedProduct[] =>
      productList.map((p: Product) => {
        const createdAt = p?.createdAt ? new Date(p.createdAt) : null;

        const formattedDate = createdAt
          ? createdAt.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          : "—";

        const imageUrl =
          typeof p.primaryImageIndex === "number" &&
            Array.isArray(p.images) &&
            p.images[p.primaryImageIndex]
            ? p.images[p.primaryImageIndex]
            : p.images?.[0] || "";

        return {
          _id: p._id ?? "",
          // check: <CheckBox />,
          product: {
            _id: p?._id ?? "",
            name: p.name,
            image: toAbs(imageUrl) || DEFAULT_IMG,
          },
          category: p.category?.categoryName || "—",
          price: p.cost,
          stock: p.stock,
          status: p.status || "—",
          seller: {
            name: p.seller?.name || "Unknown Seller",
            image: p.seller?._id
              ? `https://api.dicebear.com/9.x/thumbs/svg?seed=${p.seller.name}`
              : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
          },
          published: formattedDate,
        };
      }),
    []
  );

  const handleFetchProducts = useCallback(async (): Promise<void> => {
    try {
      const res = await ProductService.getProduct(currentPage, itemsPerPage);
      const { products = [], pagination } = res?.data ?? {};

      const formattedData = formatProducts(products);

      setProducts(formattedData);
      setTotalItems(pagination?.total ?? products.length ?? 0);
      setItemsPerPage((prev) =>
        pagination?.perPage && pagination.perPage > 0
          ? pagination.perPage
          : prev
      );
      const resolvedPage =
        pagination?.page && pagination.page > 0 ? pagination.page : currentPage;
      setPage(resolvedPage);
      if (resolvedPage !== currentPage) {
        setCurrentPage(resolvedPage);
      }
      setTotalPerPage(
        pagination?.totalPages && pagination.totalPages > 0
          ? pagination.totalPages
          : 1
      );
      setHasNextPage(
        typeof pagination?.hasNextPage === "boolean"
          ? pagination.hasNextPage
          : resolvedPage < (pagination?.totalPages ?? resolvedPage)
      );
      setHasPrevPage(
        typeof pagination?.hasPrevPage === "boolean"
          ? pagination.hasPrevPage
          : resolvedPage > 1
      );
    } catch (e) {
      console.error("Failed to fetch products:", e);
      setHasNextPage(false);
      setHasPrevPage(false);
    }
  }, [currentPage, formatProducts, itemsPerPage]);

  const fetchSearchResults = useCallback(
    async (query: string, pageToFetch = 1): Promise<void> => {
      if (!query) return;

      try {
        const res = await ProductService.searchProduct(
          query,
          pageToFetch,
          itemsPerPage
        );

        const { products = [], pagination } = res?.data ?? {};

        if (latestSearchRef.current !== query) {
          return;
        }

        const formattedProducts = formatProducts(products);

        setProducts(formattedProducts);
        setTotalItems(pagination?.total ?? products.length ?? 0);
        setItemsPerPage((prev) =>
          pagination?.perPage && pagination.perPage > 0
            ? pagination.perPage
            : prev
        );

        const resolvedPage =
          pagination?.page && pagination.page > 0
            ? pagination.page
            : pageToFetch;

        if (resolvedPage !== currentPage) {
          setCurrentPage(resolvedPage);
        }
        setPage(resolvedPage);
        setTotalPerPage(
          pagination?.totalPages && pagination.totalPages > 0
            ? pagination.totalPages
            : 1
        );
        setHasNextPage(
          typeof pagination?.hasNextPage === "boolean"
            ? pagination.hasNextPage
            : resolvedPage < (pagination?.totalPages ?? resolvedPage)
        );
        setHasPrevPage(
          typeof pagination?.hasPrevPage === "boolean"
            ? pagination.hasPrevPage
            : resolvedPage > 1
        );
      } catch (err) {
        console.error("Search failed:", err);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    },
    [currentPage, formatProducts, itemsPerPage]
  );

  const handleFilterProductsAdvanced = useCallback(async () => {
    try {
      const params = {
        search: searchInput.query || undefined,
        sort: sort || undefined,
        page: currentPage,
        limit: itemsPerPage,
        // You can later extend here with priceMin, priceMax, categories...
      };

      const res = await ProductService.filterProducts(params);
      const { products = [], pagination } = res?.data ?? {};

      const formattedData = formatProducts(products);
      setProducts(formattedData);

      setTotalItems(pagination?.total ?? products.length ?? 0);
      setItemsPerPage(pagination?.perPage ?? itemsPerPage);
      setTotalPerPage(pagination?.totalPages ?? 1);
      setHasNextPage(pagination?.hasNextPage ?? false);
      setHasPrevPage(pagination?.hasPrevPage ?? false);
    } catch (err) {
      console.error("Failed to load filtered products:", err);
      setHasNextPage(false);
      setHasPrevPage(false);
    }
  }, [searchInput.query, sort, currentPage, itemsPerPage, formatProducts]);

  const handleSortChange = (label: string) => {
    const key = LABEL_TO_SORT[label] ?? "";
    setSort(key);
  };

  useEffect(() => {
    if (debouncedQuery) return;

    if (sort || searchInput.query.trim()) {
      handleFilterProductsAdvanced();
      return;
    }

    handleFetchProducts();
  }, [
    debouncedQuery,
    sort,
    currentPage,
    itemsPerPage,
    searchInput.query,
    handleFetchProducts,
    handleFilterProductsAdvanced,
  ]);

  useEffect(() => {
    if (!debouncedQuery) {
      latestSearchRef.current = "";
      return;
    }

    latestSearchRef.current = debouncedQuery;
    fetchSearchResults(debouncedQuery, currentPage);
  }, [debouncedQuery, currentPage, fetchSearchResults]);

  const handleSelectAll = () => {
    if (selectedProductIds.length === products.length) {
      setSelectedProductIds([]);
      setSelectionToolbar(false);
    } else {
      const allIds = products.map((p) => p._id || "");
      setSelectedProductIds(allIds);
      setSelectionToolbar(allIds.length > 0);
    }
  };

  const columns = [
    {
      header: (
        <CheckBox
          checked={
            products.length > 0 && selectedProductIds.length === products.length
          }
          onChange={handleSelectAll}
        />
      ),
      accessor: "check",
      width: "2%",
      color: "!font-semibold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
      render: (_: any, row: FormattedProduct) => (
        <CheckBox
          checked={selectedProductIds.includes(row._id || "")}
          onChange={() => handleSelectProduct(row._id || "")}
        />
      ),
    },
    {
      header: "Product",
      accessor: "product",
      width: "13%",
      bodyColor: "!text-[#5C67F7] !text-[13px] !font-normal !py-4",
      color: "!font-bold",
      render: (value: any) => {
        if (!value) return <span className="text-gray-400">No Product</span>;

        const { _id, name, image } = value || {};
        return (
          <div className="w-full flex items-center gap-2">
            <span
              className={
                "w-[40px] h-[40px] bg-[#F9F9FA] dark:bg-[#2A2F31] rounded"
              }
            >
              <img
                src={
                  image
                    ? image
                    : "https://upload.wikimedia.org/wikipedia/commons/f/fd/Jisoo_of_Blackpink_at_a_Dior_event%2C_April_18%2C_2025_%283%29.png"
                }
                alt="product-img"
                className="p-1 w-full h-full object-cover rounded-[50%]"
              />
            </span>
            <div>
              <p
                className={
                  "text-[#000000] dark:text-white text-[14px] font-bold flex items-center cursor-pointer"
                }
                onClick={() =>
                  navigate(`/dashboard/product/productdetails/${value._id}`)
                }
              >
                {name}
              </p>
              <p className={"text-[12px] text-[#6e829f] dark:text-[#cbd5f5]"}>
                SoundWave
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      accessor: "category",
      width: "5%",
      color: "!font-semibold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
      editable: true,
    },
    {
      header: "Price",
      accessor: "price",
      width: "4%",
      color: "!font-semibold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
      editable: true,
      currency: true,
    },
    {
      header: "Stock",
      accessor: "stock",
      width: "4%",
      color: "!font-semibold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
      editable: true,
    },
    {
      header: "Status",
      accessor: "status",
      width: "6%",
      color: "!font-semibold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
      render: (value: any) => {
        const isUnpublished = value?.toLowerCase() === "unpublished";
        const bgColor = isUnpublished ? "!bg-red-100" : "!bg-[#5C67F71A]";
        const textColor = isUnpublished ? "!text-red-600" : "!text-[#5C67F7]";

        return (
          <span
            className={`!px-[7.2px] !py-[4px] !font-semibold rounded text-[11px] ${bgColor} ${textColor}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      header: "Seller",
      accessor: "seller",
      width: "9%",
      color: "!font-semibold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      render: (value: any) => {
        if (!value) return <span className="text-gray-400">No Seller</span>;

        const { image, name } = value || {};

        return (
          <div className="flex items-center gap-2">
            <div className="w-[28px] h-[28px] rounded-full overflow-hidden border border-gray-200 bg-[#F7F7FE]">
              <img
                src={
                  image ||
                  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                }
                alt={name || "Seller"}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[13px] font-bold text-[#212b37] dark:text-white">
              {name || "Unknown Seller"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Published",
      accessor: "published",
      width: "7%",
      color: "!font-semibold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
      editable: true,
    },
    {
      header: "Action",
      accessor: "action",
      width: "5%",
      color: "!font-semibold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      editable: true,
    },
  ];

  const handleFoundProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const trimmedValue = value.trim();

    setSearchInput((prev) => ({ ...prev, query: value }));

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = null;
    }

    latestSearchRef.current = trimmedValue;

    if (!trimmedValue) {
      setDebouncedQuery("");
      setCurrentPage(1);
      setPage(1);
      setHasNextPage(false);
      setHasPrevPage(false);
      return;
    }

    setCurrentPage(1);
    setPage(1);

    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(trimmedValue);
      debounceTimeout.current = null;
    }, 400);
  };

  const handleDeleteProduct = async (productId: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!shouldDelete) return;
    try {
      const deleted = await ProductService.deleteProduct(productId);
      if (deleted) {
        setProducts((prevProducts) =>
          prevProducts.filter((selectedId) => selectedId._id !== productId)
        );
        setTotalItems((prev) => prev - 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeStatus = () => {
    setChangeStatus((prevState) => !prevState);
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

  const handleDeleteMultipleProducts = async () => {
    try {
      if (selectedProductIds.length === 0) return;

      const shouldDelete = window.confirm(
        "Are you sure you want to delete the selected products?"
      );
      if (!shouldDelete) return;

      const response = await ProductService.multiDeleteProduct(
        selectedProductIds
      );

      // Update UI
      setProducts((prev) =>
        prev.filter(
          (product) => !selectedProductIds.includes(product?._id || "")
        )
      );
      setSelectedProductIds([]);
      setSelectionToolbar(false);
      console.log(response.data.msg);
    } catch (error) {
      console.error("Failed to delete selected products:", error);
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#19191C] shadow rounded-lg p-6">
      <div className="flex gap-3">
        <FormInput
          className="w-[320px]"
          type="text"
          placeholder="Search product here..."
          onChange={handleFoundProduct}
          value={searchInput.query}
        />
        <SelectionFilter onSortChange={handleSortChange} />
      </div>
      <div className={"w-full h-[600px] overflow-x-auto mt-5"}>
        <DynamicTable
          classname="!max-h-full !overflow-y-auto"
          columns={columns}
          data={products}
          actions={{
            edit: {
              icon: <CiEdit />,
              colorClass:
                "!p-2 !bg-[#5C67F71A] hover:!bg-[#5C67F7] !text-[#5C67F7] hover:!text-[#fff]",
              onClick: (row) =>
                navigate(`/dashboard/product/editproducts/${row._id}`),
            },
            delete: {
              icon: <RiDeleteBinLine />,
              colorClass:
                "!p-2 !bg-[#FB42421A] hover:!bg-[#fb4242] !text-[#FB4242] hover:!text-[#fff]",
              onClick: (row) => handleDeleteProduct(row?._id),
            },
          }}
        />
      </div>
      <nav
        className="relative w-full h-fit flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-[#fff] mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {startItem} - {endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalItems}
          </span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              onClick={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
              disabled={!hasPrevPage}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight cursor-pointer text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:bg-[#19191C] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </button>
          </li>

          {(() => {
            const pageNumbers = [];
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPerPage, start + 4);

            if (end - start < 4) {
              start = Math.max(1, end - 4);
            }

            for (let i = start; i <= end; i++) {
              pageNumbers.push(i);
            }

            return pageNumbers.map((page) => (
              <li key={page}>
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 flex items-center justify-center px-3 h-8 leading-tight border ${currentPage === page
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:bg-[#19191C] dark:text-white"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-[#19191C] dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                    } border-gray-300 dark:border-gray-700`}
                >
                  {page}
                </button>
              </li>
            ));
          })()}

          <li>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPerPage ? prev + 1 : prev
                )
              }
              disabled={!hasNextPage}
              className="flex items-center justify-center px-3 h-8 leading-tight cursor-pointer text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:bg-[#19191C] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <AnimatePresence>
        {selectionToolbar && (
          <motion.div
            className="w-fit h-fit fixed bottom-2 left-[50%] transform -translate-x-[25%] -translate-y-1/2 z-50 flex items-center justify-center bg-white dark:bg-[#19191C] shadow-[0px_0px_4px_0px_rgba(0,_0,_0,_0.15)] dark:shadow-[0px_0px_4px_0px_rgba(0,_0,_0,_0.35)] rounded-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            <ul className="flex justify-center items-center text-[14px]">
              <li className="flex items-center justify-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="text-sm font-normal text-gray-500 dark:text-[#fff] mb-4 md:mb-0 block w-full md:inline md:w-auto">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedProductIds?.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {totalItems}
                  </span>
                </span>
              </li>
              <li
                className="relative flex items-center justify-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleChangeStatus}
              >
                <CiEdit />
                <AnimatePresence>
                  {changeStatus && (
                    <motion.ul
                      className="absolute bottom-[125%] left-1/2 text-[12px] w-[80%] h-fit transform -translate-x-1/2 bg-white dark:bg-[#19191C] shadow-[0px_0px_4px_0px_rgba(0,_0,_0,_0.15)] rounded-lg border-none overflow-hidden border-0 group-hover:pointer-events-auto pointer-events-auto z-10"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={toolbarVariants}
                    >
                      <li className="p-2 hover:bg-gray-100 dark:bg-[#19191C] dark:hover:bg-gray-700">
                        Published
                      </li>
                      <li className="p-2 hover:bg-gray-100 dark:bg-[#19191C] dark:hover:bg-gray-700">
                        Unpublished
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
                <span className="">Change Status</span>
                <MdOutlineKeyboardArrowDown />
              </li>
              <li className="flex items-center justify-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <span>Duplicate</span>
              </li>
              <li
                className="flex items-center justify-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleDeleteMultipleProducts}
              >
                <span className="text-red-500">Delete All</span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListProduct;
