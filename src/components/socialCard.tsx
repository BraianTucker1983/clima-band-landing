import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
};

export function SocialCard({ title, subtitle, url, icon }: Props) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      className="
            block
            w-full
            max-w-md
            rounded-xl
            border border-white/10
            bg-white/5
            backdrop-blur-md
            p-5
            transition
            hover:bg-white/10
            hover:shadow-lg hover:shadow-black/30
            cursor-pointer
            "
    >
      <div className="flex flex-col items-center text-center gap-3">
        
        {/* ICONO */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500">
          {icon}
        </div>

        {/* TEXTO */}
        <div>
          <p className="text-sm opacity-70">{title}</p>
          <p className="text-lg font-semibold">{subtitle}</p>
        </div>
      </div>
    </motion.a>
  );
}