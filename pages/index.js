import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import axios from 'axios';

import Loading from "../components/loading";
import Footer from "../components/footer";
import Head from "../components/head" ;
import Filter from "../components/filter" ;
import LaunchItem from "../components/item" ;
import {generateQueryString, generateUrl, landingSuccess, launchSuccess} from "../utils"
import {pageLimit, FlightTypes} from "../constants"

// styles
import styles from '../styles/Home.module.css';


export const Home = (props) => {
  const router = useRouter();

  const [pageOffset, setPageOffset] = useState(0);
  const [filter, setFilter] = useState(router.query || {});
  const [flights, setFlights] = useState(props.launches || []);
  const [loading, setLoading] = useState(false);

  const fetchLaunches = async (filterConfig, offset = 0, type = FlightTypes.RESET) => {
    try{
      const qs = generateQueryString(filterConfig);
      setLoading(true);
      const resp = await axios.get(generateUrl(pageLimit, qs, offset ));
      const newFlights = type == FlightTypes.PAGINATION ? [...flights, ...resp.data] : resp.data;
      setFlights(newFlights);
      setPageOffset(offset);
    }
    finally{
      setLoading(false)
    }
  };

  const onFilterChange = (newFilter) => {
    setFilter(newFilter);
    router.push(`/?${generateQueryString(newFilter)}`, undefined, { shallow: true });
    setFlights([]);
    fetchLaunches(newFilter);
  };


  
  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeInnerContainer}>
        <Head
          title="SpaceX"
          description="List and browse all launches by SpaceX program."
        />
        <div className={styles.titleContainer}>
          <h1>SpaceX Launch Programs</h1>
        </div>
        <div className={styles.bodyContainer}>
          <div className={styles.filterSectionContainer}>
            <Filter filter={filter} onFilterChange={onFilterChange} />
          </div>
          <div className={styles.listContainer}>
            {flights.map((flight, i) => (
              <div className={styles.listItemContainer} key={i}>
                <LaunchItem
                  missionName={flight.mission_name}
                  flightNumber={flight.flight_number}
                  imageURL={flight.links.mission_patch_small}
                  missionIds={flight.mission_id}
                  launchYear={flight.launch_year}
                  launchSuccess={launchSuccess(flight)}
                  landSuccess={landingSuccess(flight)}
                />
              </div>
            ))}
            <Loading 
                pageLimit={pageLimit} 
                loading={loading} 
                flights={flights} 
                styles={styles}
                onLoadMore={()=>fetchLaunches(filter, pageOffset + pageLimit, FlightTypes.PAGINATION)}
                />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};



Home.getInitialProps = async ({ query }) => {
  const qs = generateQueryString(query);
  const response = await axios.get(generateUrl(pageLimit, qs));
  return { launches: response.data };
};

Home.propTypes = {
  launches: PropTypes.instanceOf(Array)
};

Home.defaultProps = {
  launches: []
};

export default Home;
