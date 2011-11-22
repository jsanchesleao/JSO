function SJSO(clazz){
	if(typeof clazz == "string"){
		eval(clazz+" = function(ops){"+
	"		for(i in ops){"+
	"			this[i] = ops[i];"+
	"		}"+
	"	}; SJSO."+clazz+" = "+clazz+";");
	this._clazz = SJSO[clazz];
	this._clazz.prototype.meta = [];
	this._clazz.prototype.meta.attributes = {};
	this._clazz.prototype.meta.methods = {};
	this._clazz.prototype.meta.polymorphic = [ clazz ];
	this._clazz.prototype.toString = function(){ return clazz;};
	}
}

function SJSO_ATTRIBUTE(name, ops){
	var _this = this;
	this.name = name;
	this.ops = ops;
	this.value = ops.default;
	this.ops.writer = (ops.writer) ? ops.writer : function(att){ _this.value = att; };
	this.ops.getter = (ops.getter) ? ops.getter : function(){ return _this.value; };
	this.writer = function(att){ 
		if( _this.ops.is == 'rw' ){
			if(!SJSO_ATTRIBUTE.validate(_this.ops.isa, att))
				throw "Invalid assignment ["+att+"] into "+_this.ops.isa;
			_this.ops.writer(att); 
		}
		else{
			throw "Cannot write into a not writable attribute";
		}
	};
	this.getter = this.ops.getter;
	this.install = function(clazz){
		clazz.prototype.__defineGetter__( this.name, this.getter );
		clazz.prototype.__defineSetter__( this.name, this.writer );
		if(! clazz.prototype.meta ) clazz.prototype.meta = [];
		if(! clazz.prototype.meta.attributes ) clazz.prototype.meta.attributes = {};
		clazz.prototype.meta.attributes[this.name] = this;
	},
	this.clone = function(){
		return new SJSO_ATTRIBUTE( this.name, this.ops );
	}
}

SJSO_ATTRIBUTE.validate = function( type, att ){
	var possibilities = [];
	if( att.constructor.prototype.meta ){
		possibilities = att.constructor.prototype.meta.polymorphic;	
	}
	else{
		possibilities.push( att.constructor.name );
	}
	for( var i in possibilities ){
		if( type == possibilities[i] ) return true;
	}
	return false;
}

SJSO.prototype = {
	has: function(name, ops){
		new SJSO_ATTRIBUTE(name, ops).install( this._clazz );
		return this;
	},
	method: function( name, meth ){
		if( !this._clazz.prototype.meta ) this._clazz.prototype.meta = [];
		if( !this._clazz.prototype.meta.methods ) this._clazz.prototype.meta.methods = {};
		if( this._clazz.prototype.meta.methods[name] ) throw "Illegal overriding of "+name;
		this._clazz.prototype[name] = meth;
		this._clazz.prototype.meta.methods[name] = meth;
		return this;
	},
	"extends": function( name ){
		for(var i in SJSO[name].prototype.meta.attributes){
			this.has( i, SJSO[name].prototype.meta.attributes[i].ops );
		}
		for(var i in SJSO[name].prototype.meta.methods){
			this.method( i, SJSO[name].prototype.meta.methods[i] );
		}
		this._clazz.prototype.meta.polymorphic.push(name);
		return this;
	},
	"static": function( name, value ){
		this._clazz[name] = value;
		return this;
	},
	override: function( name, meth ){
		if( !this._clazz.prototype.meta.methods[name] ) throw "No such method to override: "+name;
		this._clazz.prototype[name] = meth;
		this._clazz.prototype.meta.methods[name] = meth;
		return this;
	}
};

function JsClass( name ){
	return new SJSO( name );
}
