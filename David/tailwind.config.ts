import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        slate: "#637083",
        mist: "#F5F7FB",
        line: "#E8EBF2",
        violet: "#6C4BFF",
      },
      boxShadow: {
        card: "0 14px 40px rgba(26, 35, 58, 0.08)",
        lift: "0 22px 50px rgba(47, 35, 117, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
