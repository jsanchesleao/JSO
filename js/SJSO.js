function SJSO(clazz){
	if(typeof clazz == "string"){
		//eval(clazz+" = function(ops){for(i in ops){this[i] = ops[i];}}; SJSO."+clazz+"="+clazz+";");
		eval(clazz+" = function(ops){"+clazz+".build(this, ops)}; SJSO."+clazz+"="+clazz+";");

		this[ clazz ] = function(func){
			this._clazz.build = func;
			return this;
		};
		this._clazz = SJSO[clazz];
		this._clazz.build = SJSO.DEFAULTBUILD;
		this._clazz.prototype.__defineGetter__("super", function(){ return SJSO[this.meta.super]; });
		this._clazz.prototype.meta = [];
		this._clazz.prototype.meta.attributes = {};
		this._clazz.prototype.meta.methods = {};
		this._clazz.prototype.meta.polymorphic = [ clazz ];
		this._clazz.prototype.toString = function(){ return clazz;};
	}
	else throw "Class name must be a string";
}

SJSO.DEFAULTBUILD = function(obj, ops){
	for(i in ops){
		obj[i] = ops[i];
	}
}

SJSO.prototype = {
	build: function(func){
		this._clazz.build = func;
	},
	has: function(name, ops){
		new SJSO.ATTRIBUTE(name, ops).install( this._clazz );
		return this;
	},
	method: function( name, meth ){
		new SJSO.METHOD(name, meth).install( this._clazz );
		return this;
	},
	"extends": function( name ){
		var _this = this;
		for(var i in SJSO[name].prototype.meta.attributes){
			this.has( i, SJSO[name].prototype.meta.attributes[i].ops );
		}
		for(var i in SJSO[name].prototype.meta.methods){
			if(this._clazz.prototype.meta.methods[i]){
				this.overrides( i, SJSO[name].prototype.meta.methods[i].code );
			}
			else{
				this.method( i, SJSO[name].prototype.meta.methods[i].code );
			}
		}
		SJSO[name].prototype.meta.polymorphic.forEach(function(i){
			_this._clazz.prototype.meta.polymorphic.push(i);
		});
		this._clazz.prototype.meta.super = name;
		return this;
	},
	"static": function( name, value ){
		this._clazz[name] = value;
		return this;
	},
	overrides: function( name, meth ){
		new SJSO.METHOD( name, meth ).overrides( this._clazz );
		return this;
	}
};

function JsClass( name ){
	return new SJSO( name );
}
