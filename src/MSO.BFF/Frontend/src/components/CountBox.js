import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px] h-auto">
      <h4 className="font-epilogue font-bold text-[30px] text-black p-3  border-2 border-color-gray shadow-lg bg-[#fefefe] rounded-t-[20px] w-full text-center truncate">{value}</h4>
      <p className="font-epilogue font-normal text-[16px] text-gray-100 bg-sky-500 px-3 py-2 w-full rounded-b-[20px] text-center">{title}</p>
    </div>
  )
}

export default CountBox