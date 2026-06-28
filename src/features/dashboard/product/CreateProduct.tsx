import FormField from "../../../components/common/FormField/FormField";
import React, { useEffect, useState } from "react";
import SelectItemField from "../../../components/common/SelectItemField/SelectItemField";
import MultiSelect from "../../../components/common/MultiSelect/MultiSelect";
import ProductDescriptionInput from "../../../components/common/ProductDescriptionInput/ProductDescriptionInput";
import ProductImageInput from "../../../components/common/ProductImageInput/ProductImageInput";
import PublishDateInput from "../../../components/common/DateForm/DateForm";
import PublishDateTimeInput from "../../../components/common/TimeForm/TimeForm";
import { OptionType } from "../../../components/common/SelectItemField/SelectItemField";
import ProductService from "../../../services/gateway/ProductGateway/ProductGatewayService";
import RichTextEditor from "../../../components/common/RichTextEditor/RichTextEditor";
import PrimaryButton from "../../../components/Button/PrimaryButton/PrimaryButton";
import { CategoryType } from "../../../types/Category";
import ButtonWithEmoji from "../../../components/Button/ButtonWithEmoji/ButtonWithEmoji";
import Varaint from "../../../components/common/Varaint/Varaint";
import { usePopup } from "../../../context/PopupContext";
import { BrandType } from "../../../types/BrandType";
import { FormImage } from "../../../types/ProductType";
import { useToast } from "../../../context/ToasterContext";
import CategoryService from "../../../services/common/Category/CategoryService";
import BrandService from "../../../services/common/BrandService/BrandService";

const CreateProduct = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [actualPrice, setActualPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [status, setStatus] = useState<string>("Published");
  const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [brandOptions, setBrandOptions] = useState<OptionType[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [tag, setTag] = useState<string[]>([]);
  const [publishDate, setPublishDate] = useState<string>("");
  const [feature, setFeature] = useState<string>("");
  const [publishTime, setPublishTime] = useState<string>("");
  const [stockAvailability, setStockAvailability] = useState<string>("");
  const [images, setImages] = useState<FormImage[]>([]);

  const { showPopup, hidePopup } = usePopup();
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setActualPrice(0);
      return;
    }
    const parsed = Number(value);
    if (!isNaN(parsed)) {
      setActualPrice(parsed);
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setStock(0);
    }
    const parsed = Number(value);
    if (!isNaN(parsed)) {
      setStock(parsed);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories();
      const mappedOptions = response.data.categories.map(
        (cat: CategoryType) => ({
          value: cat._id ?? "",
          label: cat.categoryName ?? "Unnamed",
        })
      );
      setCategoryOptions(mappedOptions);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await BrandService.getAllBrands();
      const mappedOptions = response?.data?.brands?.map((b: BrandType) => ({
        value: b?._id ?? "",
        label: b.name ?? "Unnamed",
      }));
      setBrandOptions(mappedOptions || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", actualPrice.toString());
      formData.append("stock", stock.toString());
      formData.append("category", selectedCategoryId);
      formData.append("status", status);
      formData.append("discount", discount);
      formData.append("publishDate", publishDate);
      formData.append("publishTime", publishTime);
      formData.append("cost", cost);
      formData.append("brand", selectedBrandId);
      formData.append("currency", currency);
      formData.append("actualPrice", actualPrice.toString());
      formData.append("stockAvailability", stockAvailability);
      formData.append("weight", weight);
      formData.append("feature", feature);
      formData.append("productType", productType);
      formData.append("seller", "685ab59e33f273e409dc3eac");

      tag.forEach((t) => formData.append("tag", t));

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      await ProductService.createProduct(formData);

      showToast({
        title: "Create Successfully",
        description: "Your item was created successfully.",
        type: "success",
      });

      // ✅ Reset all form fields after creation
      setName("");
      setDescription("");
      setActualPrice(0);
      setStock(0);
      setSelectedCategoryId("");
      setStatus("draft"); // or your default
      setDiscount("");
      setPublishDate("");
      setPublishTime("");
      setCost("");
      setSelectedBrandId("");
      setCurrency("USD");
      setStockAvailability("");
      setWeight("");
      setFeature("");
      setProductType("");
      setTag([]);
      setImages([]);
    } catch (error) {
      showToast({
        title: "Create Failed",
        description: "Your item was created failed.",
        type: "danger",
      });
      console.error("Error creating product:", error);
    }
  };

  const hanldeTestToaster = () => {
    showToast({
      title: "Create Successfully",
      description: "Your item was created successfully.",
      type: "danger",
    });
  };

  return (
    <div className="relative h-full w-full rounded-lg bg-white p-4 shadow dark:bg-[#19191C] sm:p-6">
      <form onSubmit={handleSubmit} method="POST">
        <div className="flex h-full w-full flex-col gap-4 xl:flex-row">
          <div className="grid h-full w-full grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 xl:w-1/2">
            <div className="md:col-span-2">
              <FormField
                label="Product Name"
                placeholder="Name"
                helperText="*Product Name should not exceed 30 characters"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div>
              <FormField
                label="Enter Cost"
                placeholder="Cost"
                value={cost}
                helperText="*Mention final price Of the product"
                required
                onChange={(event) => setCost(event.target.value)}
              />
            </div>
            <div>
              <SelectItemField
                label="Brand"
                options={brandOptions}
                placeholder="Select Brand"
                value={selectedBrandId}
                onChange={(val) => setSelectedBrandId(val)}
              />
            </div>
            <div>
              <SelectItemField
                label="Category"
                options={categoryOptions}
                value={selectedCategoryId}
                onChange={(val) => setSelectedCategoryId(val)}
                placeholder="Select Category"
              />
            </div>
            <div>
              <SelectItemField
                label="Currency"
                options={["USD", "RIEL", "YUAN", "EURO"]}
                placeholder="Select size"
                value={currency}
                onChange={(val) => setCurrency(val)}
              />
            </div>
            <div className="md:col-span-2">
              <ButtonWithEmoji
                label="Add Varaints"
                btnClass="!w-full !bg-[rgba(92,103,247,0.1)] !border !border-transparent !text-[rgba(92,103,247)] !font-semibold !px-[6px] !py-[6px] !rounded hover:!bg-[rgba(92,103,247)] hover:!text-white hover:!border hover:!border-[rgba(92,103,247)] transition-all duration-300"
                onClick={() => showPopup(<Varaint onClose={hidePopup} />)}
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
            <div>
              <FormField
                label="Product Type"
                placeholder="Type"
                value={productType}
                onChange={(val) => setProductType(val.target.value)}
              />
            </div>
            <div>
              <FormField
                label="Item Weight"
                placeholder="Weight in gms"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <ProductImageInput
                label="Product Image"
                onChange={(files) => setImages(files)}
                value={images}
              />
            </div>
            <div className="md:col-span-2">
              <SelectItemField
                label="Availability"
                options={["Stock", "Out Of Stock"]}
                placeholder="Select"
                value={stockAvailability}
                onChange={(val) => setStockAvailability(val)}
              />
            </div>
          </div>
          <div className="grid h-full w-full grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-6 xl:w-1/2">
            <div className="sm:col-span-2 lg:col-span-6">
              <RichTextEditor label="Product Feature" value={feature} />
            </div>
            <div className="sm:col-span-2 lg:col-span-6">
              <ProductImageInput label="Warranty Documents:" />
            </div>
            <div className="sm:col-span-1 lg:col-span-2">
              <FormField
                label="Actual Price"
                placeholder="Actual Price"
                value={actualPrice}
                onChange={handlePriceChange}
                type="number"
              />
            </div>
            <div className="sm:col-span-1 lg:col-span-2">
              <FormField
                label="Stock"
                placeholder="Enter Stock"
                value={stock}
                onChange={handleStockChange}
                type="number"
              />
            </div>
            <div className="sm:col-span-1 lg:col-span-2">
              <FormField
                label="Discount"
                placeholder="Discount"
                value={discount}
                onChange={(val) => setDiscount(val.target.value)}
              />
            </div>
            <div className="sm:col-span-1 lg:col-span-3">
              <PublishDateInput
                label="Publish Date"
                value={publishDate}
                onChange={(val) => setPublishDate(val.target.value)}
              />
            </div>
            <div className="sm:col-span-1 lg:col-span-3">
              <PublishDateTimeInput
                label="Publish Time"
                value={publishTime}
                onChange={(val) => setPublishTime(val.target.value)}
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
                options={[
                  "IPhone",
                  "Samsung",
                  "Nokia",
                  "Leang",
                  "Koy10",
                  "HiKer",
                ]}
                placeholder="Tag"
                label="Product Tag"
                onChange={(newSelected) => setTag(newSelected)}
                value={tag}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-end">
          <PrimaryButton type="submit" label="Save Product" />
        </div>
      </form>
      <div>
        <ButtonWithEmoji label="Toaster" onClick={hanldeTestToaster} />
      </div>
    </div>
  );
};

export default CreateProduct;
