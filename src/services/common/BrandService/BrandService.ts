import { axiosProductGatewayClient } from "../../api/axiosClient";
import { BrandStats } from "../../../types/BrandType";

const BrandService = {
  getAllBrands: () => axiosProductGatewayClient.get<BrandStats>("/brands"),
};

export default BrandService;
