import React, { useEffect, useRef, useState } from 'react'
import {
  Streamlit,
  withStreamlitConnection
} from "streamlit-component-lib";
import { GoogleCharts } from 'google-charts';

const defaultOptions = {
  'height': '100%',
}

function StreamlitGoogleGeoChart({
  args: {
    googleMapsApiKey,
    data,
    options
  }
}): ReactElement {
  const chartElement = useRef(null)
  const [chart, setChart] = useState()
  const [hasError, setError] = useState()

  useEffect(() => {
    GoogleCharts.load(createChart, {
      'packages': ['geochart'],
      'mapsApiKey': googleMapsApiKey
    });
  }, [])

  useEffect(() => {
    let parsedData
    if (!GoogleCharts.api) return

    try {
      parsedData = GoogleCharts.api.visualization.arrayToDataTable(data)
      setError(false)
      if (hasError)
        Streamlit.setComponentValue({})
    }
    catch (e) {
      if (!hasError) {
        chart.clearChart()
        Streamlit.setComponentValue({ error: "Google Charts: unable to parse data" })
        setError(true)
        Streamlit.setFrameHeight()
      }
    }
    if (chart && parsedData) {
      chart.draw(
        parsedData,
        { ...defaultOptions, ...options }
      )
      GoogleCharts.api.visualization.events.addListener(chart, 'ready', Streamlit.setFrameHeight)
      // This fires very slowly... Let's try to set the height after a
      // short wait in case the above takes too long
      setTimeout(Streamlit.setFrameHeight, 100)
    }
  });

  const createChart = () => {
    setChart(new GoogleCharts.api.visualization.GeoChart(chartElement.current))
  }

  return (
    <div id="chart" ref={chartElement}/>
  );
}

export default withStreamlitConnection(StreamlitGoogleGeoChart)
