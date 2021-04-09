const fs = require("fs");

const executers = {
    "cca": "cca %name% -o output.ccb",
    "ccvm": "ccvm %name%"
}

fs.readdir(__dirname + "/tests/cca", (err, filenames) => {
    if (err) {
        console.log(err);
        return;
    }

    performTests(filenames);
});

const performTests = testNames => {
    testNames.forEach(name => {
        fs.readdir(`${__dirname}/tests/${name}/inputs`)
    });
};