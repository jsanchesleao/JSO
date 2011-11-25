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
	var parsed_name = name.split(/\./);

	this.qualified_name = parsed_name.join(".");
	this.name = parsed_name.shift();

	if( parsed_name[0] ) this[parsed_name[0]] = new JSO.Package( parsed_name.join(".") );

	window[ this.qualified_name ] = this;
	this.symbols = {};
};

JSO.Package.prototype = {
	"class": function(name){
		if( this.symbols[name] === undefined ) this.symbols[name] = new JSO.Symbol(name);
		this.symbols[name].class = new JSO.Class(name);
	}
}
