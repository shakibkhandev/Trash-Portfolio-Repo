export type ThemeType = "light" | "dark";

interface ColorScheme {
  text: {
    primary: string;
    secondary: string;
    hover: string;
  };
  background: {
    primary: string;
    secondary: string;
    hover: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  shadow: string;
  social: {
    linkedin: string;
    linkedinHover: string;
    linkedinBg: string;
  };
}

export const Colors: Record<ThemeType, ColorScheme> = {
  light: {
    text: {
      primary: "text-gray-900",
      secondary: "text-gray-600",
      hover: "text-gray-900",
    },
    background: {
      primary: "bg-white",
      secondary: "bg-gray-100",
      hover: "bg-gray-100",
    },
    border: {
      primary: "border-gray-200/50",
      secondary: "border-gray-300",
    },
    shadow: "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
    social: {
      linkedin: "text-gray-600",
      linkedinHover: "text-[#0077b5]",
      linkedinBg: "bg-blue-50/80",
    },
  },
  dark: {
    text: {
      primary: "text-white",
      secondary: "text-gray-400",
      hover: "text-white",
    },
    background: {
      primary: "bg-gray-900/80",
      secondary: "bg-white/10",
      hover: "bg-white/10",
    },
    border: {
      primary: "border-gray-800/50",
      secondary: "border-gray-700",
    },
    shadow: "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    social: {
      linkedin: "text-gray-400",
      linkedinHover: "text-white",
      linkedinBg: "bg-white/10",
    },
  },
};
