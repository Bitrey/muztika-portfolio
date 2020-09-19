// Zooming
new Zooming().listen("img");

// Carousel
const carouselDiv = document.querySelector(".carousel-inner");
let photosURL;

// Fetch photo URLs
(async () => {
    const { data } = await axios.get("/get-photos");
    photosURL = data;
    carouselDiv.innerHTML = "";
    photosURL.forEach((url, i) => {
        const div = document.createElement("div");
        // const emptyA = document.createElement("a");
        // emptyA.href = url;
        if (i == 0) {
            div.setAttribute("class", "carousel-item active");
        } else {
            div.setAttribute("class", "carousel-item");
        }
        const newImg = document.createElement("img");
        newImg.src = url;
        newImg.setAttribute("class", "d-block w-100");
        // emptyA.append(newImg);
        div.append(newImg);
        // div.append(emptyA);
        carouselDiv.append(div);
    });
    $("#show-on-load").show();
    $("#loading-div").hide();

    // lightGallery(carouselDiv);
    // console.log(photosURL);
})();

const isValidEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const formErrorSpan = $("#form-error");
let isFormSent = false;

const submitFormBtn = $("#submit-form");
submitFormBtn.on("click", async e => {
    try {
        // If this was a form, prevent sending it with standard HTML
        // e.preventDefault();

        if (isFormSent) return alert("Form already sent!");

        const emailElem = $("#email");
        const bodyElem = $("#body");

        const email = emailElem.val();
        const body = bodyElem.val();

        // Validation
        if (!isValidEmail(email) || body.length < 30 || body.length > 1000) {
            throw "Please enter a valid email and a message that's at least 30 characters long but shorter than 1000";
        }

        submitFormBtn.html(
            '<div class="spinner-border" role="status" style="display: none;">' +
                '<span class="sr-only">Loading...</span>' +
                "</div>"
        );

        await axios.post("/commission", { email, body });

        submitFormBtn.text("Form sent!");

        emailElem.attr("disabled", true);
        bodyElem.attr("disabled", true);
        submitFormBtn.attr("disabled", true);

        const displayFormMessageDiv = $("#display-form-message-div");
        $("#display-form-message").text(
            "Thanks for contacting me, I'll reply to you ASAP!"
        );
        displayFormMessageDiv.removeClass("alert-danger");
        displayFormMessageDiv.addClass("alert-success");
        displayFormMessageDiv.show();

        isFormSent = true;
    } catch (err) {
        $("#display-form-message").text(err);
        const displayFormMessageDiv = $("#display-form-message-div");
        displayFormMessageDiv.removeClass("alert-success");
        displayFormMessageDiv.addClass("alert-danger");
        displayFormMessageDiv.show();
    }
});
