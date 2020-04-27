class Category {

    constructor(db) {
        this.db = db;
    }

    async validateName(params){
        var flag = false;
        var statusMessage = {
            status:flag,
            info:null
        };

        if (params.name == null || params.name == undefined || params.name == "") {
            statusMessage.info = "Please Provide Category Name";
        }
        else if (params.parent == null || params.parent == undefined || params.parent == "") {
            statusMessage.info = "Please Provide Category level";
        }
        else if (params.parent == "1" && (params.parentValue == null || params.parentValue == undefined || params.parentValue == "") ) {
            statusMessage.info = "Please Provide Parent Category Name";
            
        }
        else {
            statusMessage.status = true;
            statusMessage.info = 'Successful';
        }

        return statusMessage;
    }

    async fetchCategory(params) {
        const db = this.db;

        var statusMessage = {
            status: false,
            info: null
        }

        try {
            const col = db.collection('category');

            let categoryArray = await col.find(params, { '_id': 0, 'name': 1, 'ancestors.value': 1, 'ancestors.name': 1 }).toArray();
            statusMessage.status = true;
            statusMessage.info = categoryArray;
        } catch (error) {
            statusMessage.info = error.errmsg;
        }
        return statusMessage;

    }

    async fetchParentChildCategories(params = null){

        const db = this.db;

        var statusMessage = {
            status: false,
            info: null
        }

        try {
            const col = db.collection('category');

            let subCategories = await col.aggregate([{
                $graphLookup: {
                    from: 'category',
                    startWith: "$value",
                    connectFromField: 'value',
                    connectToField: "parent",
                    as: 'child_category'
                }
            },{
                $project: {
                    _id: 1,
                    name: 1,
                    value: 1,
                    product_id: 1,
                    "child_category._id": 1,
                    "child_category.name": 1,
                    "child_category.value": 1,
                    "child_category.product_id": 1 
            }
            }]).toArray();

         
            statusMessage.status = true;
            statusMessage.info = subCategories;
            
        } catch (error) {
            statusMessage.info = error.errmsg;
        }
        return statusMessage;

    }


    async formatAncestorArray(postData){

        let ancestorArray = [];

        const query = {
            value:postData.parentValue
        }

        var statusMessage = {
            status: false,
            info: null
        }

        try {
            let parentCategory = await this.fetchCategory(query);
            ancestorArray = parentCategory.info.map((element,i)=>{
                let inner = {};
                inner._id = element._id;
                inner.value = element.value;
                inner.name = element.name;
                return inner;
            });
            if (parentCategory.info[0].ancestor.length !== 0){
                ancestorArray = [...parentCategory.info[0].ancestor,...ancestorArray];
            }
            statusMessage.status = true;
            statusMessage.info = ancestorArray;
        } catch (error) {
            statusMessage.info = error.errmsg;
        }
        return statusMessage;

    }

    async addCategory(postData){

        const db = this.db;

        var statusMessage = {
            status:false,
            info:null
        }

        try {
            let validCheck = await this.validateName(postData);

            if(validCheck.status){
                const col = db.collection('category');
                let category = {
                    name: postData.name,
                    value: postData.name.toLowerCase().split(' ').join('_'),
                    parent: null,
                    product_id: null,
                    ancestor: []
                }

                if(postData.parent == "1"){
                    let ancestorArray = await this.formatAncestorArray(postData);
                    category.parent = postData.parentValue;
                    category.ancestor = ancestorArray.info;

                }
                
                let insertResponse = await col.insertOne((category));
                if (insertResponse.result.ok == 1) {
                    // for creating unique index on category name over each document insert
                    let indexCreate = await col.createIndex({ "value": 1 }, { unique: true });
                    if (indexCreate) {
                        statusMessage.status = true;
                        statusMessage.info = "Category Added";
                    }
                }                
            }
            else{
                statusMessage =  validCheck;
            }
            
        } catch (error) {
            statusMessage.info = error.errmsg;
        }

        return statusMessage;
    }
}


module.exports = { Category };