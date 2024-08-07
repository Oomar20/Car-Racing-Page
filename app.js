$(function () {
    let anim_id;

    // saving dom objects into variables
    let container = $("#container");
    let car = $('#car');
    let car1 = $("#car_1");
    let car2 = $("#car_2");
    let car3 = $("#car_3");

    let line1 = $("#line_1");
    let line2 = $("#line_2");
    let line3 = $("#line_3");
    let line4 = $("#line_4");

    let restartDiv = $("#restart_div");
    let restartBtn = $("#restart");
    let score = $("#score");
    let high_score = $("#high_score");

    // Saving the initial setup
    let containerWidth = parseInt(container.width());
    let containerHeight = parseInt(container.height());
    let carWidth = parseInt(car.width());
    let carHeight = parseInt(car.height());

    let game_over = false;
    let score_counter = 1;
    let speed = 2;
    let line_speed = 5;

    let move_right = false;
    let move_left = false;
    let move_up = false;
    let move_down = false;

    // *** Retrieve high score from localStorage ***
    if (localStorage.getItem('high_score')) {
        high_score.text(localStorage.getItem('high_score'));
    } else {
        high_score.text('0');
    }

    // Handling the car movement
    $(document).on("keydown", function (e) {
        if (game_over === false) {
            let key = e.keyCode;
            if (key === 37 && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === 39 && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === 38 && move_up === false) {
                move_up = requestAnimationFrame(up);
            } else if (key === 40 && move_down === false) {
                move_down = requestAnimationFrame(down);
            }
        }
    });

    $(document).on("keyup", function (e) {
        if (game_over === false) {
            let key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === 39) {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === 38) {
                cancelAnimationFrame(move_up);
                move_up = false;
            } else if (key === 40) {
                cancelAnimationFrame(move_down);
                move_down = false;
            }
        }
    });

    function left() {
        if (game_over === false && parseInt(car.css("left")) > 10) {
            car.css('left', parseInt(car.css("left")) - 3);
            move_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(car.css('left')) < containerWidth - 50) {
            car.css('left', parseInt(car.css('left')) + 3);
            move_right = requestAnimationFrame(right);
        }
    }

    function up() {
        if (game_over === false && parseInt(car.css("top")) > 0) {
            car.css('top', parseInt(car.css('top')) - 3);
            move_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(car.css('top')) < containerHeight - carHeight) {
            car.css('top', parseInt(car.css('top')) + 3);
            move_down = requestAnimationFrame(down);
        }
    }

    anim_id = requestAnimationFrame(repeat);

    function repeat() {
        if (game_over === false) {
            if (collision(car, car1) || collision(car, car2) || collision(car, car3)) {
                stop_the_game();
            }

            car_down(car1);
            car_down(car2);
            car_down(car3);

            line_down(line1)
            line_down(line2)
            line_down(line3)
            line_down(line4)

            anim_id = requestAnimationFrame(repeat);
            score_counter++;
            if (score_counter % 20 == 0) {
                let final_score = parseInt(score.text()) + 1;
                score.text(final_score);
                // *** Update high score in localStorage ***
                if (final_score > parseInt(high_score.text())) {
                    high_score.text(final_score);
                    localStorage.setItem('high_score', final_score);
                }
            }

            if (score_counter % 500 == 0) {
                speed++;
                line_speed++;
            }
        }
    }

    function car_down(car) {
        let current_top = parseInt(car.css("top"));
        if (current_top > containerHeight) {
            current_top = -200;
            let car_left = parseInt(Math.random() * (containerWidth - carWidth));
            car.css("left", car_left)
        }
        car.css("top", current_top + speed)
    }

    function line_down(line) {
        let line_current_top = parseInt(line.css("top"));
        if (line_current_top > containerHeight) {
            line_current_top = -300;
        }
        line.css("top", line_current_top + line_speed);
    }

    function stop_the_game() {
        game_over = true;
        cancelAnimationFrame(anim_id);
        cancelAnimationFrame(move_down);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_left);
        cancelAnimationFrame(move_up);
        restartDiv.slideDown();

        restartBtn.focus()
    }

    restartBtn.click(function () {
        location.reload();
    });

    // Checking for collisions
    function collision($div1, $div2) {
        let y1 = $div1.offset().top;
        let h1 = $div1.outerHeight(true);
        let x1 = $div1.offset().left;
        let w1 = $div1.outerWidth(true);
        let b1 = y1 + h1;
        let r1 = x1 + w1;
        let x2 = $div2.offset().left;
        let y2 = $div2.offset().top;
        let h2 = $div2.outerHeight(true);
        let w2 = $div2.outerWidth(true);
        let b2 = y2 + h2;
        let r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }
});
