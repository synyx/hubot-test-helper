// Description:
//   Test script
export default (robot) => {
    robot.listen(message => message.isCustom, response => {
        response.send(response.message.custom);
    });
}
