export const parseJSON = <T, F>(str: string, fallback: F): T | F => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};
