// Description:
//   Test script
export default (robot) => {
    robot.listen(message => message.user.name === 'bob', response => {
        response.reply('hi');
    });
}
