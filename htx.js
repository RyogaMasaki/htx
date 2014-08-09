// htX - hypertext transfer - a simple wrapper for XmlHttpRequest
// ver 0.1 - 2014 July - Damian Rogers (damian@sudden-desu.net)

var htx=(function(){

  function submitAsync(req,opts) {    
	  req.onreadystatechange=function() {
	    if(req.readyState==4) complete(req,opts);
    };
    submit(req,opts);
  }

  function submitSync(req,opts) {
    submit(req,opts);
    complete(req,opts);	
  }

  function submit(req,opts) {
    var tosend=null,upmethod=opts.method.toUpperCase(),finalUrl=opts.url;
    
    // check the object type and ONLY flatten non-special objects
    if(opts.data) {
      if(//!opts.data instanceof ArrayBufferView ||
         !opts.data instanceof Blob ||
         !opts.data instanceof Document ||
         !opts.data instanceof FormData) {
        var params=[],p;
        for(p in opts.data) {
          if(opts.data.hasOwnProperty(p)) params.push(encodeURIComponent(p)+'='+encodeURIComponent(opts.data[p]));
            tosend=params.join('&');
        }
      } else {
        tosend=opts.data;
      }
      if(upmethod=='GET' || upmethod=='HEAD') finalUrl+='?'+tosend;
    }
    
    if(opts.reqHeaders) setReqHeaders(req,opts);
    try {
      req.open(opts.method,finalUrl,opts.async,(opts.user?opts.user:null),(opts.password?opts.password:null));
      
      // responseType needs to be set after open has been calle
      // (so that the async option is set)
      /* See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#responseType
      Note: Starting with Gecko 11.0 (Firefox 11.0 / Thunderbird 11.0 / SeaMonkey 2.8), as well as WebKit build 528, these browsers no longer let you use the responseType attribute when performing synchronous requests. Attempting to do so throws an NS_ERROR_DOM_INVALID_ACCESS_ERR exception. This change has been proposed to the W3C for standardization.
      */
      try {
        if(opts.responseType) req.responseType=opts.responseType;
      }
      catch(e) {
        //two errors can happen here:
        // in modern browsers, if type is synchronous, responseType cannot be set, and a DOMException code 15 will be thrown
        // also, safari throws an error if there is an unsupported responseType, including 'json'
        // (the other browsers just ignore an unsupported responseType it instead of throwing an exception)
        
        // if the error is due to Safari's syntax error (DOMException.code==12), ignore it and move on
        // otherwise rethrow the error
        if(e.code!==12) throw e;
      }
      
      if(opts.overrideMimeType) req.overrideMimeType(opts.overrideMimeType);
      
      // Send it off!
      req.send(tosend);
    }
    catch(e) {
      opts.error(e,req);
    }
  }

  function setReqHeaders(req,opts) {
    var rh;
    for(rh in opts.reqHeaders) {
      if(opts.reqHeaders.hasOwnProperty(rh)) {
        req.setRequestHeader(rh,opts.reqHeaders[rh]);
      }
    }
  }

  function complete(req,opts) {
    if(req.status==200) {
      try {
        if(req.getResponseHeader('Content-type')=='application/json' || opts.responseType=='json') req.responseJSON=JSON.parse(req.responseText);
      }
      catch(e) {
        //error with the JSON parse
        req.responseJSON=null;
      }
      
      //change the default return value depending on the specified MIME type or the expected response type, and if the JSON was parsed successfully
      if(
        (opts.overrideMimeType=='application/json' ||
         opts.responseType=='json')
         && req.responseJSON) opts.success(req.responseJSON,req);
      else opts.success(req.response,req);
    }
    else opts.error('HTTP status not OK',req);
  }

  function request(opts) {
    this.req=new XMLHttpRequest();
    this.req.responseJSON=null;
    
    if(opts.timeout) this.req.timeout=opts.timeout;
    if(opts.ontimeout) this.req.ontimeout=opts.ontimeout;
    
    if(opts.async) submitAsync(this.req,opts);
    else submitSync(this.req,opts);
  }

  return function(opts) {
    if(typeof(opts)!=='object') return null;
		if(typeof(opts.success) !== 'function') throw "Invalid type for 'success' property";
    if(typeof(opts.url) !== 'string') throw "Invalid type for 'url' property";
    if(typeof(opts.method) !== 'string') opts.method="GET";
    
    //if(typeof(opts.parseJSON) !== 'boolean') opts.parseJSON=true;
    opts.url=encodeURI(opts.url);
    
    if(typeof(opts.async) !== 'boolean') opts.async=true;
    if(typeof(opts.error) !== 'function') opts.error =
      function(err) {
        throw err;
      }
    new request(opts);
  }
})();
