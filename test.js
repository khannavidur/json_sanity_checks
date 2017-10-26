const
    assert      = require('assert'),
    jsonVal     = require('./index.js'),
    mySchema    = {
                    properties              : [{
                        keyName             : 'name',
                        keyType             : 'string',
                        isMandatory         : true
                    },{
                        keyName             : 'someBool',
                        keyType             : 'boolean',
                        isMandatory         : true
                    },{
                        keyName             : 'age',
                        keyType             : 'number',
                        isMandatory         : true
                    },{
                        keyName             : 'day',
                        keyType             : 'string',
                        isMandatory         : false
                    },{
                        keyName             : 'sArray',
                        keyType             : 'array',
                        isMandatory         : true,
                        type                : 'boolean',
                    },{
                        keyName             : 'a',
                        keyType             : 'array',
                        isMandatory         : true,
                        properties          : [{
                            keyName         : 'name',
                            keyType         : 'string',
                            isMandatory     : true
                        },{
                            keyName         : 'age',
                            keyType         : 'number',
                            isMandatory     : true
                        },{
                            keyName         : 'dummy',
                            keyType         : 'array',
                            isMandatory     : true,
                            properties      : [{
                                keyName     : 'r',
                                keyType     : 'string',
                                isMandatory : true
                            }]
                        }]
                    },{
                        keyName             : 'ab',
                        keyType             : 'object',
                        isMandatory         : true,
                        properties          : [{
                            keyName         : 'name',
                            keyType         : 'string',
                            isMandatory     : true
                        },{
                            keyName         : 'age',
                            keyType         : 'number',
                            isMandatory     : true
                        }]
                    }]
                },
    myTestJson  = {
                    name        : 'Vidur Khanna',
                    someBool    : false,
                    age         : 23,
                    sArray      : [true, false],
                    a           : [{
                                    name    : 'dasdas',
                                    age     : 23,
                                    dummy   : [{
                                        r   : 'sdagdjafsd'
                                    }]
                                }],
                    ab          : {
                                    name    : 'Vidur Khanna',
                                    age     : 23,
                                }
                },
    jV          = new jsonVal();

try {
    assert.equal(jV.validate(mySchema, myTestJson), true);
    console.log('test case passed!');
} catch (assertError) {
    console.error('test cases failed');
}
