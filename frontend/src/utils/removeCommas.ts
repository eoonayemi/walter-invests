export const removeCommas = (amt: string) => {
    if (amt.includes(",")) {
      return amt && amt.replace(",", "");
    }
    return amt;
  };