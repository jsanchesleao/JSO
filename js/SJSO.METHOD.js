SJSO.METHOD = function(name, code){
	this.name = name;
	this.code = code;
	this.install = function(clazz){
		if( !clazz.prototype.meta ) clazz.prototype.meta = [];
		if( !clazz.prototype.meta.methods ) clazz.prototype.meta.methods = {};
		if( clazz.prototype.meta.methods[name] ) throw "Illegal overriding of "+name;
		SJSO.METHOD.save( clazz, this );
	};
	this.overrides = function(clazz){
		if( !clazz.prototype.meta.methods[name] ) throw "No such method to override: "+name;
		SJSO.METHOD.save( clazz, this );
	}
};

SJSO.METHOD.save = function(clazz, sjso_method){
	clazz.prototype.meta.methods.__defineSetter__(sjso_method.name, function(meth){
		clazz.prototype[ sjso_method.name ] = meth.code;
	});
	clazz.prototype.meta.methods.__defineGetter__(sjso_method.name, function(){
		return sjso_method;
	});
	clazz.prototype.meta.methods[sjso_method.name] = sjso_method;
};
