import _ from "lodash";
import moment from "moment-timezone";

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

export const getNameAbbr = name => {
  return `${name.split(" ")[0]} ${name.split(" ")[1][0]}.`;
};

export const defaultFilterMethod = (filter, row) =>
  String(row[filter.id])
    .toLowerCase()
    .includes(filter.value.toLowerCase());

export const generateReleaseText = (
  releaseDateUnix,
  moviePredictionCutoffDate
) => {
  // console.log("--------------------");
  // console.log("Title", this.props.movie.title);
  const releaseDate = moment.unix(releaseDateUnix);
  const releaseUTC = releaseDate.utc();
  const cutoffDate = moment.unix(moviePredictionCutoffDate).utc();

  // console.log(releaseUTC.format("dddd, MMMM Do YYYY, h:mm:ss a Z"));
  // console.log(cutoffDate.format("dddd, MMMM Do YYYY, h:mm:ss a Z"));
  // console.log("PAST?", releaseDate.isBefore(cutoffDate));

  const timeUnitsUntilCutoff = unit => {
    return cutoffDate.diff(moment.utc().add(14, "days"), unit);
  };

  const daysUntilCutoff = releaseDate.diff(cutoffDate, "days");
  const hoursUntilCutoff = timeUnitsUntilCutoff("hours");
  const minutesUntilCutoff = timeUnitsUntilCutoff("minutes");
  // console.log("Days", daysUntilCutoff);
  // console.log("Hours", hoursUntilCutoff);
  // console.log("Min", hoursUntilCutoff);

  if (releaseDate.isBefore(cutoffDate)) {
    return `1 minute`;
  }

  if (daysUntilCutoff > 0) {
    return `${daysUntilCutoff} day${daysUntilCutoff === 1 ? "" : "s"}`;
  }

  if (hoursUntilCutoff > 0) {
    return `${hoursUntilCutoff} hour${hoursUntilCutoff === 1 ? "" : "s"}`;
  }

  if (minutesUntilCutoff > 0) {
    return `${Math.round(minutesUntilCutoff)} minute${
      minutesUntilCutoff === 1 ? "" : "s"
    }`;
  }

  return `1 minute`;
};
