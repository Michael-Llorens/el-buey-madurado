// FooterSocial.jsx
import React from "react";
import { FaInstagram, FaFacebookF, FaEnvelope } from "react-icons/fa";
import SocialButton from "./SocialButtom";

export default function FooterSocial() {
  return (
    <div className="flex gap-5">
      <SocialButton href="https://instagram.com/restaurante_el_buey_madurado" ariaLabel="Instagram">
        <FaInstagram className="text-lg" />
      </SocialButton>

      <SocialButton href="https://facebook.com" ariaLabel="Facebook">
        <FaFacebookF className="text-lg" />
      </SocialButton>

      <SocialButton href="mailto:restauranteelbueymadurado@gmail.com" ariaLabel="Email">
        <FaEnvelope className="text-lg" />
      </SocialButton>
    </div>
  );
}
