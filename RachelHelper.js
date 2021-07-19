module.exports = {
    addToValuesAsInt: function (value1, value2) {
        return (parseInt(value1) + parseInt(value2))
    },
    getCurrentDate: function () {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        return dateTime;
    }
};

