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
    console.log(digit_font_size, digit_gap_in_column);
    const shift_value = -1*new_digit*(digit_font_size + digit_gap_in_column);
    column.style.transform = `translateY(${shift_value}px)`;
}

function temp() {
    changeDigit("hour_one", 9);
}

let clock_box = document.getElementById("clock_box");

let colon_char = document.createElement("h3");
colon_char.classList.add("digit");
colon_char.innerHTML = ":";

let decimal_char = document.createElement("h3");
decimal_char.classList.add("digit");
decimal_char.innerHTML = ".";

clock_box.appendChild(makeDigitColumn("hour_ten"));
clock_box.appendChild(makeDigitColumn("hour_one"));
clock_box.appendChild(colon_char);
clock_box.appendChild(makeDigitColumn("minute_ten"));
clock_box.appendChild(makeDigitColumn("minute_one"));
clock_box.appendChild(decimal_char);
clock_box.appendChild(makeDigitColumn("second_ten"));
clock_box.appendChild(makeDigitColumn("second_one"));