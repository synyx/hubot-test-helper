// Description:
//   Test script
export default (robot) => {
    robot.router.get("/hello/world", (req, res) => {
        res.status(200).send("Hello World!");
    });
};
