import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { CovidDataService } from '../service/CovidDataService';
import { MapUtils } from '../utils/MaterialUtils';
import CaseCard from './CaseCard';


class CovidMap extends Component {
  static defaultProps = {
    center: {
      lat: 40,
      lng: -95
    },
    zoom: 6
  };

  state = {
      points: {},
      zoomLevel: 6,
      boundary: {} // map boundary
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCGulmSBCeF3P9FVtuHr_3qa4bQlZX4u50" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}

          // once map is rendered, we fetch data; didmount, but this is not our own component
          onGoogleApiLoaded={
              () => {
                  CovidDataService.getAllCountyCases()
                  .then(response => {
                      this.setState({
                          points: MapUtils.convertCovidPoints(response.data)
                      })   

                  }).catch(error => console.log(error));  
              }
          }
          onChange={
            ({ center, zoom, bounds, marginBounds }) => {
                this.setState({
                    zoomLevel: zoom,
                    boundary: bounds
                })
            }
          }
        >
          
            {this.renderCovidPoints()}
          
          
        </GoogleMapReact>
      </div>
    );
  }

  renderCovidPoints() {
      let result = []; // list of component
      const zoomLevel = this.state.zoomLevel;
      // 1 - 4 nation
      // 5 - 9 state
      // 10 - 20 county
      let pointLevel = "county";
      if (zoomLevel >= 1 && zoomLevel <= 4) {
          pointLevel = "nation";
      }
      else if (zoomLevel >= 5 && zoomLevel <= 9) {
          pointLevel = "state";
      }

      const pointToRender = this.state.points[pointLevel];
      // check api call haven't got any data
      if (!pointToRender) {
          return result;
      }

      if (pointLevel === "county") {
          for (const point of pointToRender) {
              if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)){
                  result.push(
                      <CaseCard 
                        lat={point.coordinates.latitude}
                        lng={point.coordinates.longitude}
                        title={point.province}
                        subtitle={point.county}
                        confirmed={point.stats.confirmed}
                        deaths={point.stats.deaths}
                      />
                  )
              }
          }
      } else if (pointLevel === "state") {
          for (const state in pointToRender) {
              const point = pointToRender[state];
              if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)) {
                  result.push(
                      <CaseCard
                        lat={point.coordinates.latitude}
                        lng={point.coordinates.longitude}
                        title={point.country}
                        subtitle={state}
                        confirmed={point.confirmed}
                        deaths={point.deaths}
                      />
                  )
              }
          }
      }
      return result;
  }
}

export default CovidMap;