import Image from "next/image";
import ToddlerfacesIcon from "../../../public/toddlerfaces.png";

const Logo = () => {
  return (
      <div className="flex items-center gap-2">
        <Image
          src={ToddlerfacesIcon}
          className="h-10 w-10 rounded-md"
          alt="toddlerfaces"
        >
        </Image>
        <span className="text-base font-bold text-gray-950 dark:text-white">Toddlerfaces</span>
      </div>
  )
};

export default Logo;
