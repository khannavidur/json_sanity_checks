const
    /*
        Node Internals
    */
    UTIL        = require('util'),

    /*
        Npm Third Party
    */
    _           = require('lodash'),

    /*
        Global Variables
    */
    TYPE_MAP    = {
                    string          : 'string',
                    number          : 'number',
                    boolean         : 'boolean',
                    array           : 'array',
                    object          : 'object'
                },
    PRIM_ARRAY  = [
                    'string',
                    'number',
                    'boolean'
                ];

class jsonValidator {

    validate(schema, jsonData) {

        if(typeof jsonData !== TYPE_MAP.object)
            return "input not a valid json";

        try{
            checkLevelKeys(schema.properties, jsonData);
        } catch (errorMessage) {
            return errorMessage.message;
        }

        return true;
    }

    isValidJsonSchema(schema) {
        if(!schema.properties || !UTIL.isArray(schema.properties))
            throw new Error('Not a valid schema!');

        const
            mandatorySchemaPropertyKeys = [
                                            'keyName',
                                            'keyType'
                                        ];
        try{
            schema.properties.forEach( (property) => {

                mandatorySchemaPropertyKeys.forEach( (propertyKey) => {
                    if(!_.get(property, propertyKey, null))
                        throw new Error(`${propertyKey} missing`);
                });

                if(property.properties)
                    return isValidJsonSchema(property);
            });
        } catch (error){   
            return false;
        }

        return true;
    }
}

/*
    Util unexposed functions
*/

function checkLevelKeys(properties, jsonData, keyParentLocationArray=[]) {
    if(UTIL.isArray(jsonData)){
        jsonData.forEach( (dataAtom, index) => {
            properties.forEach( (property) => {
                const
                    keyName             = _.get(property,       'keyName',        ''),
                    keyType             = _.get(property,       'keyType',        ''),
                    isMandatory         = _.get(property,       'isMandatory',    false),
                    valueReceived       = _.get(dataAtom,       keyName,          null),
                    keyLocationArray    = _.cloneDeep(keyParentLocationArray);

                keyLocationArray.push(index);
                keyLocationArray.push(keyName);


                if(valueReceived || valueReceived === false)
                    validateType(property, keyType, valueReceived, keyLocationArray);
                else if(isMandatory)
                    throw new Error(`${keyLocationArrayStringCreator(keyLocationArray)} is missing`);
            });
        });
    } else{
        properties.forEach( (property) => {
            const
                keyName             = _.get(property,       'keyName',        ''),
                keyType             = _.get(property,       'keyType',        ''),
                isMandatory         = _.get(property,       'isMandatory',    false),
                valueReceived       = _.get(jsonData,       keyName,          null),
                keyLocationArray    = _.cloneDeep(keyParentLocationArray);

            keyLocationArray.push(keyName);


            if(valueReceived || valueReceived === false)
                validateType(property, keyType, valueReceived, keyLocationArray);
            else if(isMandatory)
                throw new Error(`${keyLocationArrayStringCreator(keyLocationArray)} is missing`);
        });
    }
}

function validateType(property, keyType, valueReceived, keyLocationArray){
    /*
        In case there is an error
        we are already prepared
    */
    const
        errorMessage = makeTypeErrorString(keyLocationArray, keyType),
        errorKeyType = makeTypeErrorString(keyType);

    switch(keyType){

        case TYPE_MAP.string :

            if(typeof valueReceived !== TYPE_MAP.string)
                throw new Error(errorMessage);

            break;

        case TYPE_MAP.number :

            if(typeof valueReceived !== TYPE_MAP.number)
                throw new Error(errorMessage);

            break;

        case TYPE_MAP.boolean :

            if(typeof valueReceived !== TYPE_MAP.boolean)
                throw new Error(errorMessage);

            break;

        case TYPE_MAP.array :

            if(!UTIL.isArray(valueReceived))
                throw new Error(errorMessage);
            if (property.type)
                checkValuesInAnArray(property.type, valueReceived, keyLocationArray);
            else if(property.properties)
                checkLevelKeys(property.properties, valueReceived, keyLocationArray, true);

            break;

        case TYPE_MAP.object :

            if( (typeof valueReceived !== TYPE_MAP.object) || (UTIL.isArray(valueReceived)) )
                throw new Error(errorMessage);

            if(property.properties)
                checkLevelKeys(property.properties, valueReceived, keyLocationArray);

            break;

        default :

            throw new Error(errorKeyType);
    }
}

function makeTypeErrorString(keyLocationArray, expectedKeyType){
    if(expectedKeyType)
        return `${keyLocationArrayStringCreator(keyLocationArray)} was expected to be a ${expectedKeyType}`;
    else
        expectedKeyType = keyLocationArray
        return `${expectedKeyType} not supported in validator`;
}

function keyLocationArrayStringCreator(keyLocationArray){
    return keyLocationArray.join('.');
}

function checkValuesInAnArray(type, data, keyLocationArray){

    if(!PRIM_ARRAY.includes(type))
        throw new Error (`${type} not supported for primitive arrays`); 

    data.forEach( (dataAtom, index) => {
        if(typeof dataAtom !== type){
            keyLocationArray.push(index);
            throw new Error (makeTypeErrorString(keyLocationArray, type));
        }
    });
}

module.exports = jsonValidator;
