var exec = require('child_process').exec, child;
var fs = require('fs');
var kill = require('tree-kill');
const { log } = require('util');
var logfilename = __dirname + "\\" + "opc-logs.txt";

var command_to_run = properties.get("DRIVER")
if (!command_to_run) {
    command_to_run = "java -jar OPCClient_NEW.jar"
}
var firstword = command_to_run.split(' ')[0];
console.log(command_to_run)
console.log("program application", firstword)


start = (configId) => {   

    console.log("congigID krishna::",configId);
    clearInfo(`${configId}`);
    fs.closeSync(fs.openSync(logfilename, 'w'));

    var clientId = localStorage.getItem("clientId")

    console.log(command_to_run + ' ' + clientId + ' ' + configId)
    var process = exec(command_to_run + ' ' + clientId + ' ' + configId, { "cwd": __dirname })
    console.log(process)

    fs.closeSync(fs.openSync(__dirname + "\\" + configId + ".pid", 'w'));
    fs.appendFileSync(__dirname + "\\" + configId + ".pid", process.pid.toString() + "\n");

    process.stderr.on('data', function (data) {
        fs.appendFileSync(logfilename, data);
        sendBackInfo(data,configId);
    });

    process.stdout.on('data', function (data) {
        fs.appendFileSync(logfilename, data);
        sendBackInfo(data,configId);
    });
}

test = (form) => {
    clearInfo()
    fs.closeSync(fs.openSync(logfilename, 'w'));
    var clientId = localStorage.getItem("clientId")
    if (form.tags.length > 0) {
        console.log(command_to_run + ' ' + clientId + ' ' + 'TEST' + ' ' + form.OPC_SERVER_USER + ' ' + form.OPC_SERVER_PASS + ' ' + form.OPC_SERVER_HOST + ' ' + form.OPC_SERVER_PROGID + ' ' + form.OPC_SERVER_CLSID + ' ' + form.TAG_PREFIX + ' ' + form.DATA_TAG_TYPE + ' ' + form.SUBSCRIBE_INTERVAL + ' ' + form.tags[0]["dataTagId"] + ' ' + form.tags[0]["PROG_ID_PREFER"])
        var process = exec(command_to_run + ' ' + clientId + ' ' + 'TEST' + ' ' + form.OPC_SERVER_USER + ' ' + form.OPC_SERVER_PASS + ' ' + form.OPC_SERVER_HOST + ' ' + form.OPC_SERVER_PROGID + ' ' + form.OPC_SERVER_CLSID + ' ' + form.TAG_PREFIX + ' ' + form.DATA_TAG_TYPE + ' ' + form.SUBSCRIBE_INTERVAL + ' ' + form.tags[0]["dataTagId"] + ' ' + form.tags[0]["PROG_ID_PREFER"], { "cwd": __dirname })
        console.log(process)
        fs.appendFileSync(__dirname + "\\" + "test.pid", process.pid.toString() + "\n");

        process.stderr.on('data', function (data) {
            fs.appendFileSync(logfilename, data);
            sendBackInfo(data,configId);
        });

        process.stdout.on('data', function (data) {
            fs.appendFileSync(logfilename, data);
            sendBackInfo(data,configId);
        });
    } else {
        sendBackInfo("Please add atleast one tag in the form");
    }

}
stop = (configId) => {
    try {
        var pids = fs.readFileSync(__dirname + "\\" + configId + ".pid").toString();
    } catch (err) {
        // If the type is not what you want, then just throw the error again.
        if (err.code !== 'ENOENT') {
            return;
        }
        return;
        // Handle a file-not-found error
    }
    var count = 0;
    pids.split('\n').map(function (pid) {
        if (pid) {
            console.log(pid);
            kill(parseInt(pid));
            console.log("killed", pid);
            count = count + 1;
            var msg = "\nStopped process with process id " + pid.toString();
            fs.appendFileSync(logfilename, msg);
            sendBackInfo(msg, configId); // Pass configId to sendBackInfo function
        }
    });

    try {
        fs.unlinkSync(__dirname + "\\" + configId + ".pid");
        console.log("PID File is deleted.");
    } catch (error) {
        console.log("Unable to remove this process");
        stopAll(configId);
        console.log("Stopped all OPC instances!");
    }
}


// stop = (configId) => {
//     try {
//         var pids = fs.readFileSync(__dirname + "\\" + configId + ".pid").toString();
//     } catch (err) {
//         // If the type is not what you want, then just throw the error again.
//         if (err.code !== 'ENOENT') {
//             return
//         }
//         return
//         // Handle a file-not-found error
//     }
//     var count = 0
//     pids.split('\n').map(function (pid) {
//         if (pid) {
//             console.log(pid)
//             kill(parseInt(pid))
//             console.log("killed", pid);
//             count = count + 1;
//             var msg = "\nStopped process with process id " + pid.toString();
//             fs.appendFileSync(logfilename, msg);
//             sendBackInfo(msg)
//         }
//     })

//     try {
//         fs.unlinkSync(__dirname + "\\" + configId + ".pid");
//         console.log("PID File is deleted.");
//     } catch (error) {
//         console.log("Unable to remove this process");
//         stopAll()
//         console.log("Stopped all OPC instances!")
//     }

// }

// stopAll = (configId) => {
//     var stop_command = `taskkill /f /im ${firstword}.exe`
//     var x = exec(stop_command);
//     console.log("stopping all")
//     console.log(stop_command, x)
//     var msg = "\nKilled all instances of OPC server";
//     sendBackInfo(msg,configId)
// }


// clearInfo = () => {
//     document.getElementById("pre").innerHTML = ""
// }
stopAll = () => {
    var stop_command = `taskkill /f /im ${firstword}.exe`;
    var x = exec(stop_command);
    console.log("stopping all");
    console.log(stop_command, x);
    var msg = "\nKilled all instances of OPC server";
    sendBackInfo(msg);
}

// stopAll = (configId) => {

//     console.log("congigID stop all wala krishna::",configId);
//     clearInfo(`${configId}`);
//     var stop_command = `taskkill /f /im ${firstword}.exe`;
//     var x = exec(stop_command, (error, stdout, stderr) => {
//         console.log("stopping all");
//         console.log(stop_command, x);
//         var msg = "\nKilled all instances of OPC server";

//         sendBackInfo(msg,`${configId}`); // Pass configId to sendBackInfo function
//     });
// }


clearInfo = (configId) => {
    console.log("clearInfo wala ::::",configId);
    document.getElementById(`${configId}`).innerHTML = "";
}

// stopAll = (configId) => {
//     console.log("congigID stop all wala krishna::",configId);
//     var stop_command = `taskkill /f /im ${firstword}.exe`;
//     var x = exec(stop_command);
//     console.log("stopping all");
//     console.log(stop_command, x);
//     var msg = "\nKilled all instances of OPC server";
//     sendBackInfo(msg);
// }

// stopAll = (configId) => {
//     console.log("congigID stop all wala krishna::", configId);
//     var stop_command = `taskkill /f /im ${firstword}.exe`;
//     var x = exec(stop_command);
//     console.log("stopping all");
//     console.log(stop_command, x);
//     var msg = "\nKilled all instances of OPC server";
//     console.log("stopAll msg::::",msg);
//     sendBackInfo(configId,msg); // Pass configId to sendBackInfo function
// }

// clearInfo = () => {
//     document.getElementById("pre").innerHTML = "";
// }




// sendBackInfo = (data) => {

//     document.getElementById("pre").innerHTML = document.getElementById("pre").innerHTML + data + "<br>";



// sendBackInfo = (data,configId) => {

//     document.getElementById(`${configId}`).innerHTML = document.getElementById(`${configId}`).innerHTML + data + "<br>";

// }

sendBackInfo = (data, configId) => {

    
    const element = document.getElementById(`${configId}`);
    if (element) {
        element.innerHTML = (element.innerHTML || '') + data + "<br>";
    } 
    // else {
    //     console.error(`Element with id ${configId} not found in the DOM.`);
    // }
}


// sendBackInfo = (data, configId) => {
    
//     const preElement = document.getElementById(`${configId}`);
//     // if (preElement) {
//         preElement.innerHTML = preElement.innerHTML + `${data}<br>`;
//     // } else {
//     //     console.error(`Element with id "pre-${configId}" not found.`);
//     // }
// }


// sendBackInfo = (data, configId) => {
//     console.log("andar wala configID:::", configId);
    
//     const preElement = document.getElementById(configId);
//     if (preElement) {
//         preElement.innerHTML = preElement.innerHTML + `${data}<br>`;
//     } else {
//         console.error(`Element with id ${configId} not found.`);
//     }
// }



// sendBackInfo = (data, configId) => {
//     console.log("andar wala configID:::", configId);
    
//     let preElement = document.getElementById(configId);
    
//     // If the element does not exist, create it
//     if (!preElement) {
//         preElement = document.createElement('pre');
//         preElement.id = configId;
//         document.body.appendChild(preElement); // Or append it to the appropriate parent element
//     }
    
//     // Update the innerHTML of the preElement
//     preElement.innerHTML = preElement.innerHTML + `${data}<br>`;
// }




// sendBackInfo = (data, configId) => {
//     console.log("andar wala configID:::", configId);
    
//     const divElement = document.getElementById(configId);
//     if (divElement) {
//         divElement.innerHTML = divElement.innerHTML + `${data}<br>`;
//     } else {
//         console.error(`Element with id ${configId} not found.`);
//     }
// }












// var exec = require('child_process').exec, child;
// var fs = require('fs');
// var kill = require('tree-kill');
// var logfilename = __dirname + "\\" + "opc-logs.txt";
// var command_to_run = properties.get("DRIVER");

// if (!command_to_run) {
//     command_to_run = "java -jar OPCClient_NEW.jar";
// }

// var firstword = command_to_run.split(' ')[0];
// console.log(command_to_run);
// console.log("program application", firstword);

// start = (configId) => {
//     console.log("configID krishna::", configId);
//     clearInfo();
//     fs.closeSync(fs.openSync(logfilename, 'w'));

//     var clientId = localStorage.getItem("clientId");
//     console.log(command_to_run + ' ' + clientId + ' ' + configId);
//     var process = exec(command_to_run + ' ' + clientId + ' ' + configId, { "cwd": __dirname });
//     console.log(process);

//     fs.closeSync(fs.openSync(__dirname + "\\" + configId + ".pid", 'w'));
//     fs.appendFileSync(__dirname + "\\" + configId + ".pid", process.pid.toString() + "\n");

//     process.stderr.on('data', function (data) {
//         fs.appendFileSync(logfilename, data);
//         sendBackInfo(data, configId);
//     });

//     process.stdout.on('data', function (data) {
//         fs.appendFileSync(logfilename, data);
//         sendBackInfo(data, configId);
//     });
// }

// test = (form, configId) => {
//     clearInfo();
//     fs.closeSync(fs.openSync(logfilename, 'w'));
//     var clientId = localStorage.getItem("clientId");

//     if (form.tags.length > 0) {
//         console.log(command_to_run + ' ' + clientId + ' ' + 'TEST' + ' ' + form.OPC_SERVER_USER + ' ' + form.OPC_SERVER_PASS + ' ' + form.OPC_SERVER_HOST + ' ' + form.OPC_SERVER_PROGID + ' ' + form.OPC_SERVER_CLSID + ' ' + form.TAG_PREFIX + ' ' + form.DATA_TAG_TYPE + ' ' + form.SUBSCRIBE_INTERVAL + ' ' + form.tags[0]["dataTagId"] + ' ' + form.tags[0]["PROG_ID_PREFER"]);
        
//         var process = exec(command_to_run + ' ' + clientId + ' ' + 'TEST' + ' ' + form.OPC_SERVER_USER + ' ' + form.OPC_SERVER_PASS + ' ' + form.OPC_SERVER_HOST + ' ' + form.OPC_SERVER_PROGID + ' ' + form.OPC_SERVER_CLSID + ' ' + form.TAG_PREFIX + ' ' + form.DATA_TAG_TYPE + ' ' + form.SUBSCRIBE_INTERVAL + ' ' + form.tags[0]["dataTagId"] + ' ' + form.tags[0]["PROG_ID_PREFER"], { "cwd": __dirname });
        
//         console.log(process);
//         fs.appendFileSync(__dirname + "\\" + "test.pid", process.pid.toString() + "\n");

//         process.stderr.on('data', function (data) {
//             fs.appendFileSync(logfilename, data);
//             sendBackInfo(data, configId);
//         });

//         process.stdout.on('data', function (data) {
//             fs.appendFileSync(logfilename, data);
//             sendBackInfo(data, configId);
//         });
//     } else {
//         sendBackInfo("Please add at least one tag in the form", configId);
//     }
// }

// stop = (configId) => {
//     try {
//         var pids = fs.readFileSync(__dirname + "\\" + configId + ".pid").toString();
//     } catch (err) {
//         if (err.code !== 'ENOENT') {
//             return;
//         }
//         return;
//     }

//     var count = 0;
//     pids.split('\n').map(function (pid) {
//         if (pid) {
//             console.log(pid);
//             kill(parseInt(pid));
//             console.log("killed", pid);
//             count = count + 1;
//             var msg = "\nStopped process with process id " + pid.toString();
//             fs.appendFileSync(logfilename, msg);
//             sendBackInfo(msg, configId);
//         }
//     });

//     try {
//         fs.unlinkSync(__dirname + "\\" + configId + ".pid");
//         console.log("PID File is deleted.");
//     } catch (error) {
//         console.log("Unable to remove this process");
//         stopAll();
//         console.log("Stopped all OPC instances!");
//     }
// }

// stopAll = () => {
//     var stop_command = `taskkill /f /im ${firstword}.exe`;
//     var x = exec(stop_command);
//     console.log("stopping all");
//     console.log(stop_command, x);
//     var msg = "\nKilled all instances of OPC server";
//     sendBackInfo(msg);
// }

// clearInfo = () => {
//     document.getElementById("pre").innerHTML = "";
// }

// sendBackInfo = (data, configId) => {
//     console.log("andar wala configID:::", configId);
    
//     const preElement = document.getElementById(`pre-${configId}`);
//     // if (preElement) {
//         preElement.innerHTML = preElement.innerHTML + `${data}<br>`;
//     // } else {
//     //     console.error(`Element with id "pre-${configId}" not found.`);
//     // }
// }


// // sendBackInfo = (data, configId) => {
// //     console.log("andar wala configID:::",configId);

// //     document.getElementById("pre").innerHTML = document.getElementById("pre").innerHTML + `${data}<br>`;

// //     // document.getElementById("pre").innerHTML = document.getElementById("pre").innerHTML + `Config ID: ${configId} - ${data}<br>`;
// // }

// // Remember and wait for my command
