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
	
	Cnds.prototype.isPaused = function() {
		return self.gamePaused;
	};

	Cnds.prototype.isSplashScreenEnabled = function() {
		if(self.apiReady) {
			// by default, show the splash screen if the option is not available from the API
			return (self._getSplashScreen() && self._getSplashScreen().show) ? self._getSplashScreen().show : true;
		}
	};

	Cdns.prototype

	pluginProto.cnds = new Cnds();
	
	/**
	 * Actions
	 */

	function _isLinkAvailable(type) {
		if(self.apiReady) {
			return (self.API.Branding.listLinks() && self.API.Branding.listLinks()[type]) ? true : false;
		}
	}

	function _getOutgoingLink(type) {
		if(self.apiReady) {
			if(!self.branding[type]) {
				switch(type) {
					case "logo":
						_getLogo();
					break;
					case "splashScreen":
						_getSplashScreen();
					break;
					default:
						if(!self.branding[type] && _isLinkAvailable(type)) {
							self.branding[type] = self.API.Branding.getLink(type);
						}
					break; 
				}
			}

			return (self.branding[type] && self.branding[type].action) ? self.branding[type].action : false;
		}
	}

	function _getLogo() {
		if(self.apiReady) {
			if(!self.branding.logo) {
				self.branding.logo = self.API.Branding.getLogo();
			}

			return self.branding.logo;
		}
	}

	function _getSplashScreen() {
		if(self.apiReady) {
			if(!self.branding.splashScreen) {
				self.branding.splashScreen = self.API.Branding.getSplashScreen();
			}

			return self.branding.splashScreen;
		}
	}

	function _pauseGame() {
		self.gamePaused = true;
		return true;
	}

	function _resumeGame() {
		self.gamePaused = false;
		return true;
	}

	function Acts() {};
	
	Acts.prototype.openOutgoingLink = function(type) {
		if(_getOutgoingLink(type)) {
			_getOutgoingLink(type).call(this);
		} else {
			// if no link action is available, just execute an empty function
			(function() {}).call(this);
		}
	};

	Acts.prototype.requestGameBreak = function() {
		if(self.apiReady) {
			self.API.GameBreak.request(_pauseGame, _resumeGame);
		}
	};

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