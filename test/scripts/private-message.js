// Description:
//   Test script
export default (robot) => {
    robot.respond(/tell me a secret$/i, msg => {
        msg.sendPrivate('whisper whisper whisper');
    });
}
