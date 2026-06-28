import React from "react";
import DynamicTable from "../../../components/common/DynamicTable/DynamicTable";
import SelectionFilter from "../../../components/common/SelectionFilter/SelectionFilter";
import SearchField from "../../../components/common/SearchField/SearchField";
import Pagination from "../../../components/common/Pagination/Pagination";
import NumberPagination from "../../../components/common/Pagination/NumberPagination";

const columns = [
  {
    header: "Item",
    accessor: "item",
    width: "40%",
  },
  {
    header: "Tracking ID",
    accessor: "trackingId",
    width: "15%",
    bodyColor: "!text-[#5C67F7] !text-[13px] !font-normal",
  },
  {
    header: "Price",
    accessor: "price",
    width: "15%",
    bodyColor: "!text-[15px] !text-[#212b37] dark:!text-[#e5e7eb] !font-bold",
    currency: true,
  },
  {
    header: "Quantity",
    accessor: "quantity",
    width: "15%",
    bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
  },
  {
    header: "Total Price",
    accessor: "totalPrice",
    width: "15%",
    bodyColor: "!text-[13px] !text-[#212b37] dark:!text-[#e5e7eb] !font-medium",
    currency: true,
  },
];

const data = [
  {
    name: "Wireless Headphones",
    image:
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    trackingId: "TRK123456",
    price: 99.99,
    quantity: 2,
    totalPrice: 199.98,
    stock: 15,
  },
  {
    name: "Smartphone",
    image:
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    trackingId: "TRK654321",
    price: 599.99,
    quantity: 1,
    totalPrice: 599.99,
    stock: 0,
  },
  {
    name: 'Gaming Laptop 15"',
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    trackingId: "TRK112233",
    price: 1299.99,
    quantity: 1,
    totalPrice: 1299.99,
    stock: 8,
  },
  {
    name: "Mechanical Keyboard",
    image:
      "https://images.pexels.com/photos/3829269/pexels-photo-3829269.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    trackingId: "TRK445566",
    price: 79.99,
    quantity: 3,
    totalPrice: 239.97,
    stock: 50,
  },
];

const Orders = () => {
  return (
    <div className="flex h-fit w-full flex-col rounded-lg bg-white shadow-[0px_6px_16px_2px_rgba(0,0,0,0.05)] dark:bg-[#19191C]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#212b37] dark:text-white">
          Order List
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SelectionFilter />
          <SearchField />
        </div>
      </div>
      <DynamicTable columns={columns} data={data} />
      <div className="p-4 flex justify-end">
        <NumberPagination classname="!bg-transparent !shadow-none !p-0" />
      </div>
    </div>
  );
};

export default Orders;
