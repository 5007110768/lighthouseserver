const CrudProvider = {};

CrudProvider.create = function() {
    console.log('CrudProvider.create');
};

CrudProvider.read = function() {
    console.log('CrudProvider.read', _token);
};

CrudProvider.update = function() {
    console.log('CrudProvider.update');
};

CrudProvider.delete = function() {
    console.log('CrudProvider.delete');
};

module.exports = CrudProvider;