// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.SpilAPI = function(runtime) {
	this.runtime = runtime;
};

(function (w) {
	var self,
		typProto,
		pluginProto,
		instanceProto;

	pluginProto = cr.plugins_.SpilAPI.prototype;
		
	pluginProto.Type = function(plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	typeProto = pluginProto.Type.prototype;

	// typeProto.onCreate = function() {};

	pluginProto.Instance = function(type) {
		this.type = type;
		this.runtime = type.runtime;
	};
	
	instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function() {
		self = this;
		self.API = null;
		self.apiReady = false;
		self.apiVersion = null;
		self.gamePaused = false;

		if(w && w.GameAPI) {
			w.GameAPI.loadAPI(function(instance) {
				self.API = instance;
				self.apiReady = self.API.isReady;
				self.apiVersion = self.API.version;

				self.runtime.trigger(cr.plugins_.SpilAPI.prototype.cnds.apiReady, self);
			});
		}
	};
	
	// instanceProto.draw = function(ctx) {};
	// instanceProto.drawGL = function (glw) {};

	/**
	 * Conditions
	 */
	function Cnds() {};

	Cdns.prototype.apiReady = function() {
		return self.apiReady;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}(window));