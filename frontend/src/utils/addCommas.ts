export const addCommas = (value: number | string) => {
    // Handle null or undefined values
    if (value === null || value === undefined) {
      return '0';
    }
  
    // Convert the input to a string
    const valueStr = value.toString();
  
    // Split the string into integer and decimal parts
    const [integerPart, decimalPart] = valueStr.split('.');
  
    // Add commas to the integer part
    let formattedIntegerPart = '';
    for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        formattedIntegerPart = ',' + formattedIntegerPart;
      }
      formattedIntegerPart = integerPart[i] + formattedIntegerPart;
    }
  
    // Combine the formatted integer part and decimal part (if present)
    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  };
  