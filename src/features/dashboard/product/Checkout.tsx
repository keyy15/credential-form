import React, { useState } from "react";
import ButtonWithEmoji from "../../../components/Button/ButtonWithEmoji/ButtonWithEmoji";
import {
  MdOutlineLocalShipping,
  MdPayment,
  MdOutlineCheckCircleOutline,
  MdOutlinePayment,
} from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { motion } from "framer-motion";
import ShippingCard from "../../../components/common/ShippingCard/ShippingCard";
import ShipAddress from "../../../components/common/ShipAddress/ShipAddress";
import PersonalDetail from "../../../components/Button/PersonalDetail/PersonalDetail";
import FormInput from "../../../components/common/FormField/FormField";
import CheckBox from "../../../components/common/CheckBox/CheckBox";
import CheckBoxRedius from "../../../components/common/CheckBoxRedius/CheckBoxRedius";
import CreditCard from "../../../components/common/CreditCard/CreditCard";
import SummaryCard from "../../../components/common/SummaryCard/SummaryCard";

const Checkout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<string>("UPS");
  const [selectedAddress, setSelectedAddress] = useState<string>("home");
  const [selectedPayment, setSelectedPayment] = useState<string>("card");

  const tabs = [
    { label: "Shipping", icon: <MdOutlineLocalShipping /> },
    { label: "Personal Details", icon: <BsPerson /> },
    { label: "Payment", icon: <MdPayment /> },
    { label: "Complete Order", icon: <MdOutlineCheckCircleOutline /> },
  ];

  return (
    <div className="flex h-fit w-full flex-col justify-between gap-4 xl:flex-row">
      <div className="flex h-fit w-full flex-col rounded bg-white p-[1rem] shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)] dark:bg-[#19191C] xl:basis-9/12">
        <ul className="flex h-fit w-full overflow-x-auto rounded-t border border-b-0 border-dashed border-[#ecf3fb] bg-[#F9F9FA] dark:border-[#2d3748] dark:bg-[#1f2937] sm:justify-around">
          {tabs.map((tab, index) => (
            <li
              key={index}
              onClick={() => setActiveTab(index)}
              className={`group relative min-w-max cursor-pointer p-3 transition-colors duration-300 ${activeTab === index
                ? "border-b-[#5C67F7]"
                : "hover:border-b-[#5C67F7]"
                }`}
            >
              <ButtonWithEmoji
                emoji={tab.icon}
                label={tab.label}
                btnClass={`!bg-transparent text-[13px] font-sans font-semibold transition-colors duration-300 
                  ${activeTab === index
                    ? "!text-[#5C67F7]"
                    : "!text-[#212b37] dark:!text-[#e5e7eb] group-hover:!text-[#5C67F7]"
                  }`}
              />
              <span
                className={`absolute left-1/2 bottom-0 h-[2px] bg-[#5C67F7] transform -translate-x-1/2 transition-all duration-300 ease-in-out
                ${activeTab === index ? "w-full opacity-300" : "w-0 opacity-0"}
                `}
              />
            </li>
          ))}
        </ul>
        {activeTab === 0 && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-fit flex flex-col items-center border border-[#ecf3fb] dark:border-[#2d3748] border-dashed"
          >
            <div className="w-full p-3">
              <p className="text-[#6e829f] dark:text-[#cbd5f5] text-[1.25rem] opacity-50 font-semibold font-sans">
                01
              </p>
              <div className="grid h-fit w-full grid-cols-1 gap-4 md:grid-cols-2">
                <p className="text-[0.9375rem] font-semibold font-sans text-[#212b37] dark:text-white md:col-span-2">
                  Shipping Methods :
                </p>
                <div>
                  <ShippingCard
                    shipImg="https://sprukomarket.com/products/html/bootstrap/xintra/dist/assets/images/ecommerce/png/21.png"
                    shipMethod="UPS"
                    shipDate="Delivered By 11,May 2024"
                    shipPrice={9.99}
                    name="shipping-method"
                    checked={selectedMethod === "UPS"}
                    onChange={() => setSelectedMethod("UPS")}
                  />
                </div>
                <div>
                  <ShippingCard
                    shipImg="https://sprukomarket.com/products/html/bootstrap/xintra/dist/assets/images/ecommerce/png/22.png"
                    shipMethod="USPS"
                    shipDate="Delivered By 22,Nov 2022"
                    shipPrice={10.49}
                    name="shipping-method"
                    checked={selectedMethod === "USPS"}
                    onChange={() => setSelectedMethod("USPS")}
                  />
                </div>
              </div>
              <div className="mt-3 grid h-fit w-full grid-cols-1 gap-4 md:grid-cols-2">
                <p className="text-[0.9375rem] font-semibold font-sans text-[#212b37] dark:text-white md:col-span-2">
                  Shipping Address :
                </p>
                <div>
                  <ShipAddress
                    shipLabel="My Home Address"
                    name="shipping-address"
                    checked={selectedAddress === "home"}
                    onChange={() => setSelectedAddress("home")}
                  />
                </div>
                <div>
                  <ShipAddress
                    shipLabel="Work Place Address"
                    name="shipping-address"
                    checked={selectedAddress === "address"}
                    onChange={() => setSelectedAddress("address")}
                  />
                </div>
              </div>
            </div>
            <div className="w-full p-3 flex justify-end items-end border border-[#ecf3fb] dark:border-[#2d3748] border-b-0 border-r-0 border-l-0 border-dashed">
              <PersonalDetail
                label="Personal Details"
                emoji={<BsPerson />}
                onClick={() => setActiveTab(1)}
              />
            </div>
          </motion.div>
        )}
        {activeTab === 1 && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-fit flex flex-col items-center border border-[#ecf3fb] dark:border-[#2d3748] border-dashed"
          >
            <div className="w-full p-3">
              <p className="text-[#6e829f] dark:text-[#cbd5f5] text-[1.25rem] opacity-50 font-semibold font-sans">
                02
              </p>
              <div className="grid h-fit w-full grid-cols-1 gap-4 md:grid-cols-2">
                <p className="text-[0.9375rem] font-semibold font-sans text-[#212b37] dark:text-white md:col-span-2">
                  Personal Details :
                </p>
                <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
                  <div className="">
                    <FormInput label="First Name" placeholder="First Name" />
                  </div>
                  <div className="">
                    <FormInput label="Last Name" placeholder="Last Name" />
                  </div>
                  <div className="md:col-span-2">
                    <FormInput
                      label="Email"
                      placeholder="smeyhem01@gmail.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FormInput label="Phone no" placeholder="061 87 50 89" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 border border-b-0 border-l-0 border-r-0 border-dashed border-[#ecf3fb] p-3 dark:border-[#2d3748] sm:flex-row sm:items-center sm:justify-between">
              <PersonalDetail
                label="Back To Shipping"
                emoji={<MdOutlineLocalShipping />}
                onClick={() => setActiveTab(0)}
                classname="flex-row-reverse border-none hover:border-black !bg-[#EFF1FE] dark:!bg-[#1f2937] !text-[#5C67F7] hover:!bg-[#5C67F7] hover:!text-[#fff]"
              />
              <PersonalDetail
                label="Continue To Payment"
                emoji={<MdOutlinePayment />}
                onClick={() => setActiveTab(2)}
              />
            </div>
          </motion.div>
        )}
        {activeTab === 2 && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-fit flex flex-col items-center border border-[#ecf3fb] dark:border-[#2d3748] border-dashed"
          >
            <div className="w-full p-3">
              <p className="text-[#6e829f] dark:text-[#cbd5f5] text-[1.25rem] opacity-50 font-semibold font-sans">
                03
              </p>
              <div className="w-full h-fit flex flex-col gap-4">
                <p className="col-span-2 row-start-1 row-end-2 text-[0.9375rem] font-semibold font-sans text-[#212b37] dark:text-white">
                  Payment Details :
                </p>
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <CheckBoxRedius
                    label="Credit/Debit Card"
                    name="payment-select"
                    checked={selectedPayment === "card"}
                    onChange={() => setSelectedPayment("card")}
                  />
                  <CheckBoxRedius
                    label="C.O.D(Cash On Delivery)"
                    name="payment-select"
                    checked={selectedPayment === "cod"}
                    onChange={() => setSelectedPayment("cod")}
                  />
                  <CheckBoxRedius
                    label="UPI Payment"
                    name="payment-select"
                    checked={selectedPayment === "upi"}
                    onChange={() => setSelectedPayment("upi")}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <FormInput
                      label="Card Number"
                      placeholder="1234 5678 9123"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FormInput
                      label="Name On Card"
                      placeholder="HEM PORNLEURAKSMEY"
                    />
                  </div>
                  <div>
                    <FormInput label="Expiration Date" placeholder="08/24" />
                  </div>
                  <div>
                    <FormInput label="CVV" placeholder="123" />
                  </div>
                  <div>
                    <FormInput
                      label="OTP"
                      placeholder="123456"
                      helperText="*Do not share O.T.P with anyone"
                      helperTextClass="text-[#fB4242] font-semibold"
                    />
                  </div>
                  <div className="w-full">
                    <CheckBox
                      label="Save This Card"
                      classname="checked:!bg-[#23CE9E] checked:!border-none"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 grid h-fit w-full grid-cols-1 gap-4 md:grid-cols-2">
                <p className="text-[0.9375rem] font-semibold font-sans text-[#212b37] dark:text-white md:col-span-2">
                  Saved Card :
                </p>
                <div>
                  <CreditCard
                    creditImg="https://sprukomarket.com/products/html/bootstrap/xintra/dist/assets/images/ecommerce/png/26.png"
                    creditLabel="XXXX-XXXX-XXXX-XXXX"
                    creditChecked={true}
                  />
                </div>
                <div>
                  <CreditCard
                    creditImg="https://sprukomarket.com/products/html/bootstrap/xintra/dist/assets/images/ecommerce/png/27.png"
                    creditLabel="XXXX-XXXX-XXXX-XXXX"
                    creditChecked={true}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 border border-b-0 border-l-0 border-r-0 border-dashed border-[#ecf3fb] p-3 dark:border-[#2d3748] sm:flex-row sm:items-center sm:justify-between">
              <PersonalDetail
                label="Back To Personal Info"
                emoji={<MdOutlineLocalShipping />}
                onClick={() => setActiveTab(1)}
                classname="flex-row-reverse border-none hover:border-black !bg-[#EFF1FE] dark:!bg-[#1f2937] !text-[#5C67F7] hover:!bg-[#5C67F7] hover:!text-[#fff]"
              />
              <PersonalDetail
                label="Continue Payment"
                emoji={<MdOutlinePayment />}
                onClick={() => setActiveTab(3)}
              />
            </div>
          </motion.div>
        )}
        {activeTab === 3 && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-fit flex flex-col items-center border border-[#ecf3fb] dark:border-[#2d3748] border-dashed"
          >
            <div className="flex flex-col justify-center items-center p-3 my-3">
              <div className="mb-4">
                <h5 className="text-[#21Ce9e] text-[1.25rem] font-semibold font-sans">
                  Payment Successful...
                </h5>
              </div>
              <div className="mb-4">
                <img
                  src="https://sprukomarket.com/products/html/bootstrap/xintra/dist/assets/images/ecommerce/png/24.png"
                  alt=""
                  className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px]"
                />
              </div>
              <div className="mb-4">
                <p className="mb-1 text-[#212B37] dark:text-white text-[14px] font-medium font-sans">
                  You can track your order with Order Id <b>SPK#1FR</b> from{" "}
                  <a href="" className="underline text-[#e354D4]">
                    Trank Order
                  </a>
                </p>
                <p className="mb-1 text-center text-[#6E829F] dark:text-[#cbd5f5] text-[13px] font-normal font-sans">
                  Thanks for supporting us.
                </p>
              </div>
              <div className="mb-4">
                <ButtonWithEmoji
                  label="Continue Shopping"
                  emoji={<IoCartOutline />}
                  btnClass="!text-[13.7px] !font-semibold flex-row-reverse"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <div className="flex h-fit w-full flex-col rounded bg-white shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)] dark:bg-[#19191C] xl:basis-3/12">
        <div className="flex gap-[0.25rem] p-3 items-center">
          <div className="text-[#212B37] dark:text-white text-[15.2px] font-medium font-sans">
            Order Summary
          </div>
          <span className="flex justify-center items-center text-center text-[#5C67F7] text-[11px] font-medium font-sans bg-[rgba(92,103,247,0.1)] py-[0.25rem] px-[0.45rem] rounded-[50rem]">
            01
          </span>
        </div>
        <div className="p-0">
          <ul className="mb-0 border-0 p-0 list-none flex flex-col">
            <li className="p-3 border border-[#ecf3fb] dark:border-[#2d3748] border-t-0 border-r-0 border-l-0">
              <SummaryCard />
            </li>
            <li className="p-3 border border-[#ecf3fb] dark:border-[#2d3748] border-t-0 border-r-0 border-l-0 border-dashed">
              <SummaryCard />
            </li>
          </ul>
          <div className="p-3 border border-[#ecf3fb] dark:border-[#2d3748] border-t-0 border-r-0 border-l-0 border-dashed">
            <div className="w-full h-fit flex justify-between items-center gap-3">
              <p className="text-[#5C67F7] text-[12px] py-[0.25rem] px-[0.45rem] rounded bg-[rgba(92,103,247,0.1)] font-semibold font-sans">
                Subtotal :
              </p>
              <p className="text-[#21Ce9E] text-[12px] py-[0.25rem] px-[0.45rem] rounded font-medium font-sans">
                COUPON APPLIED
              </p>
            </div>
          </div>
          <div className="p-3 border border-[#ecf3fb] dark:border-[#2d3748] border-t-0 border-r-0 border-l-0 border-dashed">
            <div className="w-full h-fit flex justify-between items-center gap-3 mb-3">
              <p className="text-[#6e829f] dark:text-[#cbd5f5] text-[13px] font-normal font-sans">
                Total
              </p>
              <p className="text-[#212B37] dark:text-white text-[14px] font-bold font-sans">
                $189
              </p>
            </div>
            <div className="w-full h-fit flex justify-between items-center gap-3 mb-3">
              <p className="text-[#6e829f] dark:text-[#cbd5f5] text-[13px] font-normal font-sans">
                Discount
              </p>
              <p className="text-[#21Ce9E] text-[14px] font-bold font-sans">
                10% - $31.8
              </p>
            </div>
            <div className="w-full h-fit flex justify-between items-center gap-3 mb-3">
              <p className="text-[#6e829f] dark:text-[#cbd5f5] text-[13px] font-normal font-sans">
                Delivery Charge
              </p>
              <p className="text-[#Fb4242] text-[14px] font-bold font-sans">
                - $29
              </p>
            </div>
            <div className="w-full h-fit flex justify-between items-center gap-3">
              <p className="text-[#6e829f] dark:text-[#cbd5f5] text-[13px] font-normal font-sans">
                Service Tax (18%)
              </p>
              <p className="text-[#212B37] dark:text-white text-[14px] font-bold font-sans">
                - $45
              </p>
            </div>
          </div>
          <div className="p-3">
            <div className="w-full h-fit flex justify-between items-center gap-3">
              <p className="text-[#212B37] dark:text-white text-[15px] font-normal font-sans">
                Total :
              </p>
              <p className="text-[#212B37] dark:text-white text-[16px] font-bold font-sans">
                $189
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
