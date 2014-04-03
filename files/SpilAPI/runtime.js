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

	/**
	 * Proto
	 */
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
		self.branding = {};
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


	Cnds.prototype.apiLoaded = function() {
		return (self.API) ? true : false;
	};

	Cdns.prototype.apiReady = function() {
		return self.apiReady;
	};
	
	Cnds.isPaused = function() {
		return self.gamePaused;
	};

	Cnds.isSplashScreenEnabled = function() {
		return self.API.Branding.getSplashScreen().show;
	};

	pluginProto.cnds = new Cnds();
	
	/**
	 * Actions
	 */

	function _getOutgoingLink(type) {
		if(!self.branding[type]) {
			switch(type) {
				case "logo":
					_getLogo();
				break;
				case "splashScreen":
					_getSplashScreen();
				break;
				default:
					if(!self.branding[type]) {
						self.branding[type] = self.API.branding.getLink(type);
					}
				break; 
			}
		}

		return (self.branding[type].action) ? self.branding[type].action : false;
	}

	function _getLogo() {
		if(!self.branding.logo) {
			self.branding.logo = self.API.branding.getLogo();
		}

		return self.branding.logo;
	}

	function _getSplashScreen() {
		if(!self.branding.splashScreen) {
			self.branding.splashScreen = self.API.branding.getSplashScreen();
		}

		return self.branding.splashScreen;
	}

	function Acts() {};
	
	Acts.prototype.openOutgoingLink = function(type) {
		if(_getOutgoingLink(type)) {
			_getOutgoingLink(type).call(this);
		} else {
			(function() {}).call(this);
		}
	};

	Acts.prototype.requestGamebreak = function() {};

	pluginProto.acts = new Acts();
	
	/**
	 * Expressions
	 */
	function Exps() {};
	
	Exps.prototype.logoVisual = function(ret) {
		var src = (self.branding.logo && self.branding.logo.image) ? self.branding.logo.image : '';
		ret.set_string(src);
	};
	
	pluginProto.exps = new Exps();

}(window));