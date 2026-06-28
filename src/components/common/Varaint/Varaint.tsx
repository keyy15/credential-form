import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Rate from "../Rate/Rate";
import DynamicTable from "../DynamicTable/DynamicTable";
import { Product } from "../../../types/ProductType";
import ButtonWithEmoji from "../../Button/ButtonWithEmoji/ButtonWithEmoji";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { toAbs } from "../../../utils/image";

interface VaraintProp {
  fullDataVaraint?: Product;
  onClose?: () => void;
  onClick?: () => void;
  onVariantChange?: (rowIndex: number, field: string, newValue: any) => void;
}

const Varaint: React.FC<VaraintProp> = ({
  onClose,
  onClick,
  fullDataVaraint,
  onVariantChange,
}) => {
  const [editVaraint, setEditVaraint] = useState<boolean>(false);

  const imageValue = toAbs("/uploads/1759814049488-218117895.jpg");

  const columns = [
    {
      header: "Images",
      accessor: "images",
      width: "6%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
      editable: false,
      render: (value: any, row: any) => (
        <div className="w-[32px] h-[32px]">
          <img
            src={imageValue}
            alt={imageValue}
            className="w-full h-full object-contain rounded"
          />
        </div>
      ),
    },
    {
      header: "SKU",
      accessor: "sku",
      width: "18%",
      bodyColor: "!text-[#5C67F7] !text-[13px] !font-normal",
      color: "!font-bold",
      editable: false,
    },
    {
      header: "Price",
      accessor: "price",
      width: "8%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      currency: true,
      editable: true,
    },
    {
      header: "Stock",
      accessor: "stock",
      width: "7%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      editable: true,
    },
    {
      header: "OnHand",
      accessor: "onHand",
      width: "7%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      editable: true,
    },
    {
      header: "Reserved",
      accessor: "reserved",
      width: "7%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      editable: true,
    },
    {
      header: "SafetyStock",
      accessor: "safetyStock",
      width: "7%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      editable: true,
    },
    {
      header: "Color",
      accessor: "color",
      width: "12%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      editable: true,
    },
    {
      header: "Storage",
      accessor: "storage",
      width: "8%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      editable: true,
    },
    {
      header: "Status",
      accessor: "status",
      width: "10%",
      color: "!font-bold",
      bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb]",
      render: (value: any) => (
        <button className="bg-blue-600 text-white py-1 px-4 rounded cursor-pointer">
          {value}
        </button>
      ),
    },
    // {
    //   header: "Action",
    //   accessor: "action",
    //   width: "10%",
    //   color: "!font-bold",
    //   bodyColor: "!text-[13px] !text-[#212b37]",
    //   editable: false,
    // },
  ];

  const handleEditVaraint = (
    rowIndex: number,
    field: string,
    newValue: any
  ) => {
    console.log("📝 Edit:", { rowIndex, field, newValue });
    onVariantChange?.(rowIndex, field, newValue);
  };

  return (
    <div className="w-[80%] h-fit bg-white dark:bg-[#19191C] rounded">
      <div className="head w-full h-fit flex justify-between items-center p-4 border-b border-b-[#ecf3fb] dark:border-b-[#2d3748]">
        <h4 className="text-lg font-sans font-semibold text-[#212b37] dark:text-white">Varaint</h4>
        <div
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center bg-white/70 dark:bg-[#111827] hover:bg-white/90 dark:hover:bg-[#1f2937] text-[#212B37] dark:text-white border border-gray-200 dark:border-[#374151] rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
        >
          <IoClose className="text-[18px]" />
        </div>
      </div>
      <div className="body w-full h-fit flex flex-col items-center gap-2">
        <div className="w-full h-full flex justify-between p-4 gap-4">
          <div className="w-[40%] h-[220px] rounded bg-[#EFF1FE] dark:bg-[#1f2937]">
            <img
              src={fullDataVaraint?.primaryImage}
              alt={fullDataVaraint?.primaryImage}
              className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="w-[60%] flex flex-col justify-start items-start gap-3">
            <h4 className="text-[#212B37] dark:text-white text-2xl font-sans font-semibold">
              {fullDataVaraint?.name}
            </h4>
            <p className="text-[#212B37] dark:text-[#cbd5f5] text-md font-medium leading-none">
              {fullDataVaraint?.description}
            </p>
            <p className="text-[#212B37] dark:text-white text-3xl font-sans font-medium">
              ${fullDataVaraint?.cost}
              <span className="ml-4 font-normal text-[#7e7d7f] text-xl line-through">
                ${fullDataVaraint?.compareAtPrice}
              </span>
              <span className="ml-3 font-normal text-[#Fb4242] text-lg font-sans">
                -%{fullDataVaraint?.discount}
              </span>
            </p>
            <p className="text-[#212B37] dark:text-[#cbd5f5] text-lg font-sans font-light">
              ID: {fullDataVaraint?.productId}
            </p>
            <Rate
              rating={fullDataVaraint?.ratingCount}
              ratingCount={fullDataVaraint?.ratingCount}
            />
          </div>
        </div>
        <div className="w-full h-fit flex justify-between pl-4 pr-4">
          <ButtonWithEmoji
            label={editVaraint ? "Editing Enabled" : "Enable Edit"}
            onClick={() => setEditVaraint(!editVaraint)}
            btnClass={`flex-row-reverse transition-all duration-300 border !rounded
                    ${
                      editVaraint
                        ? "!bg-[#38D0A2] !border-[#38D0A2] hover:!bg-[#2ECe9E] hover:!border-[#2ECe9E]"
                        : "!bg-gray-300 !border-gray-300 hover:!bg-gray-400"
                    } 
                      !text-white !font-semibold !px-4 !py-[0.45rem]`}
          />
          <ButtonWithEmoji type="submit" label={"Save"} onClick={onClick} />
        </div>
        <div className="w-full h-[400px] rounded bg-white dark:bg-[#19191C] overflow-auto">
          <DynamicTable
            columns={columns}
            data={fullDataVaraint?.variants || []}
            onEdit={handleEditVaraint}
            isEditMode={editVaraint}
            actions={{
              edit: {
                label: "Edit",
                icon: <FaEdit />,
                colorClass:
                  "bg-blue-600 text-white py-1 px-2 gap-1 rounded cursor-pointer",
                onClick: (row) => console.log("edit", row),
              },
              delete: {
                label: "Delete",
                icon: <FaDeleteLeft />,
                colorClass:
                  "bg-blue-600 text-white py-1 px-2 gap-1 rounded cursor-pointer",
                onClick: (row) => console.log("delete", row),
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Varaint;
