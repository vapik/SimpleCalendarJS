(function () {

    'use strict';
    // Инфорамация о праздничных днях и запрещенных к выделению
    let defaultData = {
        holidays: [
            new Date(2017, 1 - 1, 1),
            new Date(2017, 1 - 1, 7),
            new Date(2017, 2 - 1, 23),
            new Date(2017, 3 - 1, 8),
            new Date(2017, 5 - 1, 1),
            new Date(2017, 5 - 1, 9),
            new Date(2017, 6 - 1, 12),
            new Date(2017, 11 - 1, 5),
            new Date(2017, 12 - 1, 12)
        ],

        disables: [
            new Date(2017, 1 - 1, 1),
            new Date(2017, 1 - 1, 7),
            new Date(2017, 2 - 1, 23),
            new Date(2017, 3 - 1, 8),
            new Date(2017, 5 - 1, 1),
            new Date(2017, 5 - 1, 9),
            new Date(2017, 6 - 1, 12),
            new Date(2017, 11 - 1, 5),
            new Date(2017, 12 - 1, 12)]
    };


    // Созадем календарь
    let options = {
        el: document.getElementById('calendar'),
        holidayList: defaultData.holidays,
        disableList: defaultData.disables
    };

    let calendar = new Calendar(options);

    // Кнопки
    // TODO: Инкапсулировать кнопки в класс SimpleCalendarJS
    let butGetInfo = document.getElementById('get');
    butGetInfo.onclick = (evt) => {
        console.log('get info');
        let result = calendar.getSelectedDays();

        let dateOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }

        document.getElementById('result').textContent =
            result.map((item) => (new Date(item)).toLocaleString('ru', dateOptions))
                .join('\n');
    };

    let butReset = document.getElementById('deselect');
    butReset.onclick = (evt) => {
        calendar.resetSelected();
        console.log('reset');
    };

})();