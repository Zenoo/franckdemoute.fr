// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import React from "react";

function MoreSection() {
  return (
    <div id="more" className="mb-12 lg:mb-16 relative">
      <div className="order-2 lg:order-1">
        <p className="text-gray-200 text-sm lg:text-lg">
          {personalData.more}
        </p>
      </div>
    </div>
  );
}

export default MoreSection;
