import React, {useState} from "react";
import Group from "../../assets/group.png";
import {useNavigate} from "react-router-dom";
import {setCookie} from "../../utils/cookie";
import {AuthService} from "../../services/common/AuthService/AuthService";

export const RegisterForm = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await AuthService.register({name, email, password});

            const {accessToken, user} = response.data;
            if (accessToken) {
                setCookie("accessToken", accessToken, 1);
                setCookie("user", JSON.stringify(user), 1);
                navigate("/dashboard/product");
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-[45%] flex flex-col items-center justify-center text-[#1f2937] dark:text-[#e5e7eb]">
            <div className="w-3/6 h-auto flex flex-start">
                <img
                    src={Group}
                    alt="image"
                    style={{width: "62px", height: "62px"}}
                />
            </div>
            <div
                className="w-3/6 h-fit flex flex-col items-center justify-center"
                style={{marginTop: "18px"}}
            >
                <h2 className="w-full flex items-start text-[32px] font-bold text-[#525252] dark:text-white">
                    Login to your Account
                </h2>
                <p
                    className="w-full items-start text-[#525252] dark:text-[#d1d5db]"
                    style={{fontSize: "14px", lineHeight: "24px"}}
                >
                    See what going on with your business
                </p>
                <div
                    className="w-full flex items-center justify-center gap-4 border-1 border-[#E8E8E8] dark:border-[#374151] bg-white dark:bg-[#1f2937] rounded-lg cursor-pointer"
                    style={{padding: "8px", marginTop: "24px"}}
                >
                    <img
                        src="https://static.vecteezy.com/system/resources/thumbnails/022/484/503/small_2x/google-lens-icon-logo-symbol-free-png.png"
                        alt=""
                        style={{width: "18px", height: "18px"}}
                    />
                    <p className="text-[#828282] dark:text-[#d1d5db] text-sm font-bold">
                        Continue with Google
                    </p>
                </div>
                <span
                    className="w-full flex items-center justify-center text-[12px] text-[#E8E8E8] dark:text-[#4b5563] cursor-auto"
                    style={{marginTop: "32px"}}
                >
          ------------<p className="text-[#a1a1a1] dark:text-[#9ca3af]">or Sign in with Email</p>
          ------------
        </span>
                <div className="w-full h-auto">
                    <form action="" onSubmit={handleRegister} className="w-full" style={{marginTop: "18px"}}>
                        <div className="w-full">
                            <label htmlFor="" className="text-[#828282] dark:text-[#9ca3af] text-sm">
                                Email
                            </label>
                            <input
                                type="text"
                                placeholder="mail@abc.com"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full border border-solid border-[#ded2d9] dark:border-[#374151] bg-white dark:bg-[#111827] text-[#1f2937] dark:text-white rounded placeholder:text-sm dark:placeholder:text-[#6b7280] outline-none "
                                style={{padding: "8px"}}
                            />
                        </div>
                        <div className="w-full" style={{marginTop: "18px"}}>
                            <label htmlFor="" className="text-[#828282] dark:text-[#9ca3af] text-sm">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Name"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="w-full border border-solid border-[#ded2d9] dark:border-[#374151] bg-white dark:bg-[#111827] text-[#1f2937] dark:text-white rounded placeholder:text-sm dark:placeholder:text-[#6b7280] outline-none "
                                style={{padding: "8px"}}
                            />
                        </div>
                        <div className="w-full" style={{marginTop: "18px"}}>
                            <label
                                htmlFor=""
                                className="text-[#828282] dark:text-[#9ca3af] text-sm"
                                style={{marginTop: "12px"}}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="*******"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full border border-solid border-[#ded2d9] dark:border-[#374151] bg-white dark:bg-[#111827] text-[#1f2937] dark:text-white rounded placeholder:text-sm dark:placeholder:text-[#6b7280] outline-none"
                                style={{padding: "8px"}}
                            />
                        </div>
                        <div
                            className="w-full flex items-center justify-between text-[12px]"
                            style={{marginTop: "5px"}}
                        >
                            <div className="flex items-center justify-center gap-1">
                                <input
                                    type="checkbox"
                                    className="accent-[#7f265b] rounded-md outline-none"
                                />
                                <label htmlFor="" className="text-[#a1a1a1] dark:text-[#9ca3af]">
                                    Remember Me
                                </label>
                            </div>
                            <div>
                                <a href="" className="w-1/2 text-[#7f265b] dark:text-[#f472b6] font-bold">
                                    Forgot Password?
                                </a>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#7f265b] hover:bg-[#6b1f4f] dark:bg-[#a855f7] dark:hover:bg-[#9333ea] rounded text-white text-center font-bold cursor-pointer transition"
                            style={{padding: "8px", marginTop: "24px"}}
                        >
                            Register
                        </button>
                    </form>
                </div>
                <div
                    className="w-full h-fit text-[#828282] dark:text-[#9ca3af] font-normal flex items-center justify-center text-sm gap-2"
                    style={{marginTop: "42px"}}
                >
                    <p>Already have an account?</p>
                    <a
                        href="http://localhost:5173/login?"
                        className="text-[#7F265B] dark:text-[#f472b6] cursor-pointer underline font-bold"
                    >
                        Log In
                    </a>
                </div>
            </div>
        </div>
    );
};
