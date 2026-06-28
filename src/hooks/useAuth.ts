import {getCookie} from "../utils/cookie";
import { jwtDecode } from "jwt-decode";

const roleAliases: Record<string, string> = {
    customer: "user",
    staff: "user",
};

export const isAuthenticated = (): boolean => {
    const token = getCookie("accessToken")
    return !!token
}

export const getUserRole = (): string | null => {
    const token = getCookie('accessToken');

    if(!token) return null;

    try{
        const decoded = jwtDecode<{role: string}>(token);
        const normalizedRole = decoded.role.toLowerCase();
        return roleAliases[normalizedRole] || normalizedRole;
    }catch{
        return null;
    }

}
