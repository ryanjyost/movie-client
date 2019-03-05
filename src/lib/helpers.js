import _ from "lodash";

export const sortArrayByProperty = (array, property, asc = false) => {
  return array.sort((a, b) => {
    a = _.get(a, property);
    b = _.get(b, property);

    if (a > b) {
      return asc ? 1 : -1;
    } else if (b > a) {
      return asc ? -1 : 1;
    } else {
      return 0;
    }
  });
};
