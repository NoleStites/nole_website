// Import CSS variables
const root = document.documentElement;
const digit_font_size = Number(getComputedStyle(root).getPropertyValue('--digit-font-size').slice(0,-2));
const digit_gap_in_column = Number(getComputedStyle(root).getPropertyValue('--digit-gap-in-column').slice(0,-2));

// Creates and returns a column of digits 0-9
function makeDigitColumn(new_id) {
    let column = document.createElement("div");
    column.classList.add("digit_column");
    column.id = new_id;

    for (let i = 0; i < 10; i++) {
        let digit = document.createElement("h3");
        digit.classList.add("digit");
        digit.innerHTML = i;
        column.appendChild(digit);
    }

    return column;
}

// Given the column of digits to change and a new digit, will shift to the new digit
function changeDigit(column_id, new_digit) {
    let column = document.getElementById(column_id);
    const shift_value = -1*new_digit*(digit_font_size + digit_gap_in_column);
    column.style.transform = `translateY(${shift_value}px)`;
}

// Appends a zero to the front of single-digit numbers
function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}

// Given the new hour, minute, and second, will adjust the displayed time
function adjustTime(hour, minute, second) {
    hour = String(hour);
    minute = String(minute);
    second = String(second);

    changeDigit("hour_ten", hour[0]);
    changeDigit("hour_one", hour[1]);
    changeDigit("minute_ten", minute[0]);
    changeDigit("minute_one", minute[1]);
    changeDigit("second_ten", second[0]);
    changeDigit("second_one", second[1]);
}

// Get the clock to populate with digits
let clock_box = document.getElementById("clock_box");

// Create the special colon and decimal digits
let colon_char = document.createElement("h3");
colon_char.classList.add("digit");
colon_char.innerHTML = ":";
let decimal_char = document.createElement("h3");
decimal_char.classList.add("digit");
decimal_char.innerHTML = ".";

// Create the digit columns
clock_box.appendChild(makeDigitColumn("hour_ten"));
clock_box.appendChild(makeDigitColumn("hour_one"));
clock_box.appendChild(colon_char);
clock_box.appendChild(makeDigitColumn("minute_ten"));
clock_box.appendChild(makeDigitColumn("minute_one"));
clock_box.appendChild(decimal_char);
clock_box.appendChild(makeDigitColumn("second_ten"));
clock_box.appendChild(makeDigitColumn("second_one"));

// Update the displayed time every second
setInterval(function() {
    const d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    adjustTime(h, m, s);
}, 1000);