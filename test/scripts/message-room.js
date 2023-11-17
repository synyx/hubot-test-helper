// Description:
//   Test script
export default (robot) => {
    robot.respond(/announce (.+): (.+)$/i, msg => {
        robot.messageRoom(msg.match[1], '@' + msg.envelope.user.name + ' says: ' + msg.match[2]);
    });
}
