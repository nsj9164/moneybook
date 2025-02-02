const overDate = (day) => {
  return day > 31 ? day % 31 : day;
};

export const getCardBillingPeriod = (billingDate) => {
  let startDay = 16 + billingDate;
  let endDay = startDay - 1;

  startDay = overDate(startDay);
  endDay = overDate(endDay);

  return {
    start: startDay,
    end: endDay,
  };
};
