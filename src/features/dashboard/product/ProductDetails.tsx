import React, { useEffect, useRef, useState } from "react";
import DetailCard from "../../../components/common/DetailCard/DetailCard";
import DetailCardInformation from "../../../components/common/DetailCardInformation/DetailCardInformation";
import Tabs from "../../../components/common/Tabs/Tabs";
import Review from "../../../components/common/Review/Review";
import FeatureCard from "../../../components/common/FeatureCard/FeatureCard";
import ProductCard from "../../../components/common/Card/ProductCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../../../services/gateway/ProductGateway/ProductGatewayService";
import { Product } from "../../../types/ProductType";
import CartService from "../../../services/common/CartService/CartService";
import { colorNameToDynamicHex } from "../../../utils/colorUtils";

interface ColorItem {
  name: string;
  hex?: string;
  bgClass?: string;
  ringClass?: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [product, setProduct] = useState<Partial<Product>>({});
  const [colorList, setColorList] = useState<ColorItem[]>([]);
  const [storagesList, setStoragesList] = useState<string[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Partial<Product>[]>(
    []
  );
  const [relatedProducts, setRelatedProducts] = useState<Partial<Product>[]>(
    []
  );

  const sliderRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      handleFetchProductById(id);
      handleProductRelationship(id);
    }
  }, [id]);

  // duplicate for seamless loop
  const looped = [...relatedProducts, ...relatedProducts, ...relatedProducts];
  const middleStart = relatedProducts.length; // start from middle copy

  // initial position in middle
  useEffect(() => {
    const container = sliderRef.current;
    if (container && container.children[middleStart]) {
      const card = container.children[middleStart] as HTMLElement;
      container.scrollLeft = card.offsetLeft;
      setIndex(middleStart);
    }
  }, []);

  const scrollTo = (newIndex: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const card = container.children[newIndex] as HTMLElement;
    if (!card) return;
    container.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setIndex(newIndex);
  };

  const handleNext = () => {
    let newIndex = index + 1;
    scrollTo(newIndex);
  };

  const handlePrev = () => {
    let newIndex = index - 1;
    scrollTo(newIndex);
  };

  // handle seamless reset when reaching edge
  const handleScroll = () => {
    const container = sliderRef.current;
    if (!container) return;

    const maxIndex = looped.length - 1;
    const cardWidth = (container.children[0] as HTMLElement)?.offsetWidth || 0;

    if (index <= 1) {
      // reached start → reset to middle
      const resetIndex = middleStart + 1;
      container.scrollLeft = cardWidth * resetIndex;
      setIndex(resetIndex);
    } else if (index >= maxIndex - 1) {
      // reached end → reset to middle
      const resetIndex = middleStart - 1;
      container.scrollLeft = cardWidth * resetIndex;
      setIndex(resetIndex);
    }
  };

  const handleFetchProductById = async (id: string) => {
    try {
      const responseProduct = await ProductService?.getProductById(id);
      const listColor = [
        ...new Set(
          responseProduct?.data?.variants
            ?.map((v: any) => v?.attributes?.color)
            ?.filter((c: string | undefined): c is string => Boolean(c))
        ),
      ];
      const listStorage = [
        ...new Set(
          responseProduct?.data?.variants
            ?.map((v: any) => v?.attributes?.storage)
            ?.filter((c: string | undefined): c is string => Boolean(c))
        ),
      ];

      // Convert color names to hex dynamically
      const convertedColors = listColor.map((name) => {
        const hex = colorNameToDynamicHex(name);
        return {
          name,
          hex,
          bgClass: `bg-[${hex}]`,
          ringClass: `ring-[${hex}]`,
        };
      });

      setColorList(convertedColors);
      setStoragesList(listStorage);
      setProduct(responseProduct?.data || {});
    } catch (err) {
      console.error("Err Fetch Pooduct BY ID", err);
    }
  };

  const handleAddToCart = async (id: string): Promise<void> => {
    try {
      const responseAddToCart = await CartService.addToCart(id);
      console.log("Add to cart response:", responseAddToCart);
      navigate("/dashboard/product/cart");
    } catch (err) {
      console.log(err);
    }
  };

  const handleProductRelationship = async (id: string) => {
    try {
      const responseProductRelationship =
        await ProductService?.recommendationsProduct(id);

      const featuredProductsData =
        (responseProductRelationship?.data as any)?.featuredProducts || [];
      const releatedProductsData =
        (responseProductRelationship?.data as any)?.relatedProducts || [];

      // ✅ map backend response into FeatureItem shape
      const mappedFeaturedProducts = featuredProductsData.map((item: any) => ({
        productImg: item.primaryImage || item.images?.[0],
        productName: item.name,
        ratingProduct: item.ratingAvg,
        ratingCountProduct: item.ratingCount,
        productCost: item.cost,
        compareAtPrice: item.compareAtPrice,
        addToCart: () => handleAddToCart(item._id),
      }));

      const mappedRelatedProducts = releatedProductsData?.map((item: any) => ({
        _id: item._id,
        name: item.name,
        brand: item.brand,
        cost: item.cost,
        compareAtPrice: item.compareAtPrice,
        ratingAvg: item.ratingAvg,
        ratingCount: item.ratingCount,
        primaryImage: item.primaryImage || item.images?.[0],
        images: item.images || [],
      }));

      setFeaturedProduct(mappedFeaturedProducts);
      setRelatedProducts(mappedRelatedProducts);
    } catch (err) {
      console.error("Error Fetch Product Relationship", err);
    }
  };

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded bg-white p-4 text-center shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-semibold text-[#202947]">
          Select a product to view its details
        </h2>
        <p className="max-w-md text-sm text-[#6E829F]">
          Use the product list to choose an item first. Once selected, you can
          view full information, specifications, reviews, and related products
          here.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/product/listproduct")}
          className="rounded bg-[#5C67F7] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4b55d6]"
        >
          Go to Product List
        </button>
      </div>
    );
  }

  console.log("relatedProduct", relatedProducts);

  return (
    <div className="w-full h-fit">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 bg-white shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)] rounded">
          <DetailCard
            productName={product?.name}
            images={product?.images}
            primaryImage={product?.primaryImage}
          />
        </div>
        <div className="col-span-3 col-start-3 bg-white shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)] rounded">
          <DetailCardInformation
            productName={product?.name}
            ratingAvg={product?.ratingAvg}
            ratingCount={product?.ratingCount}
            cost={product?.cost}
            compareAtPrice={product?.compareAtPrice}
            description={product?.description}
            storageList={storagesList}
            colorList={colorList}
            onCompare={() => alert("Compare")}
            onAddToCart={() => handleAddToCart(id || "")}
          />
        </div>
        <div className="col-span-3 row-start-2 bg-white dark:bg-[#19191C] shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)] rounded">
          <Tabs
            productDetails={{
              productName: product?.brand?.name,
              productBrand: product?.name,
              display: product?.attributes?.display,
              chipset: product?.attributes?.chipset,
              waterResistance: product?.attributes?.waterResistance,
            }}
          />
        </div>
        <div className="col-span-2 row-span-2 col-start-4 row-start-2 bg-white dark:bg-[#19191C] shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)] rounded">
          <FeatureCard
            featureItems={featuredProduct}
            onClick={() => alert("View All")}
          />
        </div>
        <div className="col-span-3 row-start-3 bg-white dark:bg-[#19191C] shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)] rounded">
          <Review />
        </div>
      </div>
      <h5 className="text-[#212b37] dark:text-white font-sans font-semibold text-[20px] mt-4">
        Related Products
      </h5>
      <span className="text-[#212b37] dark:text-[#cbd5f5] font-sans font-normal text-[13px]">
        Explore more products similar to this one, dolore magna aliqua.
      </span>
      <div className="relative w-full h-fit mt-4">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#111827] shadow-md border border-gray-200 dark:border-[#374151] rounded-full p-2 hover:bg-gray-50 dark:hover:bg-[#1f2937] cursor-pointer"
        >
          <IoIosArrowBack className="text-gray-700 dark:text-gray-200 text-lg" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-hidden gap-5 scrollbar-hide scroll-smooth"
        >
          {relatedProducts.map((p, i) => (
            <div
              key={`${p._id}-${i}`}
              className="flex-shrink-0 w-[19%] bg-white dark:bg-[#19191C] rounded"
            >
              <ProductCard
                product={p as Product} // 👈 cast if needed
                userClick={{
                  addToCart: () => handleAddToCart(p._id || ""),
                  quickView: () => console.log("Quick view:", p.name),
                  addToWishlist: () => console.log("Wishlist:", p.name),
                  compare: () => console.log("Compare:", p.name),
                }}
              />
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#111827] shadow-md border border-gray-200 dark:border-[#374151] rounded-full p-2 hover:bg-gray-50 dark:hover:bg-[#1f2937] cursor-pointer"
        >
          <IoIosArrowForward className="text-gray-700 dark:text-gray-200 text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
