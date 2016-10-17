# api-testing-tool

api-testing-tool is a testing tool which help you auto test all api with your testcase. You can use hudson... to schedule test it

Features:

  - Create testcase with json config
  - Inject variable in testcase to re-use in api (global, response variable...)
  - Inject api template to re-use in testcase
  - Support debug, validate, re-call api to ensure that your api services are fine
  - Support upload multiple files
  - Calculate execution time to run for each other and all
  - Support to export to html document which is APIs specific document
  - Support smart declare document to re-use, less step when you change or update document.
    Can update customize type in doc by add <<float>> at the first line in content
  - Update write log version which you updated on new document
  - GUI is beautiful, easy to use 
  - You can write and inject your module to check or do something else
  - You can temporary disabled some api without remove it in testcase
  - In case, your data need a time to sync before call the next api, we support it too
  - Can pick browser to open when test

api-testing-tool is testing tool which use javascript is base. So you can write testcase, customize by javascript



### Installation

Api-testing-tool requires [Node.js](https://nodejs.org/) v4+ to run.

Download and extract the [latest pre-built release](https://github.com/just4developments/api-testing).

Install the dependencies and devDependencies and start the server.

```sh
$ cd api-testing
$ npm install
```
open testing server which help response our request
```sh
$ npm start
```
play testcase demo
```sh
$ npm test demo
```
Create new project to use in your project
```sh
$ npm run gen "PROJECT NAME"
```

### Todos

 - Write Testcase
 - Run test or debug testcase
 - After test ok, export to HTML doc

### Version

 - 1.0.0 : Initial
 - 1.0.2 : Add check data type function. You can use `instanceof` to validate data type. 

### Checker function

Check http response status must be in your expection
```
{ status : 200 }
or 
{ status: [200, 201] }
```

Check response size (Array or string)
```
{ size: 10 }
or 
{ size: { '=': 10} }
{ size: { '>': 10} }
{ size: { '>=': 10} }
{ size: { '<': 10} }
{ size: { '<=': 10} }
```

Check array or object EQUALS another
```
{ equals: [
    {id: 1, name: 'thanh', age: 20 },
    {id: 2, name: 'bill', age: 22 },
  ] 
}
or 
{ 
  equals: {
    id: 1, 
    name: 'thanh', 
    age: 20 
  }, 
  _apply: {
    birthday: new Date(2016,1 ,1), // append field in equals object
    age: Remove // Remove field age in object equals. This will help if you use variable in checker, you can manual append or remove some fields in it
  } 
}
```

Check array or object NOT EQUALS another
```
{ notEquals: [
    {id: 1, name: 'thanh', age: 20 },
    {id: 2, name: 'bill', age: 22 },
  ] 
}
or 
{ notEquals: {id: 1, name: 'thanh', age: 20 } }
```

Check array CONTAINS other object or array
```
{ contains: [
    {id: 1, name: 'thanh', age: 20 },
    {id: 2, name: 'bill', age: 22 },
  ] 
}
or 
{ contains: {id: 1, name: 'thanh', age: 20 } }
```

Check array is NOT CONTAINS other object or array
```
{ notContains: [
    {id: 1, name: 'thanh', age: 20 },
    {id: 2, name: 'bill', age: 22 },
  ] 
}
or 
{ notContains: {id: 1, name: 'thanh', age: 20 } }
```

Check array, object IN other array
```
{ in: [
    {id: 1, name: 'thanh', age: 20 },
    {id: 2, name: 'bill', age: 22 },
  ] 
}
or 
{ in: {id: 1, name: 'thanh', age: 20 } }
```

Check array, object NOT IN other array
```
{ notIn: [
    {id: 1, name: 'thanh', age: 20 },
    {id: 2, name: 'bill', age: 22 },
  ] 
}
or 
{ notIn: {id: 1, name: 'thanh', age: 20 } }
```

Check data type is INSTANCE OF the type
```
{ equals: String }
or 
{ equals: /\d+/ }
or 
{ equals: Dateable }
or 
{ id: Number, name: Stringable, birthday: Dateable }
```
Data type: 
- `String`: Must be String 
- `Stringable`: String or null
- `Number`: Must be Number
- `Numberable`: Number or null
- `Boolean`: Must be Boolean
- `Booleanable`: Boolean or null
- `Array`: Must be Array
- `Arrayable`: Array or null
- `Object`: Must be Object
- `Objectable`: Object or null 
- `Dateable`: Date or null
- `Date`: Must be Date
- `RegExp`: Must be Regex expression which match string
- `RegExpable`: Regex expression or null
- `Length(5)`: Check array or string length must be = 5
- `Length(1, 4)`: Check array or string length must be >=1 and <=4
- `Length(Any, 4)`: Check array or string length must be <= 4
- `Length(4, Any)`: Check array or string length must be >=4
- `Any`: no check

### Tech

api-testing-tool uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Visual Studio Code] - code editor
* [node.js] - evented I/O for the backend
* [ExpressJS] - fast node.js network app framework
* [unirest] - Lightweight HTTP Request Client Libraries
* [open] - library which help open a file or url in the user's preferred application
* [copy-dir] -  library which help copy template
* [async] - Async is a utility module

And of course api-testing-tool itself is open source with a https://github.com/just4developments/api-testing
 on GitHub.
 
License
----

MIT


**Free Software, Hell Yeah!**
