<script>
import mapboxgl from "mapbox-gl";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "../stores";

export default {
  name: "Mapbox",
  data() {
    return {
      curMarker: null,
      mapboxgl: {
        accessToken: import.meta.env.VUE_APP_MAPBOX_TOKEN,
      },
      map: null,
      clicked: null,
      searchInputValue: "",
      autocompleteResults: [],
      showAutocomplete: false,
      points: "a",
      startCoordinates: [],
    };
  },
  computed: {
    ...mapState(useMainStore, ["spots", "toCoordinates", "mapStyle", "coordinates"]),
  },
  watch: {
    async searchInputValue(cur) {
      if (!cur) {
        this.curMarker.remove();
        this.curMarker = new mapboxgl.Marker().setLngLat(this.coordinates).addTo(this.map);
        this.getRoute(this.startCoordinates.length ? this.startCoordinates : this.coordinates, this.toCoordinates);
      }
    },
    coordinates(cur, old) {
      if (cur !== old) {
        console.log(cur, old);
        this.curMarker.remove();
        this.curMarker = new mapboxgl.Marker().setLngLat(this.coordinates).addTo(this.map);
        if (this.toCoordinates.length)
          this.getRoute(this.startCoordinates.length ? this.startCoordinates : this.coordinates, this.toCoordinates);
      }
    },
    toCoordinates(cur, old) {
      if (cur !== old) {
        this.getRoute(this.startCoordinates.length ? this.startCoordinates : this.coordinates, cur);
      }
    },
  },
  methods: {
    ...mapActions(useMainStore, ["fetchSpots", "getWeather", "initializeGeolocation"]),
    async changeClicked(num) {
      this.clicked = num;
      await this.fetchSpots(num);
    },
    async getRoute(start, end) {
      if (!end.length) return;
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${this.mapboxgl.accessToken}`,
        { method: "GET" }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      };

      if (this.map.getSource("route")) {
        this.map.getSource("route").setData(geojson);
      } else {
        this.map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }

      // Calculate the bounds of the route manually
      let lngMin = route[0][0];
      let lngMax = route[0][0];
      let latMin = route[0][1];
      let latMax = route[0][1];

      for (const coord of route) {
        lngMin = Math.min(lngMin, coord[0]);
        lngMax = Math.max(lngMax, coord[0]);
        latMin = Math.min(latMin, coord[1]);
        latMax = Math.max(latMax, coord[1]);
      }

      const bounds = [
        [lngMin, latMin],
        [lngMax, latMax],
      ];

      // Calculate the maximum width and height for the map
      // const maxWidth = Math.abs(lngMax - lngMin);
      // const maxHeight = Math.abs(latMax - latMin);

      // Calculate the zoom level based on the maximum size
      const maxScreenSize = Math.min(window.innerWidth, window.innerHeight);
      const zoom = Math.min(Math.log2(maxScreenSize / 500) + 11, 20); // Adjust the "11" to change the initial zoom level

      // Set the map's center and zoom
      this.map.fitBounds(bounds, { padding: 20, maxZoom: zoom });

      // Add turn instructions here at the end
    },
    async initiateMap() {
      await this.initializeGeolocation();
      mapboxgl.accessToken = "pk.eyJ1IjoiaHVpZ2kiLCJhIjoiY2xnYjhxbzdhMXA4ZTNsbzd2Nm80OWsycSJ9.bIZhzPsqKFWtpMgJHDfM7Q";
      this.map = new mapboxgl.Map({
        container: "map",
        style: `mapbox://styles/mapbox/${this.mapStyle}-v11`,
        center: this.coordinates,
        zoom: 11.5,
      });

      this.map.on("load", () => {
        const features = this.spots.map((spot) => ({
          type: "Feature",
          properties: {
            id: 0,
            price: spot.price,
            title: spot.name,
            image: "photo2.jpg",
            description: "spot description",
            color: spot.isRestaurant ? "yellow" : spot.isCafe ? "brown" : spot.isPark ? "green" : "black",
          },
          geometry: { type: "Point", coordinates: [spot.lng, spot.lat] },
        }));

        this.map.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            name: "random_points",
            crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            features,
          },
        });

        this.map.addLayer({
          id: "markers-layer",
          type: "circle",
          source: "points",
          paint: {
            "circle-color": ["get", "color"],
            "circle-radius": 8,
            "circle-stroke-color": "black",
            "circle-stroke-width": 2,
            "circle-stroke-opacity": 0.5,
          },
        });

        this.map.on("click", "markers-layer", (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const title = e.features[0].properties.title;
          const price = e.features[0].properties.price;
          const description = e.features[0].properties.description;
          const image = e.features[0].properties.image;

          this.getRoute(this.startCoordinates.length ? this.startCoordinates : this.coordinates, coordinates);

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `
          <h6 class="card-subtitle mb-2 ">${title}</h6>
        `
            )
            .addTo(this.map);
        });

        this.map.on("mouseenter", "markers-layer", () => {
          this.map.getCanvas().style.cursor = "pointer";
        });

        this.map.on("mouseleave", "markers-layer", () => {
          this.map.getCanvas().style.cursor = "";
        });

        this.curMarker = new mapboxgl.Marker().setLngLat(this.coordinates).addTo(this.map);
        this.map.setCenter(this.coordinates);
      });
    },
    handleInput(event) {
      this.searchInputValue = event.target.value;
      this.fetchAutocompleteResults();
    },
    fetchAutocompleteResults() {
      if (this.searchInputValue.length > 0) {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          this.searchInputValue
        )}.json?access_token=${mapboxgl.accessToken}`;
        fetch(endpoint)
          .then((response) => response.json())
          .then((data) => {
            this.autocompleteResults = data.features;
          })
          .catch((error) => {
            console.error("Error fetching autocomplete results:", error);
          });
      } else {
        this.autocompleteResults = [];
      }
    },
    showSuggestions() {
      this.showAutocomplete = true;
    },
    hideSuggestions() {
      setTimeout(() => {
        this.showAutocomplete = false;
      }, 200);
    },
    selectSuggestion(suggestion) {
      this.searchInputValue = suggestion.place_name;
      this.showAutocomplete = false;

      this.startCoordinates = suggestion.center;
      this.curMarker.remove();
      this.curMarker = new mapboxgl.Marker().setLngLat(this.startCoordinates).addTo(this.map);
      if (this.toCoordinates) this.getRoute(this.startCoordinates, this.toCoordinates);

      this.map.flyTo({
        center: suggestion.center,
        zoom: 12,
      });
    },
  },
  async mounted() {
    await this.getWeather();
    await this.initiateMap();
  },
};
</script>

<template>
  <div>
    <div>
      <div class="flex justify-between pb-4">
        <form class="form flex-grow mx-4">
          <button>
            <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                stroke-width="1.333"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
          </button>
          <input
            v-model="searchInputValue"
            ref="searchInput"
            class="input h-8 p-2 rounded-xl w-80"
            placeholder="Start from location"
            @input="handleInput"
            @focus="showSuggestions"
            @blur="hideSuggestions" />
          <button class="reset" @click.prevent="searchInputValue = ''" type="reset">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </form>
        <div v-if="showAutocomplete" @click.stop="selectSuggestion('ajdb')" class="fixed mt-10 z-[200] bg-slate-100">
          <button
            v-for="(suggestion, index) in autocompleteResults"
            :key="index"
            class="border"
            v-on:click.stop="selectSuggestion(suggestion)">
            {{ suggestion.place_name }}
          </button>
        </div>
        <div class="flex">
          <a
            class="border-2 border-slate-400 flex flex-col justify-center items-center px-1.5 py-0.5 rounded-l-lg cursor-pointer"
            :class="clicked === 1 ? 'bg-slate-400' : ''"
            @click.prevent="changeClicked(1)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              :stroke="clicked === 1 ? 'white' : '#999fb0'"
              height="20pt"
              width="20pt">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
          </a>
          <a
            class="border-2 border-l-0 flex flex-col justify-center items-center border-slate-400 px-1.5 py-0.5 cursor-pointer"
            :class="clicked === 2 ? 'bg-slate-400' : ''"
            @click.prevent="changeClicked(2)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18pt"
              width="18pt"
              :fill="clicked === 2 ? 'white' : '#999fb0'"
              class="bi bi-cup-hot"
              viewBox="0 0 16 16">
              <path
                fill-rule="evenodd"
                d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6H.5ZM13 12.5a2.01 2.01 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5ZM2.64 13.825 1.123 7h11.754l-1.517 6.825A1.5 1.5 0 0 1 9.896 15H4.104a1.5 1.5 0 0 1-1.464-1.175Z" />
              <path
                d="m4.4.8-.003.004-.014.019a4.167 4.167 0 0 0-.204.31 2.327 2.327 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.31 3.31 0 0 1-.202.388 5.444 5.444 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 3.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8Zm3 0-.003.004-.014.019a4.167 4.167 0 0 0-.204.31 2.327 2.327 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.31 3.31 0 0 1-.202.388 5.444 5.444 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 6.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8Zm3 0-.003.004-.014.019a4.077 4.077 0 0 0-.204.31 2.337 2.337 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.198 3.198 0 0 1-.202.388 5.385 5.385 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 9.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8Z" />
            </svg>
          </a>
          <a
            class="border-2 border-l-0 border-slate-400 flex flex-col justify-center items-center px-1.5 py-0.5 rounded-r-lg cursor-pointer"
            :class="clicked === 3 ? 'bg-slate-400' : ''"
            @click.prevent="changeClicked(3)">
            <svg
              :stroke="clicked === 3 ? 'white' : '#999fb0'"
              :fill="clicked === 3 ? 'white' : '#999fb0'"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="20pt"
              width="20pt"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M412.3 25.99c-.4 0-.8 0-1.2.1-11.5 1.08-24.9 8.11-35.1 18.24-6.8 6.64-11.9 14.49-14.9 22.28l21.1 2.76 10-20.02 4.1 22.01 22.1 3.3-19.6 10.7 3.7 22.07-16.3-15.44-19.8 10.31 9.6-20.19-15.1-14.85c-1.4 3.86-2.2 7.71-2.4 11.37-.4 9.86 4.5 22.07 12.8 31.97 8.2 9.8 19.5 16.9 29.3 18.4 6 .9 17.2.5 23.5-2 3.2-1.2 4.8-2.7 5.3-3.7.5-.9 1-2.2-.7-6.5-2.4-5.7-5.3-9.4-8.4-14-3.1-4.57-6.3-11.54-4.8-19.35 2.4-13.02 12.7-21.57 21.6-28.69 3.4-2.76 6.4-4.8 9.3-6.74-3.6-4.68-8.1-9.55-13.1-13.42-7.1-5.49-14.7-8.72-21-8.61zm37.8 41.46c-.6.45-1.1.88-1.7 1.35-7.7 6.17-14.7 14.92-15.3 17.95-.4 2.39-.1 2.63 2.2 6.15 2.3 3.51 6.7 8.9 10 17.1 2.6 6.1 3.1 12.4 1.6 17.9 5.4-3.1 9.6-8.9 11.8-17.2 2.3-8.8 1.9-19.92-2-30.72-1.7-4.71-4-8.92-6.6-12.53zM316.8 124.6L125.6 286.1l-.2.1c-36.85 28.7-52.19 59.5-54.28 87.2-2.09 27.7 9.16 52.8 27.86 70 18.72 17.3 44.62 26.4 72.02 22.1 4.8-.7 9.6-1.9 14.5-3.5L199 286.3v.7c0-18.2 7.2-33.1 18-42.7 10.9-9.7 25-14.3 39-14.3s28.1 4.6 39 14.3c10.8 9.6 18 24.5 18 42.7v-.7l2.4 31.6 83.9-117.3zm47.6 4.8c-2.4 2.6-5 5.1-7.6 7.6l33.7 31.1c4.3-6.8 9.1-13.7 15-20.6-2.7-.1-5.2-.4-7.5-.7-12.6-1.8-24.1-8.4-33.6-17.4zM256 248c-10 0-19.9 3.4-27 9.7-7.2 6.4-12 15.5-12 29.3v.3L201.7 486h108.6L295 287.3v-.3c0-13.8-4.8-22.9-12-29.3-7.1-6.3-17-9.7-27-9.7zm0 14c13.7 0 25 11.3 25 25s-11.3 25-25 25-25-11.3-25-25 11.3-25 25-25zm0 18c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7zM33.15 444.2l-12.04 13.4s6.53 5.9 15.08 11.5c8.54 5.6 18.74 12.4 31.13 10.3 10.69-1.9 19.81-8.1 27.76-15.9a84.43 84.43 0 0 1-8.31-6.9c-1.93-1.8-3.8-3.6-5.59-5.6-6.35 5.8-12.51 9.9-16.85 10.6-1.86.3-11-2.7-18.24-7.5-7.24-4.8-12.94-9.9-12.94-9.9z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="w-[100%] h-[510px] border-8 border-white rounded-xl">
      <div id="map-section">
        <div id="map" class="position-relative rounded-2xl h-[500px]"></div>
      </div>
    </div>
  </div>
</template>

<!-- The rest of your component code remains the same -->

<style scoped>
#map {
  width: 100%;
}
.form button {
  border: none;
  background: none;
  color: #8b8ba7;
}

.form {
  --timing: 0.3s;
  --width-of-input: 200px;
  --height-of-input: 40px;
  --border-height: 2px;
  --input-bg: #ffffff;
  --border-color: #2f2ee9;
  --border-radius: 30px;
  --after-border-radius: 1px;
  position: relative;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 0.8em;
  border-radius: var(--border-radius);
  transition: border-radius 0.5s ease;
  background: var(--input-bg, #fff);
}

.input {
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
}

.form:before {
  content: "";
  position: absolute;
  background: var(--border-color);
  transform: scaleX(0);
  transform-origin: center;
  width: 100%;
  height: var(--border-height);
  left: 0;
  bottom: 0;
  border-radius: 1px;
  transition: transform var(--timing) ease;
}

.form:focus-within {
  border-radius: var(--after-border-radius);
}

input:focus {
  outline: none;
}

.form:focus-within:before {
  transform: scale(1);
}

.reset {
  border: none;
  background: none;
  opacity: 0;
  visibility: hidden;
}

input:not(:placeholder-shown) ~ .reset {
  opacity: 1;
  visibility: visible;
}

.form svg {
  width: 17px;
  margin-top: 3px;
}
</style>
