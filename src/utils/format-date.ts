import { format, parseISO } from "date-fns";

const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  const formattedDate = format(date, "EEE dd LLL yy hh:mm a");
  return formattedDate;
};

export { formatDate };
