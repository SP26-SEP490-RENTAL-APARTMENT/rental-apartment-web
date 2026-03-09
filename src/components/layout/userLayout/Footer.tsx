import { Facebook, Mail, Phone, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center container mx-auto px-4 py-8 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">About Us</h3>
          <p className="text-sm">
            VStay helps you find the best apartments and spaces for your
            needs. Browse, book, and enjoy your stay with us.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <div className="flex items-center gap-2 cursor-pointer">
            <Phone className="w-5 h-5" />
            <a
              className="hover:underline text-[rgb(98,158,255)]"
            >
              +84 123 456 789
            </a>
          </div>
          <div className="flex items-center gap-2 mt-2 cursor-pointer">
            <Mail className="w-5 h-5" />
            <a
              className="hover:underline text-[rgb(98,158,255)]"
            >
              contact@bookingweb.com
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 items-center">
            <a
              className="hover:text-[rgb(98,158,255)]"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              className="hover:text-[rgb(98,158,255)]"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              className="hover:text-[rgb(98,158,255)]"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        © {new Date().getFullYear()} VStay. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
