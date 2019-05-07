![node version](https://img.shields.io/badge/node->=10.15-green.svg) ![es version](https://img.shields.io/badge/ES-6-yellow.svg)

![express version](https://img.shields.io/badge/express-4.16.0-red.svg?style=plastic&logo=npm) ![hbs version](https://img.shields.io/badge/hbs-4.0.1-red.svg?style=plastic&logo=npm) ![aws-sdk version](https://img.shields.io/badge/aws--sdk-2.446.0-red.svg?style=plastic&logo=npm) ![exif-parser version](https://img.shields.io/badge/exif--parser-0.1.12-red.svg?style=plastic&logo=npm) ![node-geocoder version](https://img.shields.io/badge/node--geocoder-3.22.0-red.svg?style=plastic&logo=npm)

# Banana-daily

Wanted to build a Progressive Webb App on my own and make use of my AWS Free Tier account.

Randomly pick one picture from a S3 bucket, get its Exif data, reverse-geocode its location, and display it on the UI.

## MVP

- Installable Progressive Webb App with responsive UI
- App Shell Model
- Offline experience
- MVC architecture
- S3 requests
- Get GPS data from picture
- Reverse Geocoding of the GPS data
- In memory cache system
- Auto-registration of Controllers/Routes
- Continuous deployment using AWS CloudPipeline