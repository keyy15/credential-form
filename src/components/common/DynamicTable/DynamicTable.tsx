import React, { useEffect, useState } from "react";
import { FaRegTrashAlt, FaRegHeart } from "react-icons/fa";
import { DEFAULT_IMG, toAbs } from "../../../utils/image";

interface Column {
  header: string | React.ReactNode;
  accessor: string;
  width?: string;
  color?: string;
  currency?: boolean;
  headerClass?: string;
  bodyColor?: string;
  editable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DynamicTableProps {
  columns: Column[];
  data: any[] | null;
  isEditMode?: boolean;
  classname?: string;
  actions?: Record<
    string,
    {
      label?: string;
      icon?: React.ReactNode;
      onClick?: (row: any) => void;
      colorClass?: string;
    }
  >;
  onEdit?: (rowIndex: number, accessor: string, newValue: any) => void;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data = [],
  isEditMode = false,
  actions = {},
  classname,
  onEdit,
}) => {
  const [localData, setLocalData] = useState<any[]>(data || []);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  const handleCommitEdit = (ri: number, accessor: string, newValue: any) => {
    const updated = [...localData];
    updated[ri] = { ...updated[ri], [accessor]: newValue };
    setLocalData(updated);
    setEditingCell(null);

    // notify parent
    onEdit?.(ri, accessor, newValue);
  };

  return (
    <div className={`relative h-fit max-w-full overflow-x-auto ${classname}`}>
      <table className="min-w-[760px] text-sm text-left md:min-w-full">
        <thead className="sticky h-fit top-0 py-4 bg-white dark:bg-[#111827] border-b border-b-[#ecf3fb] dark:border-b-[#2d3748]">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{ width: col.width }}
                className={`px-4 py-2 font-medium text-[#212b37] dark:text-[#e5e7eb] ${col.color || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="min-h-screen overflow-auto">
          {localData && localData?.length > 0 ? (
            localData.map((row, ri) => (
              <tr key={ri} className="border-b border-b-[#ecf3fb] dark:border-b-[#2d3748]">
                {columns.map((col, ci) => {
                  if (col.accessor === "name") {
                    return (
                      <td key={ci} className="px-4 py-2">
                        <div className="flex items-center gap-2 py-2">
                          <div className="w-[80px] h-[80px] rounded-sm bg-[#F9F9FA] dark:bg-[#1f2937] leading-[5rem] p-2">
                            <img
                              src={toAbs(row?.image) || DEFAULT_IMG}
                              alt={row?.image || "No image available"}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="text-[14px] text-[#0A0A0A] dark:text-white font-bold">
                                {row?.name}
                              </h4>
                              <span className="bg-[#FF8E6F] text-center text-white text-[9px] px-[7.2px] py-[4px] rounded-sm">
                                20% Off
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-[#6E829F] dark:text-[#cbd5f5] text-sm font-bold">
                                <span className="text-[#212B37] dark:text-white text-sm font-normal">
                                  Size :
                                </span>{" "}
                                13"
                              </span>
                              <span className="text-[#6E829F] dark:text-[#cbd5f5] text-sm font-bold">
                                <span className="text-[#212B37] dark:text-white text-sm font-normal">
                                  Color:
                                </span>{" "}
                                Blue
                              </span>
                            </div>
                            {row.stock > 0 ? (
                              <span className="w-fit text-[#2ECe9E] bg-[#EDFAF5] text-[11px] font-bold px-[7.2px] py-[3px] mt-1 rounded-sm">
                                In Stock
                              </span>
                            ) : (
                              <span className="w-fit text-[#FB4242] bg-[#FFEFED] text-[11px] font-bold px-[7.2px] py-[3px] mt-1 rounded-sm">
                                Out Of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  }

                  if (col.accessor === "item") {
                    return (
                      <td key={ci} className="px-4 py-2">
                        <div className="flex items-center gap-2 py-2">
                          <div className="w-[80px] h-[80px] rounded-sm bg-[#F9F9FA] dark:bg-[#1f2937] leading-[5rem] p-2">
                            <img
                              src={toAbs(row?.image) || DEFAULT_IMG}
                              alt={row?.image || "No image available"}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="text-[14px] text-[#0A0A0A] dark:text-white font-bold">
                                {row?.name}
                              </h4>
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                              <span className="text-[#6E829F] dark:text-[#cbd5f5] text-sm font-semibold">
                                <span className="text-[#212B37] dark:text-white text-sm font-normal">
                                  Size :
                                </span>{" "}
                                13"
                              </span>
                              <span className="text-[#6E829F] dark:text-[#cbd5f5] text-sm font-semibold">
                                <span className="text-[#212B37] dark:text-white text-sm font-normal">
                                  Color:
                                </span>{" "}
                                Blue
                                <span className="bg-[#FF8E6F] text-center text-white text-[9px] px-[7.2px] py-[4px] ml-4 rounded-sm">
                                  20% Off
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  if (col.accessor === "action") {
                    return (
                      <td
                        key={ci}
                        className={`px-4 py-2 ${col.color || ""}`}
                        style={{ width: col.width }}
                      >
                        <div className="flex items-center gap-2">
                          {actions &&
                            Object.entries(actions).map(([key, action]) => (
                              <button
                                key={key}
                                onClick={() =>
                                  action.onClick && action.onClick(row)
                                }
                                className={`flex items-center px-2 py-[0.3rem] text-white text-[12px] rounded cursor-pointer transition duration-200 ${
                                  action.colorClass ||
                                  "bg-blue-500 hover:bg-blue-600"
                                }`}
                                title={action.label}
                              >
                                {action.icon}
                                <span>{action.label}</span>
                              </button>
                            ))}
                        </div>
                      </td>
                    );
                  }

                  const isEditing =
                    editingCell?.row === ri &&
                    editingCell?.col === col.accessor;
                  const value = row[col.accessor];

                  const handleDoubleClick = () => {
                    if (isEditMode && col.editable) {
                      setEditingCell({ row: ri, col: col.accessor });
                      setEditValue(value ?? "");
                    }
                  };

                  return (
                    <td
                      key={ci}
                      className={`px-4 py-2 font-bold text-[#212B37] dark:text-[#e5e7eb] border-[#dee7f1] dark:border-[#374151]
    focus:border-[#5c67f780] focus:bg-[#fff] dark:focus:bg-[#111827]
    focus:shadow-[0px_0px_6px_0px_rgba(92,_103,_247,_0.5)]
    dark:placeholder:text-gray-500 outline-none
    transition duration-200 cursor-default ${col.bodyColor || ""} ${
                        isEditMode && col.editable
                          ? "cursor-pointer hover:bg-[#f9f9fa] dark:hover:bg-[#1f2937]"
                          : ""
                      }`}
                      style={{ width: col.width }}
                      onDoubleClick={handleDoubleClick}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          autoFocus
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => {
                            onEdit?.(ri, col.accessor, editValue);
                            setEditingCell(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCommitEdit(ri, col.accessor, editValue);
                            } else if (e.key === "Escape") {
                              setEditingCell(null);
                            }
                          }}
                          className="w-full border border-transparent rounded px-2 py-1
                                focus:border-[#5c67f780] focus:bg-[#fff] dark:focus:bg-[#111827]
                                focus:shadow-[0px_0px_6px_0px_rgba(92,_103,_247,_0.5)]
                                dark:placeholder:text-gray-500 outline-none
                                transition duration-200 text-sm focus:outline-none"
                        />
                      ) : col.render ? (
                        col.render(value, row)
                      ) : (
                        <span>{col.currency ? `$${value}` : value}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
