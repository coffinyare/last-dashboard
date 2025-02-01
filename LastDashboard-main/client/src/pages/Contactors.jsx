import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import Header from "../components/common/Header";
import ContractorTableWithActions from "../components/Contractors/ContractorsTable";



const Contactors = () => {
  return (
    <div className="flex-1 relative z-10 overflow-y-auto h-screen p-4">
      <Header title={"Contactors"} />
      <ContractorTableWithActions />
    </div>
  );
};

export default Contactors;
