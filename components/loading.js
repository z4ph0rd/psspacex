import React from 'react';
import PropTypes from 'prop-types';

export default function Loading({pageLimit, loading, flights, styles, onLoadMore}){
    return (
        <React.Fragment>
            {!loading && flights.length === 0 && (
                <div className={styles.messageContainer}>
                <h4>No Data</h4>
                </div>
            )}
            {loading && (
                <div className={styles.messageContainer}>
                <h4>Loading...</h4>
                </div>
            )}
            {!loading && flights.length >= pageLimit && (
                <div className={styles.loadMoreContainer}>
                <button
                    type="button"
                    onClick={onLoadMore}>
                    Load more
                </button>
                </div>
            )}
        </React.Fragment>
    )
}

Loading.propTypes = {
    loading: PropTypes.bool,
    flights: PropTypes.array,
    pageLimit: PropTypes.number,
    styles: PropTypes.object,
    onLoadMore: PropTypes.func
};
