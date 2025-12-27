import React from "react";
import FooterHorario from "./FooterHorario";
import FooterLegal from "./FooterLegal";
import FooterSocial from "./FooterSocial";
import FooterBottom from "./FooterBottom";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-400 border-t border-gray-800 fade-in">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-center items-center md:items-start gap-40 text-center md:text-left">
        <FooterHorario />
        <FooterLegal />
        <FooterSocial />
      </div>
      <FooterBottom />
    </footer>
  );
}
