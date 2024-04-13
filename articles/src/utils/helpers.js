import { companies } from "./filters";

export const checkCompanyLogo = (company='') => {
  const logoUrl = companies.find((comp) => comp.name === company);
//   console.log("companyLogo", logoUrl);
  return logoUrl?.image || "";
};
