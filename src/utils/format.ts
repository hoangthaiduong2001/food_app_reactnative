export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const normalizeQR = (data: string) => {
  return data.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} • ${hours}:${minutes}`;
};
