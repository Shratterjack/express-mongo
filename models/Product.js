
class Product{

    constructor(db){
        this.db = db;
    }

    // generates the primary product ID
    async generateProductId(){
        const db = this.db;

        var statusMessage = {
            status: false,
            info: null
        }

        try {
            const col = db.collection('product');

            let productArray = await col.find({}).toArray();
            let countProduct = productArray.length;

            statusMessage.status = true;
            statusMessage.info = countProduct + 1;
        } catch (error) {
            statusMessage.info = error.errmsg;
        }
        return statusMessage;

    }

    // validates whether all product parameters have been sent properly
    async validateProduct(params) {
        var flag = false;
        var statusMessage = {
            status: flag,
            info: null
        };

        if (params.name == null || params.name == undefined || params.name == "") {
            statusMessage.info = "Please Provide Product Name";
        }
        else if (params.price == null || params.price == undefined || params.price == "") {
            statusMessage.info = "Please Provide Price for Product";
        }
        else if (params.category == null || params.category == undefined || params.category == "") {
            statusMessage.info = "Please Provide Product Category";

        }
        else {
            statusMessage.status = true;
            statusMessage.info = 'Successful';
        }

        return statusMessage;
    }

    // function that returns products filtered by a category
    async getProductsByCategory(params){
        const db = this.db;

        var statusMessage = {
            status: false,
            info: null
        }

        try {
            const col = db.collection('product');

            let productArray = await col.find({"category.name":params.category}).toArray();
            statusMessage.status = true;
            statusMessage.info = productArray;

        } catch (error) {
            statusMessage.info = error.errmsg;
        }
        return statusMessage;
    }

// function to add product in a collection
    async addProduct(postData){
        const db = this.db;

        var statusMessage = {
            status: false,
            info: null
        }

        try {
            let validCheck = await this.validateProduct(postData);

            if (validCheck.status) {
                var productCol = db.collection('product');
                var categoryCol = db.collection('category');

                let product_id = await this.generateProductId();

                let product = {
                    product_id: product_id.info,
                    name: postData.name,
                    price:postData.price,
                    category: []
                }

                let categoryArray = await categoryCol.find({ name: postData.category }, { _id: 0, name: 1, value: 1, ancestor: 0 }).toArray();
                if(categoryArray.length == 0){
                    statusMessage.info = "Category doesn't exist";
                }
                else{
                    let innerArray = {};
                    innerArray.name = categoryArray[0].name;
                    innerArray.value = categoryArray[0].value;
                    product.category.push(innerArray);

                    let insertResponse = await productCol.insertOne((product));
                    if (insertResponse.result.ok == 1) {
                        // for creating unique index on category name over each document insert
                        let indexCreate = await productCol.createIndex({ "product_id": 1 }, { unique: true });
                        if (indexCreate) {
                            statusMessage.status = true;
                            statusMessage.info = "Product Added";
                        }
                    }
                }
            }
            else {
                statusMessage = validCheck;
            }

        } catch (error) {
            statusMessage.info = error.errmsg;
        }

        return statusMessage;
        
    }


}


module.exports = { Product } ;