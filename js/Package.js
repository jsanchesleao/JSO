function JSO(){}

JSO.Symbol = function(name){
	this.name = name;

	this.class = undefined;
	this.scalar = undefined;
};

JSO.Class = function(pkg, name){
	this.pkg = pkg;
	this.name = name;
};

JSO.Package = function(name){
	this.name = name;
	this.symbols = {};
};

JSO.Package.prototype = {
	"class": function(name){
		if( this.symbols[name] === undefined ) this.symbols[name] = new JSO.Symbol(name);
		this.symbols[name].class = new JSO.Class(name);
	}
}
