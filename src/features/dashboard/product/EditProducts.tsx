import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormField from "../../../components/common/FormField/FormField";
import SelectItemField, {
  OptionType,
} from "../../../components/common/SelectItemField/SelectItemField";
import MultiSelect from "../../../components/common/MultiSelect/MultiSelect";
import ProductDescriptionInput from "../../../components/common/ProductDescriptionInput/ProductDescriptionInput";
import ProductImageInput from "../../../components/common/ProductImageInput/ProductImageInput";
import PublishDateInput from "../../../components/common/DateForm/DateForm";
import RichTextEditor from "../../../components/common/RichTextEditor/RichTextEditor";
import ButtonWithEmoji from "../../../components/Button/ButtonWithEmoji/ButtonWithEmoji";
import { GoPlus, GoDownload } from "react-icons/go";
import ProductService from "../../../services/gateway/ProductGateway/ProductGatewayService";
import { FormImage, Product, ProductVariant } from "../../../types/ProductType";
import { toAbs } from "../../../utils/image";
import CategoryService from "../../../services/common/Category/CategoryService";
import BrandService from "../../../services/common/BrandService/BrandService";
import Varaint from "../../../components/common/Varaint/Varaint";
import { usePopup } from "../../../context/PopupContext";

const EditProducts = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();

  // product fields
  const [productId, setProductId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [actualPrice, setActualPrice] = useState<number>(0);
  const [dealerPrice, setDealerPrice] = useState<number>(0);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [feature, setFeature] = useState<string>("");
  const [status, setStatus] = useState<string>("Published");
  const [compareAtPrice, setCompareAtPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("");
  const [categoriesOptions, setCategoriesOptions] = useState<OptionType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [brandOptions, setBrandOptions] = useState<OptionType[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [tag, setTag] = useState<string[]>([]);
  const [images, setImages] = useState<FormImage[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string>("");
  const [updatedDate, setUpdatedDate] = useState<string>("");
  const [updatedTime, setUpdatedTime] = useState<string>("");
  const [varatins, setVaraints] = useState<ProductVariant[]>([]);
  const variantsRef = useRef<ProductVariant[]>([]);

  const { showPopup, hidePopup } = usePopup();

  useEffect(() => {
    if (id) {
      getProductByID(id);
    } else {
      resetProductState();
    }
  }, [id]);

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  const resetProductState = () => {
    setProductId("");
    setName("");
    setDescription("");
    setCost("");
    setActualPrice(0);
    setDealerPrice(0);
    setTotalStock(0);
    setFeature("");
    setStatus("Published");
    setCompareAtPrice(0);
    setCurrency("");
    setSelectedCategoryId("");
    setSelectedBrandId("");
    setProductType("");
    setTag([]);
    setImages([]);
    setRating(0);
    setWeight(0);
    setColorOptions([]);
    setPrimaryImage("");
    setUpdatedDate("");
    setUpdatedTime("");
    setVaraints([]);
  };

  const getCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories();
      const responseCategoryOptions: OptionType[] =
        response?.data?.categories?.map((cat: any) => ({
          value: cat?._id,
          label: cat?.categoryName,
        })) || [];
      setCategoriesOptions(responseCategoryOptions);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const getBrands = async () => {
    try {
      const response = await BrandService.getAllBrands();
      const brandList =
        response?.data?.brands?.map((b: any) => ({
          value: b?._id,
          label: b?.name,
        })) || [];
      setBrandOptions(brandList ?? []);
    } catch (err) {
      console.error("❌ Failed to fetch brands:", err);
    }
  };

  const getProductByID = async (id: string): Promise<void> => {
    try {
      const response = await ProductService.getProductById(id);
      const product: Product = response.data;
      setProductId(product?.productId || "");
      setName(product.name || "");
      setDescription(product.description || "");
      setCost(product.cost || "");
      setActualPrice(product?.actualPrice || 0);
      setDealerPrice(product?.dealerPrice || 0);
      setCompareAtPrice(product?.compareAtPrice || 0);
      setRating(product?.ratingCount || 0);
      setTotalStock(product.stock ?? 0);
      setFeature(product?.feature || "");
      setCurrency(product?.currency || "");
      setWeight(product?.weight || 0);
      setVaraints(product?.variants || []);
      setStatus(product.status ?? "Published");
      setProductType(product?.productType || "");
      setSelectedCategoryId(product?.category?._id || "");
      setSelectedBrandId(product?.brand?._id || "");
      setTag(product?.tag || []);
      const productImages =
        product?.images && product?.images?.length > 0
          ? product.images
          : product?.primaryImage
            ? [product?.primaryImage]
            : [];
      setImages(productImages?.map((image) => toAbs(image)));
      setPrimaryImage(product?.primaryImage || "");
      setUpdatedDate(product?.updatedDate || "");
      setUpdatedTime(product?.updatedTime || "");

      const colorList =
        response?.data?.variants
          ?.map((v) => v?.attributes?.color)
          ?.filter(Boolean) ?? [];
      setColorOptions(colorList as string[]);
    } catch (error) {
      console.error("❌ Failed to fetch product data:", error);
    }
  };

  useEffect(() => {
    variantsRef.current = varatins;
  }, [varatins]);

  const displayVariants = useMemo(
    () =>
      varatins.map((item) => ({
        ...item,
        onHand: item?.inventory?.onHand || 0,
        reserved: item?.inventory?.reserved || 0,
        safetyStock: item?.inventory?.safetyStock || 0,
        color: item.attributes?.color || "N/A",
        storage: item.attributes?.storage || "N/A",
        status: item?.stock === 0 ? "Out of Stock" : "In Stock",
      })),
    [varatins]
  );

  const fullDataVaraint = useMemo(
    () => ({
      name,
      description,
      cost,
      compareAtPrice,
      discount: 12,
      productId,
      primaryImage: toAbs(primaryImage),
      ratingCount: rating,
      variants: displayVariants,
    }),
    [
      compareAtPrice,
      cost,
      description,
      displayVariants,
      name,
      primaryImage,
      productId,
      rating,
    ]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", selectedCategoryId);
      formData.append("currency", currency);
      formData.append("brand", selectedBrandId);
      formData.append("cost", cost);

      await ProductService?.updateProduct(id, formData);
      alert("Updated Successfully.");
    } catch (error) {
      console.error("Error Update", error);
    }
  };

  const handleVariantUpdate = (
    rowIndex: number,
    field: string,
    newValue: any
  ) => {
    setVaraints((prev) => {
      const updated = [...prev];
      const variant = { ...updated[rowIndex] };

      if (
        field === "onHand" ||
        field === "reserved" ||
        field === "safetyStock"
      ) {
        variant.inventory = { ...variant?.inventory, [field]: newValue };
      } else {
        (variant as any)[field] = newValue;
      }

      // If it's nested attributes like color or storage
      if (field === "color" || field === "storage") {
        variant.attributes = { ...variant.attributes, [field]: newValue };
      } else {
        (variant as any)[field] = newValue;
      }

      updated[rowIndex] = variant;
      return updated;
    });
  };

  const handleSaveVariants = async () => {
    try {
      const formData = new FormData();
      const latestVariants = variantsRef.current.map((variant) => ({
        ...variant,
        attributes: {
          ...variant.attributes,
        },
      }));

      formData.append("variants", JSON.stringify(latestVariants));
      await ProductService.updateProduct(id, formData);
      alert("✅ Variants updated successfully.");
    } catch (err) {
      console.error("❌ Failed to update variants:", err);
      alert("Failed to update variants.");
    }
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, ""); // remove non-numerics
    setCost(val);
  };

  if (!id) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded bg-white p-8 text-center shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-semibold text-[#202947]">
          Choose a product to edit
        </h2>
        <p className="max-w-xl text-sm text-[#6E829F]">
          Open the product list and select an item to load its information here.
          You can then review and update pricing, inventory, and other details
          before saving your changes.
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

  return (
    <>
      <div className="relative h-full w-full rounded bg-white shadow dark:bg-[#19191C]">
        <form onSubmit={handleSubmit} method="POST">
          <div className="flex h-fit w-full flex-col gap-6 border-b border-b-gray-200 border-dashed p-4 xl:flex-row xl:gap-8">
            {/* LEFT SECTION */}
            <div className="grid h-full w-full grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 xl:w-1/2">
              <div className="md:col-span-2">
                <FormField
                  label="Product Name"
                  placeholder="Name"
                  helperText="*Product Name should not exceed 30 characters"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div>
                <SelectItemField
                  label="Category"
                  options={categoriesOptions}
                  value={selectedCategoryId}
                  onChange={(val) => setSelectedCategoryId(val)}
                  placeholder="Select Category"
                />
              </div>
              <div>
                <SelectItemField
                  label="Currency"
                  options={["USD", "EURO", "RIEL"]}
                  placeholder="Select Brand"
                  value={currency}
                  onChange={(val) => setCurrency(val)}
                />
              </div>
              <div>
                <SelectItemField
                  label="Brand"
                  options={brandOptions}
                  placeholder="Select Brand"
                  onChange={(brand) => setSelectedBrandId(brand)}
                  value={selectedBrandId}
                />
              </div>
              <div>
                <FormField
                  label="Enter Cost"
                  placeholder="Cost"
                  helperText="*Mention final price of the product"
                  value={cost ? `$${cost}` : ""}
                  onChange={handleCostChange}
                />
              </div>
              <div className="md:col-span-2">
                <ButtonWithEmoji
                  label="Varaints"
                  btnClass="!w-full !bg-[rgba(92,103,247,0.1)] !border !border-transparent !text-[rgba(92,103,247)] !font-semibold !px-[6px] !py-[6px] !rounded hover:!bg-[rgba(92,103,247)] hover:!text-white hover:!border hover:!border-[rgba(92,103,247)] transition-all duration-300"
                  onClick={() =>
                    showPopup(
                      <Varaint
                        onClose={hidePopup}
                        onVariantChange={handleVariantUpdate}
                        onClick={handleSaveVariants}
                        fullDataVaraint={fullDataVaraint}
                      />
                    )
                  }
                />
              </div>
              <div className="md:col-span-2">
                <ProductDescriptionInput
                  label="Product Description"
                  helpText="*Description should not exceed 500 letters"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </div>
              <div className="md:col-span-2">
                <RichTextEditor label="Product Features" value={feature} />
              </div>
            </div>
            {/* RIGHT SECTION */}
            <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 xl:w-1/2">
              <div className="sm:col-span-1 lg:col-span-2">
                <FormField
                  label="Actual Price"
                  placeholder="Actual price"
                  value={`$${actualPrice}`}
                  type="text"
                />
              </div>
              <div className="sm:col-span-1 lg:col-span-2">
                <FormField
                  label="Dealer Price"
                  placeholder="Dealer Price"
                  value={`$${dealerPrice}`}
                  type="text"
                />
              </div>
              <div className="sm:col-span-1 lg:col-span-2">
                <FormField label="Discount" placeholder="Discount" />
              </div>
              <div className="sm:col-span-1 lg:col-span-3">
                <FormField
                  label="Product Type"
                  placeholder="Type"
                  value={productType}
                />
              </div>
              <div className="sm:col-span-1 lg:col-span-3">
                <FormField
                  label="Item Weight"
                  placeholder="Weight"
                  value={weight}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-6">
                <ProductImageInput
                  label="Product Image"
                  onChange={(files) => setImages(files)}
                  value={images}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-6">
                <ProductImageInput label="Warranty Documents:" />
              </div>
              <div className="sm:col-span-2 lg:col-span-6">
                <PublishDateInput label="Publish Date" value={updatedDate} />
              </div>
              <div className="sm:col-span-2 lg:col-span-6">
                <PublishDateInput
                  label="Publish Time"
                  type="time"
                  value={updatedTime}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-6">
                <SelectItemField
                  label="Published Status"
                  options={["Published", "Unpublished"]}
                  placeholder="Select"
                  onChange={(e) => setStatus(e)}
                  value={status}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-6">
                <MultiSelect
                  options={["IPhone", "Samsung", "Nokia", "Leang"]}
                  placeholder="Tag"
                  label="Product Tag"
                  onChange={(newSelected) => setTag(newSelected)}
                  value={tag}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-6">
                <SelectItemField
                  label="Availability"
                  options={["Stock", "Out Of Stock"]}
                  placeholder="Select"
                  value="Stock"
                />
              </div>
            </div>
          </div>
          <div className="flex h-fit w-full flex-col justify-end gap-2 p-4 sm:flex-row">
            <ButtonWithEmoji
              label="Add Product"
              emoji={<GoPlus />}
              btnClass="flex-row-reverse !bg-[#E354D41A] !text-[#E354D4] hover:!bg-[#E354D4] hover:!text-white"
            />
            <ButtonWithEmoji
              label="Save Product"
              emoji={<GoDownload />}
              btnClass="flex-row-reverse"
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProducts;
