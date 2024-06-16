import React from "react";

const FormField = ({
  labelName,
  placeholder,
  inputType,
  isTextArea,
  value,
  handleChange,
  isDisabled,
  isHidden,
  maxLength,
  minNumber,
  keyDown,
  inputOn,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span
          className="font-14px leading-[22px] text-[#6E717C] mb-[10px] font-medium hidden:collapse"
          hidden={isHidden}
        >
          {labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          disabled={isDisabled}
          hidden={isHidden}
          className="disabled:opacity-75 disabled:hover:border-gray-300 disabled:text-gray-600 disabled:font-bold py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px]  bg-[#ffffff] border-gray-300 focus:border-sky-400 hover:border-sky-400  bg-transparent text-black text-[14px] placeholder:text-gray-400 rounded-[5px] sm:min-w-[300px] font-normal"
        />
      ) : (
        <input
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="1"
          min={minNumber}
          placeholder={placeholder}
          disabled={isDisabled}
          hidden={isHidden}
          maxLength={maxLength}
          onKeyDown={keyDown}
          onInput={inputOn}
          minLength={maxLength}
          className="disabled:opacity-75 disabled:hover:border-gray-300 disabled:text-gray-600 disabled:font-bold py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] bg-[#ffffff] border-gray-300 focus:border-sky-400 hover:border-sky-400  bg-transparent text-black text-[14px] placeholder:text-gray-400 rounded-[5px] sm:min-w-[300px] font-normal"
        />
      )}
    </label>
  );
};

export default FormField;
