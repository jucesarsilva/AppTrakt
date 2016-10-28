var modules = {};

// root module name
modules.main = "AppTrakt";

// centralized modules
modules.directives = modules.main.concat(".directives");
modules.filters = modules.main.concat(".filters");
modules.services = modules.main.concat(".services");
modules.version = modules.main.concat(".version");

//controllers modules
modules.master = modules.main.concat(".master");
modules.details = modules.main.concat(".details");