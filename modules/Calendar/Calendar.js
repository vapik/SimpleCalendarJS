/**
 * Created by Veshtemov on 13.02.2017.
 */
(function () {
    "use strict";

    class Calendar {
        constructor(options) {
            this._el = options.el; // Контейнер с календарем (панель навигации в том числе)
            this._settings = {
                even: false, // показать четные
                odd: false, // показать нечетные
                holidays: true, // показать праздники
                disable: true // показать заблокированные
            };

            this._selectedDays = new Set();
            this._holidayList = (options.holidayList === null) ? [] : options.holidayList;
            this._disableList = (options.disableList === null) ? [] : options.disableList;

            this._init();
            this.render();


        }

        /**
         * Подписываемся на событие
         * @private
         */
        _init() {
            this._el.addEventListener('click', this._onClick.bind(this));

        }

        /**
         * Обрабатываем клики на календаре
         * @param {Event} event
         * @private
         */
        _onClick(event) {

            // Запрещаем действие по умолчанию
            event.preventDefault();

            // Источник события
            let target = event.target;

            // Кнопка "Четные дни"
            if (target.matches('#even')) {
                this._settings.even = !this._settings.even;
                this.render();
            }

            // Кнопка "Нечетные дни"
            if (target.matches('#odd')) {
                this._settings.odd = !this._settings.odd;
                this.render();
            }

            // Кнопка "Праздничные дни"
            if (target.matches('#holidays')) {
                this._settings.holidays = !this._settings.holidays;
                this.render();
            }

            // Кнопка "Запрещенные даты"
            if (target.matches('#disable')) {
                this._settings.disable = !this._settings.disable;
                this.render();
            }

            // Нажатие на дате переключает выделение
            if (target.matches('.calendar-board_day:not(.calendar-board_day__disable)')) {

                let _date = new Date(target.dataset.index);

                // + _date - Дата, взятая из ячейки с аттрибутом data-index, приведенная в мс от 1970
                let isSelected = this._selectedDays.has(+_date);
                if (isSelected) {
                    this._selectedDays.delete(+_date)
                } else {
                    this._selectedDays.add(+_date)
                }

                this.render();

            }
        }

        /**
         * Рендерим календарь
         */
        render() {

            const y = 1900 + new Date().getYear();
            //const y = 2016;

            let board = document.getElementById('calendar-board');
            board.innerHTML = "";

            /* Создаем месяцы */
            for (let i = 1; i <= 12; i++) {
                let month = document.createElement('div');
                month.classList.add('calendar-board_month');
                month.classList.add(`${y}-${i}`);
                month.innerHTML = `<div class="calendar-board_header">${this.getMonthName(i)} ${y}</div>
                              ${this._createCalendar(y, i)}`;
                board.appendChild(month);
            }

            // Список всех ячеек с днями
            let dayList = board.querySelectorAll('.calendar-board_day');

            // Подсветка четных дней
            if (this._settings.even) {
                for (let i = 0; i < dayList.length; i++) {
                    let num = parseInt(dayList[i].innerHTML);

                    if (!(num % 2)) {
                        dayList[i].classList.add('calendar-board_day__even');
                    }
                }
            }

            // Подстветка нечетных дней
            if (this._settings.odd) {
                for (let i = 0; i < dayList.length; i++) {
                    let num = parseInt(dayList[i].innerHTML);

                    if ((num % 2)) {
                        dayList[i].classList.add('calendar-board_day__odd');
                    }
                }
            }

            // Подствека праздничных дней
            if (this._settings.holidays) {
                for (let i = 0; i < this._holidayList.length; i++) {

                    for (let j = 0; j < dayList.length; j++) {
                        let _date = new Date(dayList[j].dataset.index);
                        if (this.isDaysEqual(_date, this._holidayList[i])) {
                            dayList[j].classList.add('calendar-board_day__holiday');
                            break;
                        }
                    }
                }
            }

            // Маркировка запрещенных дней
            if (this._settings.disable) {
                for (let i = 0; i < this._disableList.length; i++) {

                    for (let j = 0; j < dayList.length; j++) {
                        let _date = new Date(dayList[j].dataset.index);
                        if (this.isDaysEqual(_date, this._disableList[i])) {
                            dayList[j].classList.add('calendar-board_day__disable');
                            break;
                        }
                    }
                }
            }

            // Подсветка выделенных дней
            for (let selectedDate of this._selectedDays.values())
            {
                for (let j = 0; j < dayList.length; j++) {
                    let _date = new Date(dayList[j].dataset.index);
                    if (this.isDaysEqual(_date, new Date(selectedDate))) {
                        dayList[j].classList.add('calendar-board_day__selected');
                        break;
                    }
                }
            }

        }


        /**
         * Возвращает HTML-код месяца
         * @param year {number} - год
         * @param month {number} - месяц
         * @returns {string} - HTML код месяца
         * @private
         */
        _createCalendar(year, month) {

            let mon = month - 1; // месяцы в JS идут от 0 до 11, а не от 1 до 12
            let d = new Date(year, mon);

            let table = '<table><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>вс</th></tr><tr>';

            // заполнить первый ряд от понедельника
            // и до дня, с которого начинается месяц
            // * * * | 1  2  3  4
            for (let i = 0; i < this.getWeekDay(d); i++) {
                table += '<td></td>';
            }

            // ячейки календаря с датами
            while (d.getMonth() == mon) {

                table += `<td class="calendar-board_day" data-index="${d}">${d.getDate()}</td>`;

                if (this.getWeekDay(d) % 7 == 6) { // вс, последний день - перевод строки
                    table += '</tr><tr>';
                }

                d.setDate(d.getDate() + 1);
            }

            // добить таблицу пустыми ячейками, если нужно
            if (this.getWeekDay(d) != 0) {

                for (let i = this.getWeekDay(d); i < 7; i++) {
                    table += '<td></td>';
                }
            }

            // закрыть таблицу
            table += '</tr></table>';

            return table;
        }

        /**
         * Возвращает массив выделенных объектов
         * @returns {Array} - массив из формата Date
         */
        getSelectedDays() {
            let _arr = [];
            for (let selectedDate of this._selectedDays.values()) {
                _arr.push(selectedDate);
            }
            return _arr;
        }

        /**
         * Сбрасывает выделение, путем очищения списка выделенных дат и перерендеринга
         */
        resetSelected() {
            this._selectedDays.clear();
            this.render();
        }

        /**
         * Возвращает номер дня недели от 1 до 7
         * @param date {Date} - дата
         * @returns {number} - день недели
         */
        getWeekDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
            let day = date.getDay();
            if (day == 0) day = 7;
            return day - 1;
        }


        /**
         * Сравнивает 2 даты, надо чтобы совпадали дни
         * @param date1 {Data} - Дата 1
         * @param date2 {Data} - Дата 2
         * @returns {boolean}
         */
        isDaysEqual(date1, date2) {

            return (date1.getYear() == date2.getYear() &&
            date1.getMonth() == date2.getMonth() &&
            date1.getDate() == date2.getDate());

        }

        getMonthName(num) {
            let month = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
            return num > 0 ? month[num - 1] : '';
        }
    }


    // exports
    window.Calendar = Calendar;
}());