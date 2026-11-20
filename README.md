# Commute Leganes App

Helping you find your way around Leganes, Iloilo, Philippines. 🚙

Built with: 
![HTML](https://img.shields.io/badge/HTML-%23E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-%23663399?logo=css)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-%2306B6D4?logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E?logo=javascript&logoColor=white)
![Preact](https://img.shields.io/badge/Preact-%23673AB8?logo=preact)
![MapLibre](https://img.shields.io/badge/MapLibre-%23396CB2?logo=maplibre)

## Why This Exists

There is no online information on all the existing commute routes within Leganes. This web app intends to show them through a map interface.

## Features

- View all commute routes under the jurisdiction of Leganes
- Route between two points within Leganes with consideration of commute routes 

## Data

All data is collected manually by asking tricycle drivers and commuting the routes themselves. See the [public routes](data/leganes_public_routes.json), [terminals](data/leganes_terminals.json), and [locations](data/leganes_locations.json) files for the last updated date.

[Barangay boundaries](/data/bgysubmuns-municity-603026000.0.01.json) are from James Faeldon's [philippine-json-maps](https://github.com/faeldon/philippines-json-maps).

The [road network](/data/leganes_road_network.json) was exported from [OpenStreetMap](https://www.openstreetmap.org/export), converted to GeoJSON, and manually filtered via [geojson.io](https://geojson.io).

## Changes

Find the latest changes in the [changelog](CHANGELOG.md).

## Contribute

Want to contribute? Please read the [contributer's guide](CONTRIBUTING.md).

## License

This project is licensed under [BSD-3](LICENSE.txt).