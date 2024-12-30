const COLORS = {
  primary: "#A4D65E", // Xanh lá chuối
  secondary: "#86B34D", // Xanh lá chuối nhạt hơn
  tertiary: "#52B34D", // Xanh lá chuối trung bình

  lightWhite: "#f8f9fa", // Giữ nguyên
  white: "#f8f9fa", //

  dark: "#3B4A3F", // Xanh lá đậm hơn cho văn bản
  gray: "#9E9E9E", // Màu xám giữ nguyên
  gray2: "#D3D3D3", // Màu xám giữ nguyên 2
};


const FONT = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
