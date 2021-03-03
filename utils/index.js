const generateQueryString = (query) =>
  Object.keys(query)
    .map((key) => (query[key] ? `${key}=${query[key]}` : ''))
    .join('&');


function generateUrl(pageLimit, qs, _offset){
  const offset = typeof _offset !== "undefined" ? `&offset=${_offset}` : '';
  return `https://api.spaceXdata.com/v3/launches?limit=${pageLimit}${offset}&${qs}`
}

function landingSuccess(flight){
  const success = flight.rocket.first_stage.cores[0].land_success === null ? '' : `${flight.rocket.first_stage.cores[0].land_success}`
  return success
}

function launchSuccess(flight){
  const success =flight.launch_success === null ? '' : `${flight.launch_success}`
  return success
}


export{
    generateQueryString,
    generateUrl,
    landingSuccess,
    launchSuccess
}