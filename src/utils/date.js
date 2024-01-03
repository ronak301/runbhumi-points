import moment from "moment";

export const getDateFormat = (date = new Date()) => {
  return moment(date).format("DD-MMM-YYYY");
};
