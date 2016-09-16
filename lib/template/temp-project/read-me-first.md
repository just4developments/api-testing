##### Guide

#Structure

output/           : Test resut and APIs document will be export to here
testcases/        : Your testcase file
testcases/delcare : Your template api file 
_doc.js           : Declare your APIs document
_main.js          : Global config for project
_utils.js         : Declare your customize utils function
_checker.js       : Declare your customize checkers
_version.md      : Declare changes in the new APIs document


#How to run

1. Only execute and get test result
  npm test "projectName" (OR: npm run test "projectName")
2. Execute test, then want to re-run some api
  npm run debug "projectName"
3. Export to APIs document
  npm run doc "projectName"
4. Create new project
  npm run gen "projectName"
Note: 
  - projectName only need when you not create file "projectName".default yet to set default project which is using.
  Example: Your project name is "MyProject", so you create file MyProject.default in projects folder. 
  Then you only run npm test, npm run doc, npm run debug without project name