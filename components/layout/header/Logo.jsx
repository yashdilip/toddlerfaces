import Image from "next/image";
import ToddlerfacesIcon from "../../../public/toddlerfaces.png";

const Logo = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          src={ToddlerfacesIcon}
          className="w-12 h-12"
          alt="toddlerfaces"
        >
        </Image>
        <span>toddlerfaces</span>
      </div>
    </>
  )
};

export default Logo;