const fs = require("fs");
const { execSync } = require("child_process");
const { stderr } = require("process");
const { fail } = require("assert");

const productNameMap = {
    "cca": "CC Assembler"
};

let successCount = 0;
let failCount = 0;

fs.readdir(__dirname + "/tests/", (err, testNames) => {
    if (err) {
        console.log(err);
        return;
    }
    
    performTests(testNames);
});

const performTests = testNames => {
    testNames.forEach(name => {
        fs.readdir(`${__dirname}/tests/${name}/inputs/`, (err, filenames) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log(`───────────── testing ${productNameMap[name]} ────────────\n`);
            
            if (name === "cca")
                filenames.map(performTestCCA)

            console.log(`\n──────────── 🔴 ${failCount} tests failed | 🟢  ${successCount} tests passed ────────────`);
        });
    });
};

const performTestCCA = async testName => {
    // compile
    execSync(`cca ./tests/cca/inputs/${testName} -o ./tests/cca/output.ccb`);

    // get strings based on file name
    const ccbName = testName.split(".")[0];
    const testDescription = testName.split(".")[0].split(/(?=[A-Z])/g).join(" ").toLowerCase();

    // read the compiled data and the expected data
    const compiledData = fs.readFileSync(`./tests/cca/output.ccb`);
    const expectedData = fs.readFileSync(`./tests/cca/outputs/${ccbName}.ccb`);
    
    // test if the test failed or not
    let failed = false;
    if (compiledData.length !== expectedData.length)
        failed = true;
    else
        failed = compiledData.find((byte, index) => byte !== expectedData[index]);

    // display results
    if (failed) {
        ++failCount;
        console.log(` 🔴  test failed │ ${testDescription}`);
    } else {
        ++successCount;
        console.log(` 🟢  test passed │ ${testDescription}`);
    }
};