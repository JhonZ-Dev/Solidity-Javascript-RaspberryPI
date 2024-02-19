const TasksContract = artifacts.requiere("TasksContract");

module.exports = function(deployer){
    deployer.deploy(TasksContract);
}