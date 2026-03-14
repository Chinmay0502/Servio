import React from "react";

const Order_Card = () => {
  return (
    <div>
      <div className="lg:w-[15rem] border border-blur-[14px] rounded-2xl p-5  bg-[rgba(20,22,35,0.55)] border-white/20 shadow-primary shadow-md">
        <p className="font-semibold text-primary">Order Id #1243</p>
        <div className="flex justify-between mt-2">
          <p>AC Repair</p>
          <p className="text-red-600">&#8377;599</p>
        </div>
        <div className="flex justify-between mt-1">
          <p>10 Feb 2026</p>
          <p className="text-green-500">Completed</p>
        </div>
      </div>
    </div>
  );
};

export default Order_Card;
