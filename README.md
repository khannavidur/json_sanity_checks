# json_sanity_checks
The first step involved at backend during a REST API call is the validation of request body. This step of sanity checks involves basically two functions

  - JSON Format Validation of request body
  - JSON Data validation

This project is about the first part.

## JSON Format Validation


This step basically consists of validation of two things

  - The parameters satisfy the schema (i.e. string parameters are string, numbers are numbers, arrays are arrays etc.)
  - All the mandatory parameters are present
  


#### The Schema

To check whether the request body satisfies the schema, we must, first of all, create a schema. A sample such schema looks like 

```
{
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
}
```

It starts with a json object with key `properties` which must be an array and consist of objects of key properties at the level, with the key names, key types and their properties.

Each such object must have 2 keys

- keyType
- keyName

`isMandatory` is an optional key.


###### `isMandatory`

Set to true if that key at that level must be present. By default it is set to false.

###### `keyName`

This refers to the name of the key.

###### `keyType`

This refers to the type of the key.The types of keys supported are

`string`

This is for json keys which are expected to have string values. For example
```

{
    name : 'Vidur Khanna'
}

```

`boolean`

This is for json keys which are expected to have boolean values. For example
```

{
    isAlive : true
}

```

`number`

This is for json keys which are expected to have numerical values. For example 
```

{
    age : 1000
}

```

`array`

This is for json keys which are expected to have numerical values. Now arrays could be of three types
 
- array with same type of values. For example
```
{
    ages : [10, 11, 15]
}
``` 
To declare that the expected array is not an array of objects we can set the `type` key to the type of values expected in the array. For example
```
{
    keyName             : 'sArray',
    keyType             : 'array',
    isMandatory         : true,
    type                : 'boolean',
}
```
- array with mixed type of values. For example
```
{
    test : [01, "hello world!", true]
}
```
- array of objects. For example
```
{
    students   : [{
        name   : 's1',
        rollNo : 666
    }]
}
```
To declare that the expected array is an array of objects, we can set the `properties` key at this level with an array of properties. For example
```
{
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
}
```
Here the key a is expected to be an array of object with each object expected to have 3 keys - `name` of type string, `age` of type number and `dummy` of type array of objects with key `r` of type string. A such valid json is

```
{
    a           : [{
        name    : 'dasdas',
        age     : 21,
        dummy   : [{
            r   : 'sdagdjafsd'
        }]
    }]
}
```

`object`

This is for json keys which are expected to have values which are objects(excluding arrays). For example

```
{
    ab          : {
        name    : 'Vidur Khanna',
        age     : 123,
    }
}
```

We can set the properties of this object' children as follows

```
{
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
}
```


#### Exposed Functions

There are two functions exposed

`isValidJsonSchema`

This function is to validate your schema. The only parameter it requires is the schema object. It returns true if the schema is valid else it returns false.


`validate`

This function is to validate the json object against your schema. The parameters it requires are the schema object and the json object to be verified. If the json object satisfies the schema it returns true else it returns an error message like "ab.age was expected to be a number".

#### Dependencies
Lodash and node version >= 6.2.2.
