SJSO.ATTRIBUTE = function(name, ops){
	var _this = this;
	this.name = name;
	this.ops = ops;
	this.value = ops.default;
	this.ops.writer = (ops.writer) ? ops.writer : function(att){ _this.value = att; };
	this.ops.getter = (ops.getter) ? ops.getter : function(){ 
		if( _this.ops.isa == "Number" ) return 1 * _this.value;
		return _this.value; 
	};
	this.writer = function(att){ 
		if( _this.ops.is == 'rw' ){
			if(!SJSO.ATTRIBUTE.validate(_this.ops.isa, att))
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
		return new SJSO.ATTRIBUTE( this.name, this.ops );
	}
};

SJSO.ATTRIBUTE.validate = function( type, att ){
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
};
