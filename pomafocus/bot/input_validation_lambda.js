'use strict';
exports.handler = (event, context, callback) => {
    const sessionAttributes = event.sessionAttributes;
    const slots = event.currentIntent.slots;
    console.log(slots);
    const longbreaksize = slots.longbreaksize;
    const pomodorosize = slots.pomodorosize;
    const shortbreaksize = slots.shortbreaksize;
    
    console.log("S", shortbreaksize, "L", longbreaksize, "P", pomodorosize);
    // predefined list of available books
    const validPomodoroSize = [20, 30];
    const validShortBreak = [3, 7];
    const validLongBreak = [20, 30];
  
    // validate long break 
    if (longbreaksize && (validLongBreak[0]>longbreaksize || validLongBreak[1]<longbreaksize)) {
        let response = { sessionAttributes: event.sessionAttributes,
          dialogAction: {
            type: "ElicitSlot",
             message: {
               contentType: "PlainText",
               content: `Long break of ${longbreaksize} minutes is invalid, please select valid long break between 20-30 minutes`
            },
             intentName: event.currentIntent.name,
             slots: slots,
             slotToElicit : "longbreaksize"
          }
        };
        callback(null, response);
    }
    
    //validate short break
    if (shortbreaksize && (validShortBreak[0]>shortbreaksize || validShortBreak[1]<shortbreaksize)) {
        let response = { sessionAttributes: event.sessionAttributes,
          dialogAction: {
            type: "ElicitSlot",
             message: {
               contentType: "PlainText",
               content: `Short break of ${shortbreaksize} minutes is invalid, please select valid short break between 3-7 minutes`
            },
             intentName: event.currentIntent.name,
             slots: slots,
             slotToElicit : "shortbreaksize"
          }
        };
        callback(null, response);
    }
  
    //validate pomodoro size
    if (pomodorosize && (validPomodoroSize[0]>pomodorosize || validPomodoroSize[1]<pomodorosize)) {
        let response = { sessionAttributes: event.sessionAttributes,
          dialogAction: {
            type: "ElicitSlot",
             message: {
               contentType: "PlainText",
               content: `Pomodoro size of ${pomodorosize} minutes is invalid, please select valid pomodoro size between 20-30 minutes`
            },
             intentName: event.currentIntent.name,
             slots: slots,
             slotToElicit : "pomodorosize"
          }
        };
        callback(null, response);
    }
    
    // if valid book name is obtained, send command to choose next course of action
    let response = {sessionAttributes: sessionAttributes,
      dialogAction: {
        type: "Delegate",
        slots: event.currentIntent.slots
      }
    };
    callback(null, response);
};
