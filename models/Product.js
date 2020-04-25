
class Product{

    constructor(db){
        this.db = db;
    }

    async validateProduct(params) {
        var flag = false;
        var statusMessage = {
            status: flag,
            info: null
        };

        if (params.name == null || params.name == undefined || params.name == "") {
            statusMessage.info = "Please Provide Category Name";
        }
        else if (params.parent == null || params.parent == undefined || params.parent == "") {
            statusMessage.info = "Please Provide Category level";
        }
        else if (params.parent == "1" && (params.parentValue == null || params.parentValue == undefined || params.parentValue == "")) {
            statusMessage.info = "Please Provide Parent Category Name";

        }
        else {
            statusMessage.status = true;
            statusMessage.info = 'Successful';
        }

        return statusMessage;
    }

    getProductDetails(){

    }

    async addProduct(){

    }

}


module.exports = { Product } ;