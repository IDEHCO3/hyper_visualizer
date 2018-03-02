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

export const loadLayer = (url) => 
	axios.all([axios.get(url), axios.options(url)])
		.then(axios.spread((getRes, optionRes) => {
		  const layer = new Layer()

      layer.enabled = true;
      layer.url = url;
      layer.json = getRes.data;
      layer.options_response = new OptionsLayer(
        optionRes.data['hydra:supportedProperties'],
        optionRes.data['hydra:supportedOperations'],
        optionRes.data['@context'],
        optionRes.data['hydra:iriTemplate']
	    ),
      layer.leaflet_layer = L.geoJson(getRes.data, {onEachFeature: onEachFeature})
      layer.optionsLayer = [];

		  return layer
		 })
		)