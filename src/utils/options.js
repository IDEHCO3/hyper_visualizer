
export  class supportedAttribute {
    constructor(property, required, writeable, readable, isExternal, isUnique, isIdentifier) {
      this.property = property;
      this.required = required;
      this.writeable = writeable;
      this.readable = readable;
      this.isExternal = isExternal;
      this.isUnique = isUnique;
      this.isIdentifier = isIdentifier;
    }
  }
  export class supportedOperation {
    constructor(property, required, writeable, readable, isExternal, isUnique, isIdentifier) {
      this.property = property;
      this.required = required;
      this.writeable = writeable;
      this.readable = readable;
      this.isExternal = isExternal;
      this.isUnique = isUnique;
      this.isIdentifier = isIdentifier;
    }
  }
  export class Context {

  }
  export class iriTemplate {

  }
  export class OptionsLayer {
    constructor(supportedAttributes, supportedOperations, context,  iriTemplate) {
      this.supportedAttributes = supportedAttributes;
      this.supportedOperations = supportedOperations.sort((a,b) => a['hydra:operation'] < b['hydra:operation'] ? -1 : 1);
      this.context = context;
      this.iriTemplate = iriTemplate;
    }
  }
  export class Layer {

    constructor(is_visible, url, json,  options_response, leaflet_layer) {
      this.enabled = is_visible;
      this.json = json;
      this.url = url;
      this.options_response = options_response || [];
      this.leaflet_layer = leaflet_layer;
      this.optionsLayer = [];
    }

     shortName() {
      let arr_url = this.url.split('/');
      let size_arr = arr_url.length;
      if (arr_url[size_arr-1] == "")
        return arr_url[size_arr-2].toUpperCase();
      return arr_url[size_arr-1].toUpperCase();
    }


  }
