import React from "react";

const CustomButton = ({ btnType, title, handleClick, styles, css }) => {
  return (
    <button
      type={btnType}
      className={`font-semibold text-[16px] leading-[26px] text-white py-2 px-4 rounded-[20px] w-full ${styles}`}
      onClick={handleClick}
      style={css}
    >
      {title}
    </button>
  );
};

export default CustomButton;
