import React from 'react'
import ReferTop from "../assets/refer1.svg";
import Copy from "../assets/copy.svg";
import { toast } from 'react-hot-toast';
import Facebook from "../assets/Facebook.svg";
import WhatsApp from "../assets/WhatsApp.svg";
import TwitterX from "../assets/TwitterX.svg";
import Mail from "../assets/Mail.svg";

const RefferalSection = ({refCode}) => {
  function CopyLink() {
    navigator.clipboard.writeText(refCode)
    toast.success("Code Copied");
}
  return (
    <div className="pb-10">
        <img className="h-72 max-sm:h-32 max-sm:mt-0 max-lg:h-64 w-auto -mt-16" src={ReferTop}></img>
        <div className="ml-24 pr-4 max-sm:ml-2 max-sm:w-auto max-sm:pl-4 max-lg:ml-20 max-lg:pl-44 pl-60 pb-8 pt-8 -mt-44 max-sm:-mt-12 w-[88%] max-lg:w-[80%] bg-[#4169E1] text-white rounded-br-[50px] rounded-tr-[50px] rounded-tl-[10px] rounded-bl-[500px] max-lg:rounded-bl-[50px]">
            <div className="text-2xl pb-6">Refer a Friend</div>
            {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu </p> */}
            <div className="leading-[28px] inline-block w-full text-[14px] font-semibold mt-4 p-2 rounded bg-white text-black">
                <div className="float-left ms-2">{refCode}</div>
                <div className="float-right cursor-pointer w-fit hover:bg-[#EAEAEA] pl-2 border text-[14px] font-semibold rounded-[5px] border-black leading-[16.8px] p-1" onClick={CopyLink}>Copy Code <img className="inline-block pl-1 pr-1" src={Copy}></img></div>
            </div>
            <div className="pt-4 grid max-sm:grid-cols-2 grid-cols-4 gap-y-2 gap-x-8 font-semibold">
            <div>
                <div><img className="h-[33.83px] w-[33.83px]" src={Mail}></img></div>
                <div className="text-[14px]">Mail</div>
            </div>
            <div>
                <div><img className="h-[33.83px] w-[33.83px] ml-[12px]" src={Facebook}></img></div>
                <div className="text-[14px]">Facebook</div>
            </div>
            <div>
                <div><img  className="h-[33.83px] w-[33.83px] ml-[16px]" src={TwitterX}></img></div>
                <div className="text-[14px]">Twitter - X</div>
            </div>
            <div>
                <div><img className="h-[33.83px] w-[33.83px] ml-[16px]" src={WhatsApp}></img></div>
                <div className="text-[14px]">WhatsApp</div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default RefferalSection