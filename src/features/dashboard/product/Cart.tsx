import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/common/DynamicTable/DynamicTable";
import QuantityInput from "../../../components/common/QuantityInput/QuantityInput";
import CartService from "../../../services/common/CartService/CartService";
import PrimaryButton from "../../../components/Button/PrimaryButton/PrimaryButton";
import FormField from "../../../components/common/FormField/FormField";
import PromoCodeService from "../../../services/common/PromoCode/PromoCode";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { toAbs, getPrimaryUrl } from "../../../utils/image";
import { FaRegHeart, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/currency";

const Cart = () => {
  const navigator = useNavigate();
  const [cart, setCart] = useState<any[] | null>(null);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountType, setDiscountType] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<string>("");
  const [calSubTotal, setCalSubTotal] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [serviceTax, setServiceTax] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [pickUpCode, setPickUpCode] = useState<string | null>(null);
  const [appliedCode, setAppliedCode] = useState<string>("");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<
    number | null
  >(null);

  useEffect(() => {
    handleFetchCart();
  }, []);

  const columns = [
    {
      header: "Product Name",
      accessor: "name",
      width: "40%",
    },
    {
      header: "Price",
      accessor: "price",
      width: "15%",
      currency: true
    },
    {
      header: "Quantity",
      accessor: "quantity",
      width: "15%",
      render: (value: any, row: any) => (
        <QuantityInput
          value={value}
          min={1}
          max={9999999}
          onChange={(val) => handleQuantityChange(row, val)}
        />
      ),
    },
    {
      header: "Total",
      accessor: "total",
      width: "15%",
      currency: true
    },
    {
      header: "Action",
      accessor: "action",
      width: "25%",
    },
  ];

  const handleQuantityChange = async (row: any, newQty: number) => {
    setCart((prevCart: any) =>
      prevCart.map((item: any) =>
        item.productId === row.productId
          ? { ...item, quantity: newQty, total: newQty * item.price }
          : item
      )
    );

    try {
      await CartService.updateQuantity(row.productId, newQty);
      handleFetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      handleFetchCart();
    }
  };

  const handleFetchCart = async () => {
    try {
      const response = await CartService.getCart();

      const cartItems =
        response?.data?.items?.map((item: any) => {
          const p = item?.product ?? {};
          const rawImages: string[] = Array.isArray(p.images) ? p.images : [];
          const imagesAbs = rawImages.map(toAbs);
          const image = getPrimaryUrl(rawImages, p.primaryImageIndex);

          const pricePerUnit = p?.price || 0;
          const quantityAdded = item?.quantity || 0;

          return {
            productId: p?._id,
            name: p?.name,
            images: imagesAbs,
            primaryImageIndex: Number.isInteger(p?.primaryImageIndex)
              ? p.primaryImageIndex
              : 0,
            image,
            price: pricePerUnit,
            quantity: quantityAdded,
            total: pricePerUnit * quantityAdded,
            stock: p?.stock ?? 0,
          };
        }) || [];

      const promoFromServer = response?.data?.promoCode?.code || "";

      setAppliedCode(promoFromServer);

      setDeliveryFee(response?.data?.delivery?.baseFee || 0);
      setServiceTax(response?.data?.summary?.serviceTax || 0);
      setCalSubTotal(response?.data?.summary?.subTotal || 0);
      setDiscount(response?.data?.summary?.discount || 0);
      setDeliveryMethod(response?.data?.delivery?.method || "");
      setPickUpCode(response?.data?.delivery?.code || null);
      setEstimatedDeliveryTime(response?.data?.delivery?.estimatedDays || null);
      setTotal(response?.data?.summary?.total)
      setCart(cartItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleSwitchDeliveryMethod = async (method: string) => {
    try {
      setDeliveryMethod(method);

      if (method.toLowerCase() !== "pickup") setPickUpCode(null);

      await CartService.selectDeliveryMethod(method);

      // Always re-fetch cart summary from server
      await handleFetchCart();
    } catch (err) {
      console.error("Error switching delivery method:", err);
    }
  };

  const getButtonClass = (method: string) => {
    const isActive = deliveryMethod?.toLowerCase() === method?.toLowerCase();
    return `
      !relative overflow-hidden !w-full !rounded !text-[0.85rem] !px-4 !py-2 font-semibold 
      !bg-[#F7F7FE] dark:!bg-[#1f2937] transition-colors duration-300 ease-in-out
      ${isActive
        ? "!text-[#5F6AF7]"
        : "!text-[#000] dark:!text-white hover:bg-[#5C67FC] hover:!text-[#5F6AF7]"
      }
      before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:h-[2px] 
      before:bg-[#5F6AF7] before:transition-all before:duration-300 before:ease-in-out
      before:-translate-x-1/2 ${isActive ? "before:w-full" : "before:w-0"}
    `;
  };

  const handleApplyPromoCode = async (promoCode: string) => {
    try {
      const { data } = await PromoCodeService.apply(promoCode);
      setDiscountType(data.promo?.discountType);
      setDiscount(Number(data.promo?.discountValue) || 0);
      setDiscountAmount(Number(data.promo?.discountAmount) || 0);

      await handleFetchCart();
    } catch (error: any) {
      console.error("Failed to apply promo code:", error);
      setDiscountType("");
      setDiscount(0);
      setDiscountAmount(0);

      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong. Please try again.";

      alert(message);
    }
  };

  const handleRemovePromo = async () => {
    try {
      await PromoCodeService.removePromoCode();
      handleFetchCart();
    } catch (error) {
      console.error("Error removing promo code:", error);
    }
  };

  const handleAddToWishlist = (row: any) => {
    console.log("Wishlist:", row);
  };

  const handleDeleteCart = async (row: any) => {
    try {
      await CartService.removeCartItem(row?.productId);
      await handleFetchCart();
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-stretch justify-between gap-6 xl:flex-row">
      <div className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-[#19191C] xl:w-3/4">
        <h2 className="p-4 text-[15.2px] text-[#212B37] dark:text-white font-sans font-semibold">
          Cart Items
        </h2>
        <div className="min-w-0 flex-grow overflow-hidden">
          <DynamicTable
            classname="!max-h-[600px] !overflow-y-auto"
            columns={columns}
            data={cart}
            actions={{
              wishlist: {
                icon: <FaRegHeart />,
                colorClass:
                  "!p-2 bg-blue-500 text-white rounded cursor-pointer",
                onClick: (row) => handleAddToWishlist(row),
              },
              delete: {
                icon: <FaRegTrashAlt />,
                colorClass:
                  "!p-2 bg-pink-500 text-white rounded ml-1 cursor-pointer",
                onClick: (row) => handleDeleteCart(row),
              },
            }}
          />
        </div>
      </div>

      <div className="flex h-full w-full flex-none basis-auto flex-col gap-8 rounded-lg bg-white p-4 shadow dark:bg-[#19191C] xl:w-1/4">
        <h4 className="font-medium text-[0.95rem] text-black dark:text-white">Order Summary</h4>

        <div className="flex flex-col mt-4">
          <label className="font-sans text-[13px] text-[#212b37] dark:text-white">Have a Promo Code?</label>
          <span className="text-[#6e829f] dark:text-[#cbd5f5] text-[0.6875rem]">
            Apply Your Promo Code for an Instant Discount!
          </span>
        </div>

        <div className="w-full h-auto flex flex-col py-5 min-h-[1.25rem] border-b border-b-gray-200 border-dashed">
          <div className="flex h-auto w-full">
            <FormField
              className="!w-full !h-full !mt-0 !rounded-l-sm !rounded-r-none"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <PrimaryButton
              onClick={() => handleApplyPromoCode(promoCode)}
              label="Apply"
              className="!bg-[#5C67FC] !rounded-r-sm !rounded-l-none !p-2 !text-[0.85rem]"
            />
          </div>

          {appliedCode && (
            <div className="w-full h-auto">
              <div className="mt-2 flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-2 py-1">
                <div className="text-[12px] text-green-700 font-medium cursor-pointer">
                  Applied: <span className="font-bold">{appliedCode}</span>{" "}
                  {discountType === "percentage"
                    ? `— ${discount}% (-$${discountAmount || 0})`
                    : discountType === "fixed"
                      ? `— -$${discount}`
                      : ""}
                </div>
                <button
                  className="text-[12px] text-green-700 underline decoration-dotted hover:text-green-900"
                  onClick={handleRemovePromo}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col mt-4">
          <h4 className="font-semibold font-sans text-[13px] text-[#212b37] dark:text-white">Delivery:</h4>
          <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-2">
            <PrimaryButton
              label="Standard"
              className={getButtonClass("Standard")}
              onClick={() => handleSwitchDeliveryMethod("Standard")}
            />
            <PrimaryButton
              label="Express"
              className={getButtonClass("Express")}
              onClick={() => handleSwitchDeliveryMethod("Express")}
            />
            <PrimaryButton
              label="Pickup"
              className={getButtonClass("Pickup")}
              onClick={() => handleSwitchDeliveryMethod("Pickup")}
            />
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <div className="flex items-center gap-1 font-medium text-[#6e829f] dark:text-[#cbd5f5] font-sans text-[0.75rem]">
            <BsFillExclamationCircleFill />
            <span>
              {deliveryMethod === "Express"
                ? `Delivered By ${estimatedDeliveryTime} Days`
                : deliveryMethod === "Pickup"
                  ? `Your Pickup Code: ${pickUpCode}`
                  : `Delivered Within ${estimatedDeliveryTime} Days`}
            </span>
          </div>

          <div className="w-full h-auto flex items-center justify-between mt-4">
            <span className="font-medium text-[#6e829f] dark:text-[#cbd5f5] font-sans text-[0.75rem]">
              Sub Total
            </span>
            <span
              key={calSubTotal}

              className="text-[#000] dark:text-white font-semibold font-sans text-[16px]"
            >
              {formatCurrency(calSubTotal) ?? "00"}
            </span>
          </div>

          <div className="w-full h-auto flex items-center justify-between mt-4">
            <span className="font-medium text-[#6e829f] dark:text-[#cbd5f5] font-sans text-[0.75rem]">
              Discount
            </span>
            <span
              key={discountAmount}
              className="font-medium text-[#38D0A2] font-sans text-[0.875rem]"
            >
              {discountType === "percentage"
                ? `${discount}% (-${formatCurrency(discountAmount)})`
                : `-${formatCurrency(discountAmount || discount)}`}
            </span>
          </div>

          <div className="w-full h-auto flex items-center justify-between mt-4">
            <span className="font-medium text-[#6e829f] dark:text-[#cbd5f5] font-sans text-[0.75rem]">
              Delivery Charge
            </span>
            <span
              className="text-[#FB4242] font-semibold font-sans text-[16px]"
            >
              {deliveryFee > 0 ? formatCurrency(deliveryFee) : "$0.00"}
            </span>
          </div>

          <div className="w-full h-auto flex items-center justify-between mt-4">
            <span className="font-medium text-[#6e829f] dark:text-[#cbd5f5] font-sans text-[0.75rem]">
              Service Tax (10%)
            </span>
            <span
              key={serviceTax}
              className="font-medium text-[#000] dark:text-white font-sans text-[0.875rem]"
            >
              {formatCurrency(serviceTax) ?? "00"}
            </span>
          </div>

          <div className="w-full h-auto flex items-center justify-between mt-4">
            <span className="font-medium text-[#212B37] dark:text-white font-sans text-[1rem]">
              Total :
            </span>
            <span
              key={total}
              className="text-[#000] dark:text-white font-semibold font-sans text-[16px]"
            >
              {formatCurrency(total)}
            </span>
          </div>

          <div className="flex flex-col">
            <PrimaryButton
              label="Process To Checkout"
              className="!w-full !bg-[#5C67FC] !text-white !rounded !text-[13.6px] !font-semibold !px-4 !py-2 hover:!bg-[rgba(92,103,247,0.9)] mt-4"
              onClick={() => navigator("/dashboard/product/checkout")}
            />
            <PrimaryButton
              label="Continue Shopping"
              className="!w-full !bg-[#E354D41A] !text-[#E354D4] !rounded !text-[0.85rem] !font-semibold !px-4 !py-2 mt-4 hover:!bg-[#E354D4] hover:!text-white"
              onClick={() => alert("Continue shopping...")}
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default Cart;
