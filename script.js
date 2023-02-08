let arrayInputValues = [];
let arrayTrueResult = [];
let result;
const questionInputForms = document.getElementsByClassName("questionInputForm");
const questionStrings = document.getElementsByClassName("questionString");
const cardTrue = document.getElementById("boxGoodQuestion");
const cardGrade = document.getElementById("boxGrade");
const colorBackGrade = document.getElementsByClassName("styleCardGrade");
const cardEndTime = document.getElementById("boxEndTime");
const easyButton = document.getElementById('Easy')
const mediumButton = document.getElementById('Medium')
const hardButton = document.getElementById('Hard')
let startTime;
let endTime;

//Генератор чисел заданий
const randomInteger = (min, max) => {
    let randInt = min + Math.random() * (max + 1 - min);
    return Math.floor(randInt);
};

//Генератор оператора
const randomOperator = () => {
    let arrOperators = ["+", "-", "*", "/"];
    let randOp = Math.floor(Math.random() * arrOperators.length);
    return arrOperators[randOp];
};

//Стартовый уровень сложности
let quantityArgs = 3;

easyButton.onclick = () => {
    quantityArgs = 3;
    document.getElementById('dropdownMenuButton2').innerHTML = 'Выбран низкий уровень сложности'
    renewButton.disabled = true
}
mediumButton.onclick = () => {
    quantityArgs = 4;
    document.getElementById('dropdownMenuButton2').innerHTML = 'Выбран средний уровень сложности'
    renewButton.disabled = true
}
hardButton.onclick = () => {
    quantityArgs = 5;
    document.getElementById('dropdownMenuButton2').innerHTML = 'Выбран высокий уровень сложности'
    renewButton.disabled = true
}


//Создать вопрос в зависимости от уровня сложности
const randomExpression = (thisString, numberQuestion) => {
    let methods = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
    }

    let condition;
    let result;
    let arrayArgs;
    let arrayOperators;
    let arrayCondition;
    let finishCondition;

    //заполняем массив аргументов
    const createArgs = () => {
        arrayArgs = [];
        do {
            arrayArgs.push(randomInteger(5, 30));
        } while (arrayArgs.length < quantityArgs)
    }

    //заполняем массив операторов
    const createOperators = () => {
        arrayOperators = [];
        outer: do {
            for (let i = 0; i < arrayArgs.length - 1; i++) {
                arrayOperators.push(randomOperator())
            }
            if (arrayOperators.length > 2) {
                if (arrayOperators.includes('*') || arrayOperators.includes('/')) {
                    break;
                }
                continue outer;
            }
            break
        } while (true)

    }

    //заполняем полный массив для условия и вычисления
    const createCondition = () => {
        arrayCondition = [];
        for (let i = 0; i < arrayArgs.length; i++) {
            arrayCondition.push(arrayArgs[i]);
            arrayCondition.push(arrayOperators[i]);
        }
        finishCondition = [];
        finishCondition = arrayCondition.slice(0)
    }

    createArgs();
    createOperators();
    createCondition()

    console.log(`Аргументы: ${arrayArgs}`)
    console.log(`Операторы: ${arrayOperators}`)

    console.log(arrayCondition)

    let attempts = 0;
    changeArgs: do {
        attempts++;
        createArgs();
        createCondition();
        console.log(`Смена аргументов. Теперь массив = ${arrayCondition}`)
        if (attempts === 10) {
            attempts = 0;
            createOperators();
            createCondition()
            console.log(`Слишком много попыток. Замена операторов: ${arrayCondition}`)
        }
        result = undefined;
        startIteration: do {
            for (let index = 0; index < arrayCondition.length; index++) {
                let thisResult;

                //Проверяет на соответствие нормам каждую итерацию цикла
                const checkCondition = () => {
                    if (arrayCondition[index - 1] === arrayCondition[index + 1]) {
                        //если A = B цикл повторить
                        console.log(`${arrayCondition[index - 1]} = ${arrayCondition[index + 1]}, цикл повторить`)
                        return true;
                    } else (`${arrayCondition[index - 1]} не равно ${arrayCondition[index + 1]}, цикл продолжить`);
                    if (thisResult >= (quantityArgs * 150) || thisResult <= (quantityArgs * -150)) {
                        //если результат >= (quantityArgs * 150) или <= (quantityArgs * -150) - повторить цикл
                        console.log(`${thisResult} за пределами (${(quantityArgs * -150)}:${(quantityArgs * 150)}), цикл повторить`)
                        return true;
                    } else console.log(`${thisResult} в пределах (${(quantityArgs * -150)}:${(quantityArgs * 150)}), цикл продолжить`);
                    if (Number.isInteger(thisResult)) {
                        //число результата не целое, цикл повторить
                        console.log(`${thisResult} целое число, цикл продолжить`)
                        return false;
                    } else {
                        console.log(`${thisResult} не целое число, цикл повторить`)
                        return true;
                    }
                }
                if (arrayCondition[index] === '*' || arrayCondition[index] === '/') {
                    thisResult = methods[arrayCondition[index]](arrayCondition[index - 1], arrayCondition[index + 1]);
                    if (checkCondition()) {
                        continue changeArgs;
                    } else {
                        arrayCondition.splice(index - 1, 3, thisResult)
                        continue startIteration;
                    }
                } else if ((arrayCondition[index] === '+' || arrayCondition[index] === '-') && !(arrayCondition.includes('*') || arrayCondition.includes('/'))) {
                    thisResult = methods[arrayCondition[index]](arrayCondition[index - 1], arrayCondition[index + 1]);
                    if (checkCondition()) {
                        continue changeArgs;
                    } else {
                        arrayCondition.splice(index - 1, 3, thisResult)
                        continue startIteration;
                    }
                }
            }
            break;
        } while (true)
        condition = finishCondition.join(' ')
        result = arrayCondition[0]
        console.log(arrayCondition)
        break;
    } while (true);

    console.log(`Итог: ${result}`)

    thisString.innerHTML = `${numberQuestion}. Сколько будет ${condition}?`;
    console.log(`Вопрос ${numberQuestion}: ответ - ${result}`);
    return result;
}

//Кнопка "Начать новый тест"
let startButton = document.getElementById("startButton");
startButton.onclick = () => {
    resetTest();
    console.clear();
    arrayTrueResult = [];
    let startNumberQuestion = 1;
    for (let questionString of questionStrings) {
        arrayTrueResult.push(randomExpression(questionString, startNumberQuestion));
        startNumberQuestion++;
    }
    startTime = new Date().getTime();
    console.log(arrayTrueResult);
};

//Кнопка "Отправить результат"
let finishButton = document.getElementById("finishButton");
finishButton.disabled = true;
finishButton.onclick = checkResult;

//Проверяем результат
function checkResult() {
    //помещаем введенные значения в массив arrayInputValues
    for (let question of questionInputForms) {
        arrayInputValues.push(question.value);
    }

    //подсветить поле ввода желтым
    const highlightInput = (question) => {
        question.style.backgroundColor = "yellow";
        setTimeout(
            () => ((question.value = ""), (question.style.backgroundColor = "white")),
            800
        );
    };

    //Проверяем, все ли вопросы введены
    if (arrayInputValues.includes("")) {
        arrayInputValues = [];
        for (let question of questionInputForms) {
            if (question.value === "") {
                highlightInput(question);
            }
        }
        return setTimeout(() => alert("Пройдены не все вопросы!"), 500);
    }

    //Проверяем, все ли вопросы - числа
    for (let value of arrayInputValues) {
        if (isNaN(value)) {
            arrayInputValues = [];
            for (let question of questionInputForms) {
                if (isNaN(question.value)) {
                    highlightInput(question);
                }
            }
            return setTimeout(() => alert("Вводите только цифры!"), 500);
        }
    }
    result = 0;
    //Чекаем и раскрашиваем каждую линию
    for (let i = 0; i < arrayInputValues.length; i++) {
        questionInputForms[i].disabled = true;
        if (arrayInputValues[i] === String(arrayTrueResult[i])) {
            questionInputForms[i].style.backgroundColor = "green";
            result++;
        } else {
            questionInputForms[i].style.backgroundColor = "red";
        }
    }
    //Выставляем значения в открытый доступ, а также ставим оценку за работу и вычисляем время выполнения
    endTime = new Date().getTime();
    let finalTime = Math.round((endTime - startTime) / 1000);
    startButton.disabled = false;
    finishButton.disabled = true;
    renewButton.disabled = false;
    cardTrue.innerHTML = result;
    cardGrade.innerHTML = setGrade();
    if (finalTime < 60) {
        cardEndTime.innerHTML = `${finalTime} сек.`;
    } else {
        cardEndTime.innerHTML = `${Math.round(finalTime / 60)} мин.`;
    }
}

//Вычисляем оценку согласно проценту правильных ответов
const setGrade = () => {
    let percentGood = (result * 100) / arrayInputValues.length;
    switch (true) {
        case percentGood >= 90:
            colorBackGrade[0].style.backgroundColor = "green";
            return "Отлично! :D";
        case percentGood < 90 && percentGood >= 70:
            colorBackGrade[0].style.backgroundColor = "darkgreen";
            return "Хорошо! :)";
        case percentGood < 70 && percentGood >= 50:
            colorBackGrade[0].style.color = "black";
            colorBackGrade[0].style.backgroundColor = "yellow";
            return "Так себе :/";
        case percentGood < 50 && percentGood >= 20:
            colorBackGrade[0].style.color = "black";
            colorBackGrade[0].style.backgroundColor = "orange";
            return "Плохо :(";
        case percentGood < 20:
            colorBackGrade[0].style.backgroundColor = "red";
            return "Нет мозга :'(";
    }
};

//Кнопка "Начать тест заново"
let renewButton = document.getElementById("renewButton");
renewButton.disabled = true;
renewButton.onclick = resetTest;

//сбросить тест до стартового варианта
function resetTest() {
    for (let question of questionInputForms) {
        question.disabled = false;
        question.value = "";
        question.style.backgroundColor = "white";
    }
    arrayInputValues = [];
    colorBackGrade[0].style.color = "white";
    colorBackGrade[0].style.backgroundColor =
        "RGBA(108, 117, 125, var(--bs-bg-opacity, 1))";
    result = "";
    cardTrue.innerHTML = result;
    cardGrade.innerHTML = "";
    cardEndTime.innerHTML = "";
    startButton.disabled = true;
    finishButton.disabled = false;
    renewButton.disabled = true;
    startTime = new Date().getTime();
}

//Тестовые кнопки для генерации значений
//Ввести true result
let testButton = document.getElementById("testButton");
testButton.onclick = () => {
    if (checkArrayTrueResult()) {
        for (let i = 0; i < arrayTrueResult.length; i++) {
            questionInputForms[i].value = arrayTrueResult[i];
        }
    }
};

//Ввести false result
let testButton2 = document.getElementById("testButton2");
testButton2.onclick = () => {
    if (checkArrayTrueResult()) {
        for (let i = 0; i < arrayTrueResult.length; i++) {
            questionInputForms[i].value = 10000;
        }
    }
};

//Ввести true/false
let testButton3 = document.getElementById("testButton3");
testButton3.onclick = () => {
    if (checkArrayTrueResult()) {
        for (let i = 0; i < arrayTrueResult.length; i++) {
            if (randomInteger(0, 1) === 1) {
                questionInputForms[i].value = 10000;
                continue;
            }
            questionInputForms[i].value = arrayTrueResult[i];
        }
    }
};

function checkArrayTrueResult() {
    if (arrayTrueResult.includes(undefined)) {
        return false;
    }
    if (!(cardGrade.innerHTML === "")) {
        return false;
    }
    return true;
}

