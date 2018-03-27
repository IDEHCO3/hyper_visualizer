import axios from 'axios'
import { Layer, OptionsLayer } from './options'


function onEachFeature (feature, layer) {
  if (feature.properties) {
    let result = ''
    for (const [property_name, property_value] of Object.entries(feature.properties)) {
      result += "<p>" + property_name + ": " + property_value + "</p>"
    }
    layer.bindPopup(result)
  }
}

export const loadImageLayer = async (url) => {
  const coordinates = await axios.get(`${url}envelope`)
  const imageUrl = url + '.png'
  const imageBounds = []
  imageBounds.push(coordinates.data.coordinates[0][2].reverse(), coordinates.data.coordinates[0][0].reverse())
  return L.imageOverlay(imageUrl, imageBounds)
}

export const loadVectorLayer = async (url) => {
  const layer = new Layer()
  const getRes = await axios.get(url)
  const optionRes = await axios.options(url)
  layer.enabled = true
  layer.url = url
  layer.json = getRes.data
  layer.options_response = new OptionsLayer(
    optionRes.data['hydra:supportedProperties'],
    optionRes.data['hydra:supportedOperations'],
    optionRes.data['@context'],
    optionRes.data['hydra:iriTemplate']
  ),
  layer.leaflet_layer = L.geoJson(getRes.data, {onEachFeature: onEachFeature})
  layer.optionsLayer = []
  return layer
}

