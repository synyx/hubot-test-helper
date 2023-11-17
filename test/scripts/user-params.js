// Description:
//   Test script
export default (robot) => {
    robot.listen(() => true, response => {
        response.send(JSON.stringify(response.message.user));
    });
}
