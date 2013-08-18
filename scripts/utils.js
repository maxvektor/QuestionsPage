function bindStartHandlers() {
    $(".js-start-quest").click(function () {
        $(this).addClass("disabled");
        $(".js-header-hello").animate({
                height: "toggle",
                opacity: "toggle"
            },
            1000,
            "linear",
            turnLightsOn(function () {
                $(".content").show();
                $(".questions-wrapper").fadeIn("slow");
                bindLightsToQuestions();
                $(".js-number-of-questions-wrapper").show();
                setRoadPointer();

            })

        );
    });
    $('.carousel').carousel({
        interval: false
    })
};

function bindLightsToQuestions() {
    $(".question-road-item-light").on({
        "click": function () {
            var number = $(".question-road-item-light").index($(this));
            $('.carousel').carousel(number);
        }
    })
}

function turnLightsOn(callback) {
    var interval = setInterval(
        function () {
            var lightArr = $(".question-road-item-light").not(".yellow-light");
            if (lightArr.length == 0) {
                clearInterval(interval)
                if (typeof callback == "function") callback();
            }
            $(lightArr[0]).addClass("yellow-light");
        },
        100
    )
}

var errorTimer = null;
function fireError(text) {
    $(".success-holder").hide();
    $(".error-alert-message").text(text);
    $(".error-holder").fadeIn("fast", function () {
        bindShowTimer();
    })
    $(".error-holder").mouseover(function () {
            clearInterval(errorTimer);
        }
    )
    $(".error-holder").mouseleave(function () {
            clearInterval(errorTimer);
            bindShowTimer();

        }
    )
}

function bindShowTimer() {
    errorTimer = setTimeout(function () {
            hideError();
        }
        , 2800
    )
}

function hideError() {
    $(".error-holder").fadeOut("fast")
}

function fireSuccess() {
    $(".error-holder").hide();
    var successTimer = null;
    $(".success-holder").fadeIn("slow", function () {
        bindShowTimer();
    });

    successTimer = setTimeout(function () {
            $(".success-holder").fadeOut();
            clearTimeout(successTimer);
        },
        3000
    )
}


function startQuest() {
    console.log("quest started")
}


function generateRoad() {
    var numberOfQuestions = questions.length;
    var qWrapper = $(".questions-road-wrapper");
    var roadBG = $("<div>").addClass("questions-road-bg");
    var stretch = $("<span>").addClass("question-road-stretch");
    for (var i = 0; i < numberOfQuestions; i++) {
        var roadItem = $("<div>").addClass("question-road-item").append(
            $("<div>").addClass("question-road-item-light-wrapper").append(
                $("<div>").addClass("question-road-item-light").append(
                    $("<img>").attr("src", "img/traffic-light-empty.png")
                )
            )
        )
        roadBG.append(roadItem);
        roadBG.html(roadBG.html() + " ");
    }
    roadBG.append(stretch);
    qWrapper.append(roadBG);
}

function generateQuestions() {
    var container = $("#questions-carousel").find(".carousel-inner");
    for (var i in questions) {
        var wrapper = $("<div>").addClass("item");
        var questionDiv = $("<div>").addClass("question-question").text(questions[i].text);
        var answerDiv = $("<div>").addClass("question-answer").append($("<textarea>").addClass("question-answer-input"));
        var submit = $("<div>").addClass("road-pointer-direction-wrapper")
            .addClass("question-control-button")
            .addClass("js-submit-answer")
            .attr("id", "q-" + i)
            .append(
                $("<div>").addClass("road-pointer-text")
                    .addClass("road-pointer-bag")
                    .text("Ответить")
            )
        submit.click(function (e) {
            index = $(".js-submit-answer").index(this);
            var isValid = validateCurrentAnswer(index);
            markValidOrNot(index, isValid);
            if (isValid.isValid) {
                fireSuccess();
                $('.carousel').carousel('next');
            }
        })
        wrapper.append([questionDiv, answerDiv, submit]);
        container.append(wrapper);
    }
    $(".item").first().addClass("active");
}

function validateCurrentAnswer(numder) {
    var index = numder;
    var answer = $($(".js-submit-answer")[index]).parent().find(".question-answer-input").val();
    var valid = validateAnswer(index, answer);
    return valid;
};

function markValidOrNot(index, valid) {
    if (!valid.isValid) {
        $($(".question-road-item-light")[index])
            .removeClass('yellow-light')
            .removeClass('green-light')
            .addClass("red-light");
        fireError(valid.message);
    } else {
        $($(".question-road-item-light")[index])
            .removeClass('yellow-light')
            .removeClass("red-light")
            .addClass("green-light");
    }
    setRoadPointer();
}

function setRoadPointer() {
    var questionsToDo = questions.length - numberOfValid();
    $(".js-number-of-questions").text("Яндекс  " + (questionsToDo));
    if (questionsToDo == 0) {
        $(".js-submit-form").show();
        $('#last-submit').modal('show')
    } else {
        $(".js-submit-form").hide();
    }
}

function validateAnswer(index, answer) {
    var isValid = {isValid: true};
    var question = questions[index];
    if (question.validation) {
        if (question.validation.minWidth) {
            if (question.validation.minWidth > answer.length) isValid =
            {
                isValid: false,
                message: "Слишком коротко. Вы можете лучше"
            };
        }
    }
    return isValid;
}

function numberOfValid() {
    var numberOfvalid = 0;
    for (var i in questions) {
        var isValid = validateCurrentAnswer(i);
        if (isValid.isValid) numberOfvalid++
    }
    return numberOfvalid;
}


$(document).ready(function () {
    bindStartHandlers();
    generateQuestions();
    generateRoad();
})
