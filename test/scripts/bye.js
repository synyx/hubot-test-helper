// Description:
//   Test script
export default (robot) => {
    robot.respond(/bye$/i, msg => {
        msg.reply('bye');
    });
}
