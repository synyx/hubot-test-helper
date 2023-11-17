// Description:
//   Test script
export default (robot) => {
    robot.respond(/hi$/i, msg => {
        msg.reply('hi');
    });
}
