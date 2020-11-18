import streamlit.components.v1 as components
import streamlit as st
import os
from typing import List, Dict

parent_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(parent_dir, "build")

streamlit_google_geochart = components.declare_component(
    "streamlit_google_geochart",
    path=build_dir,
)

def google_geochart(
    google_maps_api_key: str=None,
    data: List[List[any]]=None,
    headers: List[any]=None,
    options: Dict[str, any]=None,
    key: str=None
):
    if google_maps_api_key is None:
        st.error("A Google Maps API key is required to use this component.")
        return

    result = streamlit_google_geochart(
        key=key,
        data=[headers]+data if headers else data,
        googleMapsApiKey=google_maps_api_key,
        options=options,
    )

    if result is not None and "error" in result:
        st.error(result["error"])
